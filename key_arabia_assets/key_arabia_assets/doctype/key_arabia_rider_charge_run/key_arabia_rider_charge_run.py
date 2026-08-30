import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import flt, getdate, now_datetime

from key_arabia_assets.utils import validate_company_access


class KeyArabiaRiderChargeRun(Document):
    def validate(self):
        validate_company_access(self.company)
        if self.from_date and self.to_date and getdate(self.to_date) < getdate(self.from_date):
            frappe.throw(_("To Date cannot be before From Date."))
        self._calculate_totals()

    def _calculate_totals(self):
        included = [row for row in self.sources if row.status != "Excluded"]
        self.total_sources = len(included)
        self.total_riders = len({row.rider for row in included})
        self.total_amount = flt(sum(flt(row.amount) for row in included), 2)

    @frappe.whitelist()
    def calculate(self):
        if self.status not in {"Draft", "Calculated"}:
            frappe.throw(_("Only a Draft or Calculated run can be recalculated."))
        self.sources = []
        self._append_sources("Key Arabia Fine", "issued_at")
        self._append_sources("Key Arabia Salik Transaction", "trip_at")
        self._append_maintenance_sources()
        self.status = "Calculated"
        self._calculate_totals()
        self.save()
        return self

    def _append_sources(self, doctype: str, date_field: str):
        rows = frappe.get_all(
            doctype,
            filters={"company": self.company, "status": "Approved for Charge", "charge_run": ["in", ["", None]], date_field: ["between", [self.from_date, self.to_date]]},
            fields=["name", "rider", "asset", date_field, "amount"],
        )
        for row in rows:
            if row.rider:
                self.append("sources", {"source_type": doctype, "source_name": row.name, "rider": row.rider, "asset": row.asset, "transaction_at": row[date_field], "amount": row.amount, "status": "Included"})

    def _append_maintenance_sources(self):
        rows = frappe.get_all(
            "Key Arabia Maintenance Job",
            filters={"company": self.company, "docstatus": 1, "job_date": ["between", [self.from_date, self.to_date]], "rider_charge": [">", 0]},
            fields=["name", "asset", "current_rider", "job_date", "rider_charge"],
        )
        existing = frappe.get_all("Key Arabia Charge Source", filters={"source_type": "Key Arabia Maintenance Job", "source_name": ["in", [row.name for row in rows]]}, pluck="source_name") if rows else []
        for row in rows:
            if row.current_rider and row.name not in existing:
                self.append("sources", {"source_type": "Key Arabia Maintenance Job", "source_name": row.name, "rider": row.current_rider, "asset": row.asset, "transaction_at": row.job_date, "amount": row.rider_charge, "status": "Included"})

    @frappe.whitelist()
    def approve(self):
        if self.status not in {"Calculated", "Reviewed"}:
            frappe.throw(_("Run must be Calculated or Reviewed before approval."))
        if "Key Arabia Finance Manager" not in frappe.get_roles() and "System Manager" not in frappe.get_roles():
            frappe.throw(_("Key Arabia Finance Manager role is required."))
        for row in self.sources:
            if row.status == "Excluded":
                continue
            source = frappe.get_doc(row.source_type, row.source_name)
            if source.get("charge_run") and source.charge_run != self.name:
                frappe.throw(_("Source {0} is already included in another charge run.").format(row.source_name))
            if source.meta.has_field("charge_run"):
                source.db_set("charge_run", self.name)
                source.db_set("status", "Included in Charge Run")
        self.status = "Approved"
        self.approved_by = frappe.session.user
        self.approved_at = now_datetime()
        self.save()
        return self

    @frappe.whitelist()
    def mark_posted(self, reference_type: str, reference_name: str):
        if self.status != "Approved":
            frappe.throw(_("Only an Approved run can be posted."))
        if not frappe.db.exists(reference_type, reference_name):
            frappe.throw(_("Posting reference does not exist."))
        self.posting_reference_type = reference_type
        self.posting_reference = reference_name
        self.status = "Posted"
        for row in self.sources:
            if row.status != "Excluded":
                row.status = "Posted"
                source = frappe.get_doc(row.source_type, row.source_name)
                if source.meta.has_field("status"):
                    source.db_set("status", "Posted")
        self.save()
        return self

