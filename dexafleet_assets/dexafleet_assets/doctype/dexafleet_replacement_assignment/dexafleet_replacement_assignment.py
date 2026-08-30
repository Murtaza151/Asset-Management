import frappe
from frappe import _
from frappe.model.document import Document

from dexafleet_assets.utils import validate_company_access, validate_time_range


class DexaFleetReplacementAssignment(Document):
    def validate(self):
        validate_company_access(self.company)
        if self.original_asset == self.replacement_asset:
            frappe.throw(_("Original Asset and Replacement Asset must be different."))
        for asset in (self.original_asset, self.replacement_asset):
            if frappe.db.get_value("Asset", asset, "company") != self.company:
                frappe.throw(_("Asset {0} must belong to the selected company.").format(asset))
        if frappe.db.get_value("DexaFleet Rider", self.rider, "company") != self.company:
            frappe.throw(_("Rider must belong to the selected company."))
        validate_time_range(self.start_at, self.expected_return_at, "replacement assignment")
        if self.actual_return_at:
            validate_time_range(self.start_at, self.actual_return_at, "replacement return")
            self.status = "Returned"
        if self.status == "Active":
            conflict = frappe.db.exists("DexaFleet Replacement Assignment", {"name": ("!=", self.name), "replacement_asset": self.replacement_asset, "status": "Active"})
            if conflict:
                frappe.throw(_("Replacement Asset is already used by active assignment {0}.").format(conflict))

