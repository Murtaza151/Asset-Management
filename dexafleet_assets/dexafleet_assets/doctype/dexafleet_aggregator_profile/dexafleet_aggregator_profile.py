from frappe.model.document import Document

from dexafleet_assets.utils import validate_company_access


class DexaFleetAggregatorProfile(Document):
    def validate(self):
        validate_company_access(self.company)
        self.aggregator_name = " ".join((self.aggregator_name or "").split())

