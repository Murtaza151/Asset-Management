import frappe
from frappe import _

from key_arabia_assets.utils import validate_company_access


def execute(filters=None):
    filters = frappe._dict(filters or {})
    validate_company_access(filters.company)
    columns = [
        {"fieldname":"job","label":_("Job"),"fieldtype":"Link","options":"Key Arabia Maintenance Job","width":150},
        {"fieldname":"invoice","label":_("Invoice"),"width":140},
        {"fieldname":"date","label":_("Date"),"fieldtype":"Date","width":95},
        {"fieldname":"asset","label":_("Asset"),"fieldtype":"Link","options":"Asset","width":150},
        {"fieldname":"workshop","label":_("Workshop"),"fieldtype":"Link","options":"Supplier","width":160},
        {"fieldname":"items_total","label":_("Items"),"fieldtype":"Currency","width":100},
        {"fieldname":"labour","label":_("Labour"),"fieldtype":"Currency","width":100},
        {"fieldname":"grand_total","label":_("Grand Total"),"fieldtype":"Currency","width":110},
        {"fieldname":"rider_charge","label":_("Rider Charge"),"fieldtype":"Currency","width":110},
    ]
    conditions = ["company=%(company)s", "job_date between %(from_date)s and %(to_date)s", "docstatus<2"]
    if filters.get("asset"):
        conditions.append("asset=%(asset)s")
    data = frappe.db.sql(f"""select name job,invoice_number invoice,job_date date,asset,workshop,items_total,labour,grand_total,rider_charge from `tabKey Arabia Maintenance Job` where {' and '.join(conditions)} order by job_date desc""", filters, as_dict=True)
    return columns, data
