from __future__ import annotations

import frappe
from frappe.utils import add_days, nowdate

from dexafleet_assets.utils import validate_company_access


@frappe.whitelist()
def dashboard(company: str | None = None):
    company = company or frappe.defaults.get_user_default("Company")
    if company:
        validate_company_access(company)
    filters = {"company": company} if company else {}
    expiry_date = add_days(nowdate(), 30)
    return {
        "company": company,
        "assets": frappe.db.count("Asset", filters),
        "assigned": frappe.db.count("Asset", {**filters, "dexafleet_custody_status": "Assigned to Rider"}),
        "stock": frappe.db.count("Asset", {**filters, "dexafleet_custody_status": "In Company Stock"}),
        "workshop": frappe.db.count("Asset", {**filters, "dexafleet_custody_status": "With Vendor / Workshop"}),
        "police": frappe.db.count("Asset", {**filters, "dexafleet_custody_status": "In Police Custody"}),
        "expiring": frappe.db.count("Asset", {**filters, "dexafleet_registration_expiry": ["between", [nowdate(), expiry_date]]}),
        "pending_asset_requests": frappe.db.count("DexaFleet Asset Request", {**filters, "status": "Pending Approval"}),
        "pending_maintenance": frappe.db.count("DexaFleet Maintenance Job", {**filters, "status": "Pending Approval"}),
        "fine_exceptions": frappe.db.count("DexaFleet Fine", {**filters, "status": "Exception"}),
        "salik_exceptions": frappe.db.count("DexaFleet Salik Transaction", {**filters, "status": "Exception"}),
    }
