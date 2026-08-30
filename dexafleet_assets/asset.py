import frappe
from frappe import _


UNIQUE_FIELDS = {
    "dexafleet_plate_number": "Plate Number",
    "dexafleet_chassis_number": "Chassis / VIN",
    "dexafleet_salik_tag": "Salik Tag",
}


def validate_asset(doc, method=None):
    for fieldname, label in UNIQUE_FIELDS.items():
        value = (doc.get(fieldname) or "").strip().upper()
        doc.set(fieldname, value)
        if not value or not doc.company:
            continue
        duplicate = frappe.db.exists(
            "Asset",
            {"name": ("!=", doc.name), "company": doc.company, fieldname: value, "docstatus": ("<", 2)},
        )
        if duplicate:
            frappe.throw(_("{0} {1} already belongs to Asset {2} in this company.").format(label, value, duplicate))

