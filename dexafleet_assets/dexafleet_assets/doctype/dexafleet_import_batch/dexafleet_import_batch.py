import frappe
from frappe import _
from frappe.model.document import Document

from dexafleet_assets.importer import commit_batch, validate_batch
from dexafleet_assets.utils import validate_company_access


class DexaFleetImportBatch(Document):
    def validate(self):
        validate_company_access(self.company)
        if self.source_file and not self.source_file.lower().endswith(".csv"):
            frappe.throw(_("Only CSV files are supported by the staged importer."))

    @frappe.whitelist()
    def validate_file(self):
        validate_batch(self)
        self.save()
        return self

    @frappe.whitelist()
    def commit_rows(self):
        commit_batch(self)
        self.save()
        return self

