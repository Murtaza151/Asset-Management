from __future__ import annotations

from decimal import Decimal

import frappe
from frappe import _
from frappe.utils import flt, get_datetime


def validate_company_access(company: str) -> None:
    if not company:
        frappe.throw(_("Company is required."))
    if frappe.session.user == "Administrator" or "System Manager" in frappe.get_roles():
        return

    permitted = frappe.get_all(
        "User Permission",
        filters={
            "user": frappe.session.user,
            "allow": "Company",
            "for_value": company,
        },
        limit=1,
    )
    if not permitted:
        frappe.throw(_("You are not permitted to access company {0}.").format(frappe.bold(company)))


def money_equal(left: float, right: float, precision: int = 2) -> bool:
    quantum = Decimal(10) ** -precision
    return Decimal(str(flt(left))).quantize(quantum) == Decimal(str(flt(right))).quantize(quantum)


def validate_time_range(from_time, to_time, label: str = "time range") -> None:
    if from_time and to_time and get_datetime(to_time) <= get_datetime(from_time):
        frappe.throw(_("End must be later than start for {0}.").format(label))


def append_audit_comment(doc, message: str) -> None:
    if not doc.is_new():
        doc.add_comment("Info", message)
