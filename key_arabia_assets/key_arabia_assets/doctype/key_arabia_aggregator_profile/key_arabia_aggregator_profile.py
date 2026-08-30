from frappe.model.document import Document

from key_arabia_assets.utils import validate_company_access


class KeyArabiaAggregatorProfile(Document):
    def validate(self):
        validate_company_access(self.company)
        self.aggregator_name = " ".join((self.aggregator_name or "").split())

