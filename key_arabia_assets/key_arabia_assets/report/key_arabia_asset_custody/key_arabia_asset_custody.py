import frappe
from frappe import _

from key_arabia_assets.utils import validate_company_access


def execute(filters=None):
    filters = frappe._dict(filters or {})
    validate_company_access(filters.company)
    columns = [
        {"fieldname":"asset","label":_("Asset"),"fieldtype":"Link","options":"Asset","width":160},
        {"fieldname":"asset_name","label":_("Asset Name"),"width":180},
        {"fieldname":"plate","label":_("Plate"),"width":110},
        {"fieldname":"custody","label":_("Custody"),"width":160},
        {"fieldname":"rider","label":_("Current Rider"),"fieldtype":"Link","options":"Key Arabia Rider","width":150},
        {"fieldname":"location","label":_("Location"),"fieldtype":"Link","options":"Location","width":150},
        {"fieldname":"available","label":_("Available"),"fieldtype":"Check","width":80},
        {"fieldname":"blocking_reason","label":_("Blocking Reason"),"width":220},
    ]
    conditions = ["a.company=%(company)s", "a.docstatus=1"]
    if filters.get("custody_status"):
        conditions.append("a.key_arabia_custody_status=%(custody_status)s")
    data = frappe.db.sql(f"""select a.name asset,a.asset_name,a.key_arabia_plate_number plate,a.key_arabia_custody_status custody,a.key_arabia_current_rider rider,a.location,a.key_arabia_available_for_issue available,a.key_arabia_blocking_reason blocking_reason from `tabAsset` a where {' and '.join(conditions)} order by a.modified desc""", filters, as_dict=True)
    summary = [{"label":_("Assets"),"value":len(data),"datatype":"Int","indicator":"Blue"}]
    return columns, data, None, None, summary
