frappe.query_reports["Key Arabia Maintenance Costs"] = {filters:[
  {fieldname:"company",label:__("Company"),fieldtype:"Link",options:"Company",default:frappe.defaults.get_user_default("Company"),reqd:1},
  {fieldname:"from_date",label:__("From Date"),fieldtype:"Date",default:frappe.datetime.month_start()},
  {fieldname:"to_date",label:__("To Date"),fieldtype:"Date",default:frappe.datetime.get_today()},
  {fieldname:"asset",label:__("Asset"),fieldtype:"Link",options:"Asset"}
]};

