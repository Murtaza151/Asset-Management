import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import now_datetime

from dexafleet_assets.utils import validate_company_access


class DexaFleetBikePackage(Document):
    def validate(self):
        validate_company_access(self.company)
        linked_assets = [self.bike, self.delivery_box, self.helmet, self.sim_asset, self.salik_tag_asset, self.gps_tracker]
        linked_assets = [asset for asset in linked_assets if asset]
        if len(linked_assets) != len(set(linked_assets)):
            frappe.throw(_("The same Asset cannot be used twice in one bike package."))
        for asset in linked_assets:
            if frappe.db.get_value("Asset", asset, "company") != self.company:
                frappe.throw(_("Asset {0} must belong to the selected company.").format(asset))
        if self.rider and frappe.db.get_value("DexaFleet Rider", self.rider, "company") != self.company:
            frappe.throw(_("Rider must belong to the selected company."))
        complete = bool(self.bike and self.delivery_box and self.keys_available)
        if self.status == "Ready for Rider Handover" and not complete:
            frappe.throw(_("Bike, Delivery Box and Keys are required before Rider Handover."))
        if self.status == "Blocked" and not self.blocking_reason:
            frappe.throw(_("Blocking Reason is required for a blocked package."))
        if self.status in {"Bike + Box Ready", "Ready for Rider Handover"} and not self.ready_at:
            self.ready_at = now_datetime()

