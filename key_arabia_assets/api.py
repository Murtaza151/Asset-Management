from __future__ import annotations

import frappe
from frappe.utils import add_days, nowdate

from key_arabia_assets.utils import validate_company_access


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
        "assigned": frappe.db.count("Asset", {**filters, "key_arabia_custody_status": "Assigned to Rider"}),
        "stock": frappe.db.count("Asset", {**filters, "key_arabia_custody_status": "In Company Stock"}),
        "workshop": frappe.db.count("Asset", {**filters, "key_arabia_custody_status": "With Vendor / Workshop"}),
        "police": frappe.db.count("Asset", {**filters, "key_arabia_custody_status": "In Police Custody"}),
        "expiring": frappe.db.count("Asset", {**filters, "key_arabia_registration_expiry": ["between", [nowdate(), expiry_date]]}),
        "pending_asset_requests": frappe.db.count("Key Arabia Asset Request", {**filters, "status": "Pending Approval"}),
        "pending_maintenance": frappe.db.count("Key Arabia Maintenance Job", {**filters, "status": "Pending Approval"}),
        "fine_exceptions": frappe.db.count("Key Arabia Fine", {**filters, "status": "Exception"}),
        "salik_exceptions": frappe.db.count("Key Arabia Salik Transaction", {**filters, "status": "Exception"}),
    }


@frappe.whitelist()
def load_prototype_data():
    riders = frappe.get_all("Key Arabia Rider", fields=["name as id", "rider_name as name", "phone", "email", "status", "emirates_id as emiratesId"])
    
    assets_raw = frappe.get_all("Asset", fields=[
        "name as id", "item_code as code", "asset_name as name", 
        "key_arabia_asset_category as category", "key_arabia_asset_head as assetHead",
        "key_arabia_plate_number as plate", "key_arabia_chassis_number as chassis",
        "key_arabia_engine_number as engine", "key_arabia_current_rider as currentRider",
        "key_arabia_custody_status as custody", "key_arabia_insurance_expiry as insuranceExpiry",
        "key_arabia_registration_expiry as registrationExpiry", "key_arabia_salik_tag as salikTag"
    ])
    
    assets = []
    for a in assets_raw:
        assets.append({
            "id": a.id,
            "code": a.code or "Bike",
            "name": a.name,
            "type": "Bike",
            "category": a.category or "Fleet Vehicle",
            "assetCategory": a.category or "Bike",
            "assetHead": a.assetHead or "Fleet / Vehicle",
            "ownership": "Owned",
            "owningCompany": "Key Arabia",
            "operating": "Key Arabia",
            "location": "Main Yard",
            "plate": a.plate or "",
            "chassis": a.chassis or "",
            "engine": a.engine or "",
            "model": "Honda Unicorn",
            "vendor": "Honda Dealer",
            "contractStart": "",
            "contractEnd": "",
            "vehicleExpiry": str(a.registrationExpiry) if a.registrationExpiry else "",
            "insuranceExpiry": str(a.insuranceExpiry) if a.insuranceExpiry else "",
            "km": 0,
            "currentRider": a.currentRider or "",
            "custody": a.custody or "In Company Stock",
            "salikTag": a.salikTag or "",
            "notes": ""
        })

    movements_raw = frappe.get_all("Key Arabia Custody Movement", fields=[
        "name as id", "movement_type as type", "asset as assetId", 
        "from_holder_type as fromHolderType", "from_rider as fromRider", "from_location as fromLocation",
        "to_holder_type as toHolderType", "to_rider as toRider", "to_location as toLocation",
        "creation"
    ], order_by="creation desc")
    
    movements = []
    for m in movements_raw:
        dt = m.creation
        from_holder = ""
        if m.fromRider:
            from_holder = frappe.db.get_value("Key Arabia Rider", m.fromRider, "rider_name") or m.fromRider
        elif m.fromLocation:
            from_holder = m.fromLocation
        else:
            from_holder = m.fromHolderType or "Company"
            
        to_holder = ""
        if m.toRider:
            to_holder = frappe.db.get_value("Key Arabia Rider", m.toRider, "rider_name") or m.toRider
        elif m.toLocation:
            to_holder = m.toLocation
        else:
            to_holder = m.toHolderType or "Company"

        movements.append({
            "id": m.id,
            "type": m.type,
            "assetId": m.assetId,
            "assetCode": m.assetId,
            "assetName": frappe.db.get_value("Asset", m.assetId, "asset_name") or "",
            "fromHolder": from_holder,
            "toHolder": to_holder,
            "date": dt.strftime("%Y-%m-%d") if dt else "",
            "time": dt.strftime("%H:%M") if dt else "",
            "status": "Approved",
            "actor": "System Manager",
            "proofRef": ""
        })

    return {
        "riders": riders,
        "assets": assets,
        "movements": movements
    }


