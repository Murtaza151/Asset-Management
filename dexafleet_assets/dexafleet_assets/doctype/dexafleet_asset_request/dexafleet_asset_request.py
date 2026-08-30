import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import nowdate

from dexafleet_assets.utils import append_audit_comment, validate_company_access


class DexaFleetAssetRequest(Document):
    def before_insert(self):
        self.requested_by = self.requested_by or frappe.session.user
        self.request_date = self.request_date or nowdate()

    def validate(self):
        validate_company_access(self.company)
        self.asset_name = " ".join((self.asset_name or "").split())
        if self.request_type == "Asset Edit" and not self.existing_asset:
            frappe.throw(_("Existing Asset is required for an Asset Edit request."))
        if self.code_mode == "Manual Override - Approval Required" and not self.requested_asset_code:
            frappe.throw(_("Requested Asset Code is required for manual override."))
        if self.status == "Rejected" and not self.rejection_reason:
            frappe.throw(_("Rejection Reason is required."))
        item = frappe.db.get_value(
            "Item", self.fixed_asset_item, ["is_fixed_asset", "is_stock_item", "disabled", "asset_category"], as_dict=True
        )
        if not item or item.disabled or not item.is_fixed_asset or item.is_stock_item:
            frappe.throw(_("Fixed Asset Item must be enabled, non-stock, and marked as a fixed asset."))
        if item.asset_category and item.asset_category != self.erpnext_asset_category:
            frappe.throw(_("ERPNext Asset Category must match the selected Fixed Asset Item."))
        self._validate_company_links()

    def on_update(self):
        if self.has_value_changed("status"):
            append_audit_comment(self, _("Status changed to {0}.").format(self.status))

    def _validate_company_links(self):
        if self.existing_asset:
            asset_company = frappe.db.get_value("Asset", self.existing_asset, "company")
            if asset_company != self.company:
                frappe.throw(_("Existing Asset must belong to the selected company."))

    @frappe.whitelist()
    def submit_for_approval(self):
        if self.status not in {"Draft", "Rejected"}:
            frappe.throw(_("Only Draft or Rejected requests can be submitted."))
        self.status = "Pending Approval"
        self.rejection_reason = None
        self.save()
        return self

    @frappe.whitelist()
    def approve_and_create_asset(self):
        if self.status != "Pending Approval":
            frappe.throw(_("Request must be Pending Approval."))
        if self.approval_route not in frappe.get_roles() and "System Manager" not in frappe.get_roles():
            frappe.throw(_("You do not have the required approval role."))

        if self.request_type == "Asset Edit":
            self.status = "Approved"
            self.save()
            return self

        asset = frappe.new_doc("Asset")
        asset.asset_name = self.asset_name
        asset.item_code = self.fixed_asset_item
        asset.asset_category = self.erpnext_asset_category
        asset.company = self.company
        asset.location = self.location
        asset.asset_owner = "Company"
        asset.asset_owner_company = self.company
        asset.asset_type = "Existing Asset"
        asset.asset_quantity = 1
        asset.purchase_date = self.purchase_date
        asset.available_for_use_date = self.available_for_use_date
        asset.net_purchase_amount = self.net_purchase_amount
        asset.purchase_amount = self.net_purchase_amount
        asset.calculate_depreciation = self.calculate_depreciation
        if self.requested_asset_code:
            asset.name = self.requested_asset_code
        asset.dexafleet_asset_head = self.asset_head
        asset.dexafleet_asset_category = self.asset_category
        asset.dexafleet_plate_number = self.plate_number
        asset.dexafleet_chassis_number = self.chassis_number
        asset.dexafleet_engine_number = self.engine_number
        asset.dexafleet_registration_expiry = self.registration_expiry
        asset.dexafleet_insurance_expiry = self.insurance_expiry
        asset.dexafleet_salik_tag = self.salik_tag
        asset.dexafleet_custody_status = "In Company Stock"
        asset.dexafleet_available_for_issue = 1
        asset.insert()

        self.db_set("created_asset", asset.name)
        self.db_set("status", "Asset Created")
        return asset.name

    @frappe.whitelist()
    def reject(self, reason: str):
        if not reason:
            frappe.throw(_("Rejection Reason is required."))
        self.status = "Rejected"
        self.rejection_reason = reason
        self.save()
        return self
