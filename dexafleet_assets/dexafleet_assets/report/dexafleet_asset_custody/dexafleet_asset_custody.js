frappe.query_reports["DexaFleet Asset Custody"] = {filters: [
  {fieldname:"company", label:__("Company"), fieldtype:"Link", options:"Company", default:frappe.defaults.get_user_default("Company"), reqd:1},
  {fieldname:"custody_status", label:__("Custody Status"), fieldtype:"Select", options:"\nIn Company Stock\nAssigned to Rider\nWith Vendor / Workshop\nIn Police Custody\nAt Client Location"}
]};

