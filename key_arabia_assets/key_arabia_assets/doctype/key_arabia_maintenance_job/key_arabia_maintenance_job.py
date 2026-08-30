from __future__ import annotations

import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import flt

from key_arabia_assets.utils import money_equal, validate_company_access


class KeyArabiaMaintenanceJob(Document):
    def validate(self):
        validate_company_access(self.company)
        self._validate_links()
        self._snapshot_and_calculate_items()
        self._calculate_allocations()
        self._validate_submission_rules()

    def before_submit(self):
        if self.status not in {"Pending Approval", "Ready for Road"}:
            frappe.throw(_("Maintenance Job must be Pending Approval before submission."))
        if "Key Arabia Company Admin" not in frappe.get_roles() and "System Manager" not in frappe.get_roles():
            frappe.throw(_("Only Key Arabia Company Admin can approve and submit a maintenance bill."))
        self.status = "Ready for Road"

    def on_cancel(self):
        self.db_set("status", "Cancelled")

    def _validate_links(self):
        asset_company = frappe.db.get_value("Asset", self.asset, "company")
        if asset_company != self.company:
            frappe.throw(_("Asset must belong to the selected company."))
        self.current_rider = frappe.db.get_value("Asset", self.asset, "key_arabia_current_rider")

    def _snapshot_and_calculate_items(self):
        total = 0.0
        next_service = 0
        main_work_count = 0
        for row in self.items:
            item = frappe.db.get_value(
                "Key Arabia Maintenance Item",
                row.maintenance_item,
                ["company", "item_name", "item_type", "approved_price", "service_interval_km", "required_evidence", "is_active"],
                as_dict=True,
            )
            if not item or item.company != self.company or not item.is_active:
                frappe.throw(_("Maintenance Item {0} is not active for this company.").format(row.maintenance_item))
            if item.item_type == "Main Work":
                main_work_count += 1
            row.item_name = item.item_name
            row.unit_price = flt(item.approved_price)
            row.quantity = flt(row.quantity) or 1
            row.line_total = flt(row.quantity * row.unit_price, 2)
            row.service_interval_km = item.service_interval_km
            row.required_evidence = item.required_evidence
            total += row.line_total
            if item.service_interval_km:
                next_service = max(next_service, int(self.current_meter or 0) + int(item.service_interval_km))
        if main_work_count > 1:
            frappe.throw(_("Only one Main Work item is allowed per maintenance job."))
        self.items_total = flt(total, 2)
        self.grand_total = flt(self.items_total + flt(self.labour), 2)
        self.next_service_km = next_service or None

    def _calculate_allocations(self):
        self.allocation_total = flt(sum(flt(row.amount) for row in self.allocations), 2)
        self.rider_charge = flt(sum(flt(row.amount) for row in self.allocations if row.charge_to == "Rider"), 2)
        self.allocation_difference = flt(self.grand_total - self.allocation_total, 2)

    def _validate_submission_rules(self):
        if self.docstatus == 0 and self.status in {"Pending Approval", "Ready for Road"}:
            if not self.invoice_number:
                frappe.throw(_("Invoice Number is required before submission."))
            if not self.items:
                frappe.throw(_("At least one maintenance item is required."))
            if not money_equal(self.grand_total, self.allocation_total):
                frappe.throw(_("Charge Allocation must equal Grand Total."))
            if self.rider_charge > 0 and not self.invoice_file:
                frappe.throw(_("Invoice Picture / PDF is required when Charge to Rider is greater than zero."))
            required = ",".join(row.required_evidence or "" for row in self.items).lower()
            evidence = {
                "invoice": self.invoice_file,
                "meter photo": self.meter_photo,
                "before photos": self.before_photos,
                "after photos": self.after_photos,
            }
            for label, value in evidence.items():
                if label in required and not value:
                    frappe.throw(_("{0} is required by the selected maintenance items.").format(label.title()))

    @frappe.whitelist()
    def submit_for_approval(self):
        if self.status not in {"Draft", "In Progress", "Correction Required"}:
            frappe.throw(_("This job cannot be submitted for approval in its current status."))
        self.status = "Pending Approval"
        self.save()
        return self

    @frappe.whitelist()
    def request_correction(self, reason: str):
        if not reason:
            frappe.throw(_("Correction reason is required."))
        self.status = "Correction Required"
        self.add_comment("Info", _("Correction requested: {0}").format(reason))
        self.save()
        return self

