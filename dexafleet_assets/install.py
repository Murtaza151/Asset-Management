from __future__ import annotations

import frappe
from frappe.custom.doctype.custom_field.custom_field import create_custom_fields


ROLES = [
    "DexaFleet Asset User",
    "DexaFleet Asset Manager",
    "DexaFleet Operations Manager",
    "DexaFleet Workshop User",
    "DexaFleet Workshop Manager",
    "DexaFleet Finance User",
    "DexaFleet Finance Manager",
    "DexaFleet Company Admin",
]


ASSET_CUSTOM_FIELDS = {
    "Asset": [
        {
            "fieldname": "dexafleet_section",
            "label": "DexaFleet Operations",
            "fieldtype": "Section Break",
            "insert_after": "location",
            "collapsible": 1,
        },
        {
            "fieldname": "dexafleet_asset_head",
            "label": "Asset Head",
            "fieldtype": "Select",
            "options": "Fleet / Vehicle\nCommunication\nIT / Technology\nOffice Equipment\nSafety / Uniform\nTools / Workshop\nFacility / Branch\nAggregator / Client-Issued",
            "insert_after": "dexafleet_section",
        },
        {
            "fieldname": "dexafleet_asset_category",
            "label": "Operational Asset Category",
            "fieldtype": "Data",
            "insert_after": "dexafleet_asset_head",
        },
        {
            "fieldname": "dexafleet_column_break",
            "fieldtype": "Column Break",
            "insert_after": "dexafleet_asset_category",
        },
        {
            "fieldname": "dexafleet_custody_status",
            "label": "Custody Status",
            "fieldtype": "Select",
            "options": "In Company Stock\nAssigned to Rider\nWith Vendor / Workshop\nIn Police Custody\nAt Client Location\nDisposed",
            "default": "In Company Stock",
            "read_only": 1,
            "insert_after": "dexafleet_column_break",
        },
        {
            "fieldname": "dexafleet_current_rider",
            "label": "Current Rider",
            "fieldtype": "Link",
            "options": "DexaFleet Rider",
            "read_only": 1,
            "insert_after": "dexafleet_custody_status",
        },
        {
            "fieldname": "dexafleet_vehicle_section",
            "label": "Fleet Identity",
            "fieldtype": "Section Break",
            "insert_after": "dexafleet_current_rider",
            "collapsible": 1,
        },
        {
            "fieldname": "dexafleet_plate_number",
            "label": "Plate Number",
            "fieldtype": "Data",
            "insert_after": "dexafleet_vehicle_section",
        },
        {
            "fieldname": "dexafleet_chassis_number",
            "label": "Chassis / VIN",
            "fieldtype": "Data",
            "insert_after": "dexafleet_plate_number",
        },
        {
            "fieldname": "dexafleet_engine_number",
            "label": "Engine Number",
            "fieldtype": "Data",
            "insert_after": "dexafleet_chassis_number",
        },
        {
            "fieldname": "dexafleet_vehicle_column",
            "fieldtype": "Column Break",
            "insert_after": "dexafleet_engine_number",
        },
        {
            "fieldname": "dexafleet_registration_expiry",
            "label": "Registration Expiry",
            "fieldtype": "Date",
            "insert_after": "dexafleet_vehicle_column",
        },
        {
            "fieldname": "dexafleet_insurance_expiry",
            "label": "Insurance Expiry",
            "fieldtype": "Date",
            "insert_after": "dexafleet_registration_expiry",
        },
        {
            "fieldname": "dexafleet_salik_tag",
            "label": "Salik Tag",
            "fieldtype": "Data",
            "insert_after": "dexafleet_insurance_expiry",
        },
        {
            "fieldname": "dexafleet_history_section",
            "label": "Custody Snapshot",
            "fieldtype": "Section Break",
            "insert_after": "dexafleet_salik_tag",
            "collapsible": 1,
        },
        {
            "fieldname": "dexafleet_last_handover",
            "label": "Last Handover",
            "fieldtype": "Datetime",
            "read_only": 1,
            "insert_after": "dexafleet_history_section",
        },
        {
            "fieldname": "dexafleet_last_return",
            "label": "Last Return",
            "fieldtype": "Datetime",
            "read_only": 1,
            "insert_after": "dexafleet_last_handover",
        },
        {
            "fieldname": "dexafleet_aggregator",
            "label": "Aggregator / Use",
            "fieldtype": "Link",
            "options": "DexaFleet Aggregator Profile",
            "insert_after": "dexafleet_last_return",
        },
        {
            "fieldname": "dexafleet_history_column",
            "fieldtype": "Column Break",
            "insert_after": "dexafleet_aggregator",
        },
        {
            "fieldname": "dexafleet_available_for_issue",
            "label": "Available for Issue",
            "fieldtype": "Check",
            "read_only": 1,
            "insert_after": "dexafleet_history_column",
        },
        {
            "fieldname": "dexafleet_blocking_reason",
            "label": "Blocking Reason",
            "fieldtype": "Small Text",
            "read_only": 1,
            "insert_after": "dexafleet_available_for_issue",
        },
    ]
}


