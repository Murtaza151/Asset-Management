from __future__ import annotations

import frappe
from frappe import _
from frappe.utils import get_datetime


def match_transaction_to_custody(company: str, plate_number: str, transaction_at) -> dict:
    plate_number = (plate_number or "").strip().upper()
    transaction_at = get_datetime(transaction_at)
    assets = frappe.get_all(
        "Asset",
        filters={"company": company, "key_arabia_plate_number": plate_number},
        pluck="name",
    )
    if not assets:
        return _result("No Asset", _("No asset matches plate {0}.").format(plate_number))
    if len(assets) > 1:
        return _result("Manual Review", _("Multiple assets match this plate."))

    asset = assets[0]
    movements = frappe.get_all(
        "Key Arabia Custody Movement",
        filters={"asset": asset, "company": company, "docstatus": 1, "occurred_at": ("<=", transaction_at)},
        fields=["name", "occurred_at", "to_holder_type", "to_rider"],
        order_by="occurred_at desc, creation desc",
        limit=2,
    )
    if not movements:
        return _result("No Custody", _("No submitted custody movement exists at the transaction time."), asset=asset)
    if len(movements) > 1 and movements[0].occurred_at == movements[1].occurred_at:
        return _result("Overlap", _("Multiple custody movements share the effective timestamp."), asset=asset)

    movement = movements[0]
    if movement.to_holder_type != "Rider" or not movement.to_rider:
        return _result(
            "No Rider",
            _("Asset was held by {0} at the transaction time.").format(movement.to_holder_type),
            asset=asset,
            matched_movement=movement.name,
        )
    return _result(
        "Matched",
        _("Matched by plate and submitted custody timestamp."),
        asset=asset,
        matched_movement=movement.name,
        rider=movement.to_rider,
    )


def _result(match_status: str, reason: str, **values) -> dict:
    return {"match_status": match_status, "match_reason": reason, "asset": None, "matched_movement": None, "rider": None, **values}

