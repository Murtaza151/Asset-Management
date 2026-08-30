import frappe
from frappe.model.document import Document

from dexafleet_assets.finance import match_transaction_to_custody
from dexafleet_assets.utils import validate_company_access


class DexaFleetFine(Document):
    def validate(self):
        validate_company_access(self.company)
        self.fine_number = (self.fine_number or "").strip()
        self.plate_number = (self.plate_number or "").strip().upper()

    @frappe.whitelist()
    def match_custody(self):
        result = match_transaction_to_custody(self.company, self.plate_number, self.issued_at)
        self.update(result)
        self.status = "Matched" if result["match_status"] == "Matched" else "Exception"
        self.save()
        return result

