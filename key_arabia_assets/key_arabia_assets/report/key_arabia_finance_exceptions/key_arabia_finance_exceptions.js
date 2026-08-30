frappe.query_reports["Key Arabia Finance Exceptions"] = {filters:[
  {fieldname:"company",label:__("Company"),fieldtype:"Link",options:"Company",default:frappe.defaults.get_user_default("Company"),reqd:1},
  {fieldname:"from_date",label:__("From Date"),fieldtype:"Date",default:frappe.datetime.month_start()},
  {fieldname:"to_date",label:__("To Date"),fieldtype:"Date",default:frappe.datetime.get_today()},
  {fieldname:"source_type",label:__("Source Type"),fieldtype:"Select",options:"\nFine\nSalik"}
]};

