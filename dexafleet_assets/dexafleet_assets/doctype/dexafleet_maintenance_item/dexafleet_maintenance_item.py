from frappe.model.document import Document

from dexafleet_assets.utils import validate_company_access


class DexaFleetMaintenanceItem(Document):
    def validate(self):
        validate_company_access(self.company)
        self.item_name = " ".join((self.item_name or "").split())

