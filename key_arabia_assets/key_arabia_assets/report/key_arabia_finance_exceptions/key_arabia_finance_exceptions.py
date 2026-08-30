import frappe
from frappe import _

from key_arabia_assets.utils import validate_company_access


def execute(filters=None):
    filters = frappe._dict(filters or {})
    validate_company_access(filters.company)
    columns = [
        {"fieldname":"source_type","label":_("Source"),"width":80},
        {"fieldname":"reference","label":_("Reference"),"fieldtype":"Dynamic Link","options":"doctype","width":160},
        {"fieldname":"transaction_at","label":_("Transaction At"),"fieldtype":"Datetime","width":150},
        {"fieldname":"plate","label":_("Plate"),"width":110},
        {"fieldname":"amount","label":_("Amount"),"fieldtype":"Currency","width":110},
        {"fieldname":"match_status","label":_("Match Status"),"width":120},
        {"fieldname":"reason","label":_("Reason"),"width":300},
        {"fieldname":"doctype","label":_("DocType"),"hidden":1},
    ]
    data = []
    if not filters.source_type or filters.source_type == "Fine":
        data += frappe.db.sql("""select 'Fine' source_type,'Key Arabia Fine' doctype,name reference,issued_at transaction_at,plate_number plate,amount,match_status,match_reason reason from `tabKey Arabia Fine` where company=%(company)s and status='Exception' and date(issued_at) between %(from_date)s and %(to_date)s""", filters, as_dict=True)
    if not filters.source_type or filters.source_type == "Salik":
        data += frappe.db.sql("""select 'Salik' source_type,'Key Arabia Salik Transaction' doctype,name reference,trip_at transaction_at,plate_number plate,amount,match_status,match_reason reason from `tabKey Arabia Salik Transaction` where company=%(company)s and status='Exception' and date(trip_at) between %(from_date)s and %(to_date)s""", filters, as_dict=True)
    data.sort(key=lambda row: row.transaction_at or "", reverse=True)
    return columns, data
