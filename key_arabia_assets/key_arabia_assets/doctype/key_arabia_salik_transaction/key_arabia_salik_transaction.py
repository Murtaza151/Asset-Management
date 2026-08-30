import frappe
from frappe.model.document import Document

from key_arabia_assets.finance import match_transaction_to_custody
from key_arabia_assets.utils import validate_company_access


class KeyArabiaSalikTransaction(Document):
    def validate(self):
        validate_company_access(self.company)
        self.transaction_id = (self.transaction_id or "").strip()
        self.plate_number = (self.plate_number or "").strip().upper()

    @frappe.whitelist()
    def match_custody(self):
        result = match_transaction_to_custody(self.company, self.plate_number, self.trip_at)
        self.update(result)
        self.status = "Matched" if result["match_status"] == "Matched" else "Exception"
        self.save()
        return result

