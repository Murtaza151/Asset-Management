from __future__ import annotations

import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import add_to_date, get_datetime, now_datetime

from dexafleet_assets.utils import validate_company_access


STATUS_BY_HOLDER = {
    "Company": "In Company Stock",
    "Rider": "Assigned to Rider",
    "Workshop / Vendor": "With Vendor / Workshop",
    "Police / Authority": "In Police Custody",
    "Client": "At Client Location",
    "Other": "In Company Stock",
}


class DexaFleetCustodyMovement(Document):
    def before_insert(self):
        self.occurred_at = self.occurred_at or now_datetime()

    def validate(self):
        validate_company_access(self.company)
        self._validate_links()
        self._validate_holder()
        self._validate_timestamp()
        self._validate_reversal()

    def before_submit(self):
        self._lock_and_validate_latest_state()
        self.approval_status = "Approved"

    def on_submit(self):
        self._apply_asset_snapshot()

    def before_cancel(self):
        if self.reversed_by_movement:
            frappe.throw(_("This movement already has a submitted reversal."))

    def on_cancel(self):
        self.db_set("approval_status", "Reversed")
        self._rebuild_asset_snapshot()

    def _validate_links(self):
        asset_company = frappe.db.get_value("Asset", self.asset, "company")
        if asset_company != self.company:
            frappe.throw(_("Asset must belong to the selected company."))
        for rider_field in ("from_rider", "to_rider"):
            rider = self.get(rider_field)
            if rider and frappe.db.get_value("DexaFleet Rider", rider, "company") != self.company:
                frappe.throw(_("{0} must belong to the selected company.").format(self.meta.get_label(rider_field)))

    def _validate_holder(self):
        if self.to_holder_type == "Rider" and not self.to_rider:
            frappe.throw(_("To Rider is required when the destination holder is Rider."))
        if self.to_holder_type != "Rider" and self.to_rider:
            frappe.throw(_("To Rider can only be set when the destination holder is Rider."))
        if self.movement_type == "Handover to Rider" and self.to_holder_type != "Rider":
            frappe.throw(_("Handover to Rider must have Rider as destination holder."))
        if self.movement_type == "Return to Company" and self.to_holder_type != "Company":
            frappe.throw(_("Return to Company must have Company as destination holder."))

    def _validate_timestamp(self):
        future = add_to_date(now_datetime(), minutes=5)
        if self.occurred_at and get_datetime(self.occurred_at) > future:
            frappe.throw(_("Occurred At cannot be in the future."))

    def _validate_reversal(self):
        if self.is_reversal and (not self.source_movement or not self.reversal_reason):
            frappe.throw(_("Source Movement and Reversal Reason are required for a reversal."))
        if self.source_movement:
            source = frappe.get_doc("DexaFleet Custody Movement", self.source_movement)
            if source.docstatus != 1:
                frappe.throw(_("Only a submitted movement can be reversed."))
            if source.asset != self.asset or source.company != self.company:
                frappe.throw(_("Reversal source must reference the same asset and company."))

    def _lock_and_validate_latest_state(self):
        frappe.db.sql("select name from `tabAsset` where name=%s for update", self.asset)
        latest = frappe.db.sql(
            """
            select name, occurred_at, to_holder_type, to_rider, to_location
            from `tabDexaFleet Custody Movement`
            where asset=%s and docstatus=1 and name!=%s and occurred_at<=%s
            order by occurred_at desc, creation desc limit 1
            """,
            (self.asset, self.name, self.occurred_at),
            as_dict=True,
        )
        if latest:
            latest = latest[0]
            if self.from_holder_type and self.from_holder_type != latest.to_holder_type:
                frappe.throw(_("From Holder Type does not match the latest submitted custody movement {0}.").format(latest.name))
            if self.from_rider and self.from_rider != latest.to_rider:
                frappe.throw(_("From Rider does not match the latest submitted custody movement {0}.").format(latest.name))

        later = frappe.db.exists(
            "DexaFleet Custody Movement",
            {"asset": self.asset, "docstatus": 1, "occurred_at": (">", self.occurred_at), "name": ("!=", self.name)},
        )
        if later and not self.is_reversal:
            frappe.throw(_("A later submitted movement already exists. Use a controlled correction or reversal."))

        if self.to_rider:
            conflicting = frappe.db.sql(
                """
                select a.name
                from `tabAsset` a
                where a.name != %s and a.company = %s
                  and a.dexafleet_current_rider = %s
                  and a.dexafleet_custody_status = 'Assigned to Rider'
                limit 1
                """,
                (self.asset, self.company, self.to_rider),
            )
            if conflicting:
                frappe.throw(_("Rider is already assigned to asset {0}.").format(conflicting[0][0]))

    def _apply_asset_snapshot(self):
        status = STATUS_BY_HOLDER.get(self.to_holder_type, "In Company Stock")
        values = {
            "dexafleet_custody_status": status,
            "dexafleet_current_rider": self.to_rider if self.to_holder_type == "Rider" else None,
            "dexafleet_available_for_issue": 1 if self.to_holder_type == "Company" and self.condition not in {"Damaged", "Under Repair", "Lost", "Scrapped"} else 0,
            "dexafleet_blocking_reason": self.blocking_reason,
        }
        if self.to_location:
            values["location"] = self.to_location
        if self.to_holder_type == "Rider":
            values["dexafleet_last_handover"] = self.occurred_at
        if self.to_holder_type == "Company":
            values["dexafleet_last_return"] = self.occurred_at
        frappe.db.set_value("Asset", self.asset, values, update_modified=True)

    def _rebuild_asset_snapshot(self):
        latest_name = frappe.db.get_value(
            "DexaFleet Custody Movement",
            {"asset": self.asset, "docstatus": 1},
            "name",
            order_by="occurred_at desc, creation desc",
        )
        if latest_name:
            frappe.get_doc("DexaFleet Custody Movement", latest_name)._apply_asset_snapshot()
        else:
            frappe.db.set_value(
                "Asset",
                self.asset,
                {"dexafleet_custody_status": "In Company Stock", "dexafleet_current_rider": None, "dexafleet_available_for_issue": 1},
            )

    @frappe.whitelist()
    def make_reversal(self, reason: str):
        if self.docstatus != 1:
            frappe.throw(_("Only a submitted movement can be reversed."))
        if self.reversed_by_movement:
            return self.reversed_by_movement
        if not reason:
            frappe.throw(_("Reversal Reason is required."))

        reversal = frappe.copy_doc(self)
        reversal.name = None
        reversal.docstatus = 0
        reversal.movement_type = "Reversal"
        reversal.occurred_at = now_datetime()
        reversal.from_holder_type, reversal.to_holder_type = self.to_holder_type, self.from_holder_type or "Company"
        reversal.from_rider, reversal.to_rider = self.to_rider, self.from_rider
        reversal.from_location, reversal.to_location = self.to_location, self.from_location
        reversal.is_reversal = 1
        reversal.source_movement = self.name
        reversal.reversal_reason = reason
        reversal.insert()
        self.db_set("reversed_by_movement", reversal.name)
        return reversal.name