@frappe.whitelist()
def save_assets(assets):
    import json
    from frappe.utils import getdate
    if isinstance(assets, str):
        assets = json.loads(assets)
    
    for a in assets:
        asset_name = a.get("id")
        exists = frappe.db.exists("Asset", asset_name) if asset_name else None
        
        if not exists and a.get("plate"):
            exists = frappe.db.get_value("Asset", {"key_arabia_plate_number": a.get("plate")}, "name")
            
        if exists:
            doc = frappe.get_doc("Asset", exists)
            doc.asset_name = a.get("name")
            doc.key_arabia_plate_number = a.get("plate")
            doc.key_arabia_chassis_number = a.get("chassis")
            doc.key_arabia_engine_number = a.get("engine")
            doc.key_arabia_insurance_expiry = getdate(a.get("insuranceExpiry")) if a.get("insuranceExpiry") else None
            doc.key_arabia_registration_expiry = getdate(a.get("vehicleExpiry")) if a.get("vehicleExpiry") else None
            doc.key_arabia_salik_tag = a.get("salikTag")
            doc.key_arabia_custody_status = a.get("custody") or "In Company Stock"
            doc.key_arabia_current_rider = a.get("currentRider")
            doc.save()
        else:
            doc = frappe.get_doc({
                "doctype": "Asset",
                "asset_name": a.get("name") or f"Bike {a.get('plate')}",
                "item_code": a.get("code") or "Bike",
                "key_arabia_plate_number": a.get("plate"),
                "key_arabia_chassis_number": a.get("chassis"),
                "key_arabia_engine_number": a.get("engine"),
                "key_arabia_insurance_expiry": getdate(a.get("insuranceExpiry")) if a.get("insuranceExpiry") else None,
                "key_arabia_registration_expiry": getdate(a.get("vehicleExpiry")) if a.get("vehicleExpiry") else None,
                "key_arabia_salik_tag": a.get("salikTag"),
                "key_arabia_custody_status": a.get("custody") or "In Company Stock",
                "key_arabia_current_rider": a.get("currentRider"),
                "key_arabia_asset_category": "Bike",
                "key_arabia_asset_head": "Fleet / Vehicle"
            })
            doc.insert(ignore_permissions=True)
            
    frappe.db.commit()
    return "Success"


@frappe.whitelist()
def save_movements(movements):
    import json
    if isinstance(movements, str):
        movements = json.loads(movements)
        
    for m in movements:
        exists = frappe.db.exists("Key Arabia Custody Movement", m.get("id"))
        if not exists:
            # Check if asset exists
            asset_ref = m.get("assetId")
            if not frappe.db.exists("Asset", asset_ref) and m.get("assetCode"):
                # Try plate mapping
                asset_ref = frappe.db.get_value("Asset", {"key_arabia_plate_number": m.get("assetCode").replace("DB-", "")}, "name")
                
            if asset_ref:
                from_holder = m.get("fromHolder")
                to_holder = m.get("toHolder")
                from_type = "Company"
                from_rider = None
                from_location = None
                to_type = "Company"
                to_rider = None
                to_location = None
                if from_holder:
                    if frappe.db.exists("Key Arabia Rider", from_holder):
                        from_rider = from_holder
                        from_type = "Rider"
                    elif frappe.db.exists("Location", from_holder):
                        from_location = from_holder
                        from_type = "Other"
                    elif from_holder in ["Company", "Rider", "Workshop / Vendor", "Police / Authority", "Client", "Other"]:
                        from_type = from_holder
                if to_holder:
                    if frappe.db.exists("Key Arabia Rider", to_holder):
                        to_rider = to_holder
                        to_type = "Rider"
                    elif frappe.db.exists("Location", to_holder):
                        to_location = to_holder
                        to_type = "Other"
                    elif to_holder in ["Company", "Rider", "Workshop / Vendor", "Police / Authority", "Client", "Other"]:
                        to_type = to_holder
                doc = frappe.get_doc({
                    "doctype": "Key Arabia Custody Movement",
                    "movement_type": m.get("type") or "Correction",
                    "asset": asset_ref,
                    "occurred_at": frappe.utils.now_datetime(),
                    "from_holder_type": from_type,
                    "from_rider": from_rider,
                    "from_location": from_location,
                    "to_holder_type": to_type,
                    "to_rider": to_rider,
                    "to_location": to_location,
                    "condition": "Good",
                    "approval_status": "Approved"
                })
                doc.insert(ignore_permissions=True)
            
    frappe.db.commit()
    return "Success"


@frappe.whitelist()
def save_riders(riders):
    import json
    if isinstance(riders, str):
        riders = json.loads(riders)
        
    for r in riders:
        exists = frappe.db.exists("Key Arabia Rider", r.get("id"))
        if exists:
            doc = frappe.get_doc("Key Arabia Rider", r.get("id"))
            doc.rider_name = r.get("name")
            doc.phone = r.get("phone")
            doc.email = r.get("email")
            doc.status = r.get("status") or "Active"
            doc.emirates_id = r.get("emiratesId")
            doc.save()
        else:
            doc = frappe.get_doc({
                "doctype": "Key Arabia Rider",
                "name": r.get("id"),
                "rider_name": r.get("name"),
                "phone": r.get("phone"),
                "email": r.get("email"),
                "status": r.get("status") or "Active",
                "emirates_id": r.get("emiratesId")
            })
            doc.insert(ignore_permissions=True)
            
    frappe.db.commit()
    return "Success"
