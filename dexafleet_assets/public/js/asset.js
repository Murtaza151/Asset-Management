frappe.ui.form.on("Asset", {
  refresh(frm) {
    if (!frm.is_new() && frappe.user.has_role(["DexaFleet Asset Manager", "DexaFleet Operations Manager"])) {
      frm.add_custom_button(__("New Custody Movement"), () => {
        frappe.new_doc("DexaFleet Custody Movement", {
          company: frm.doc.company,
          asset: frm.doc.name,
          occurred_at: frappe.datetime.now_datetime(),
        });
      }, __("DexaFleet"));
    }
  },
});

