import re

import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import validate_email_address

from dexafleet_assets.utils import validate_company_access


class DexaFleetRider(Document):
    def validate(self):
        validate_company_access(self.company)
        self.rider_id = (self.rider_id or "").strip()
        self.rider_name = " ".join((self.rider_name or "").split())

        if self.email:
            validate_email_address(self.email, throw=True)
        if self.phone and not re.fullmatch(r"\+?[0-9]{7,15}", self.phone.replace(" ", "")):
            frappe.throw(_("Enter a valid international phone number."))
        if self.employee:
            employee_company = frappe.db.get_value("Employee", self.employee, "company")
            if employee_company and employee_company != self.company:
                frappe.throw(_("Employee must belong to the selected company."))