def before_install():
    create_roles()


def after_install():
    create_roles()
    seed_maintenance_catalogue()


def after_migrate():
    create_roles()
    create_custom_fields(ASSET_CUSTOM_FIELDS, update=True)
    seed_maintenance_catalogue()


def create_roles():
    for role_name in ROLES:
        if not frappe.db.exists("Role", role_name):
            role = frappe.new_doc("Role")
            role.role_name = role_name
            role.desk_access = 1
            role.insert(ignore_permissions=True)


def seed_maintenance_catalogue():
    if not frappe.db.exists("DocType", "DexaFleet Maintenance Item"):
        return

    catalogue = [
        ("Oil Change", "Main Work", 75, 1500, "Invoice, Meter Photo"),
        ("Full Service", "Main Work", 425, 6000, "Invoice, Meter Photo, Before Photos, After Photos"),
        ("Engine Work", "Main Work", 850, 6000, "Invoice, Meter Photo, Before Photos, After Photos"),
        ("Accident Repair", "Main Work", 650, 0, "Invoice, Before Photos, After Photos"),
        ("Tyre Replacement", "Main Work", 240, 35000, "Invoice, Meter Photo, Before Photos, After Photos"),
        ("General Repair", "Main Work", 100, 0, "Invoice, Before Photos, After Photos"),
        ("Brake Pad", "Extra Item", 65, 0, "Invoice"),
        ("Chain", "Extra Item", 90, 0, "Invoice"),
        ("Sprocket", "Extra Item", 110, 0, "Invoice"),
        ("Battery", "Extra Item", 180, 0, "Invoice"),
        ("Front Tyre", "Extra Item", 240, 35000, "Invoice, Before Photos, After Photos"),
        ("Rear Tyre", "Extra Item", 250, 35000, "Invoice, Before Photos, After Photos"),
        ("Air Filter", "Extra Item", 35, 0, "Invoice"),
        ("Spark Plug", "Extra Item", 25, 0, "Invoice"),
        ("Cable", "Extra Item", 30, 0, "Invoice"),
        ("Bulb", "Extra Item", 15, 0, "Invoice"),
    ]
    companies = frappe.get_all("Company", pluck="name")
    for company in companies:
        for item_name, item_type, price, service_km, evidence in catalogue:
            if frappe.db.exists(
                "DexaFleet Maintenance Item", {"company": company, "item_name": item_name}
            ):
                continue
            doc = frappe.new_doc("DexaFleet Maintenance Item")
            doc.update(
                {
                    "company": company,
                    "item_name": item_name,
                    "item_type": item_type,
                    "approved_price": price,
                    "service_interval_km": service_km,
                    "required_evidence": evidence,
                    "is_active": 1,
                }
            )
            doc.insert(ignore_permissions=True)
