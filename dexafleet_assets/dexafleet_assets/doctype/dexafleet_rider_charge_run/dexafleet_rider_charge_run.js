frappe.ui.form.on("DexaFleet Rider Charge Run", {
  refresh(frm) {
    if (["Draft", "Calculated"].includes(frm.doc.status)) {
      frm.add_custom_button(__("Calculate Sources"), () => frm.call("calculate").then(() => frm.reload_doc()));
    }
    if (["Calculated", "Reviewed"].includes(frm.doc.status) && frappe.user.has_role(["DexaFleet Finance Manager", "System Manager"])) {
      frm.add_custom_button(__("Approve"), () => frm.call("approve").then(() => frm.reload_doc()));
    }
  },
});

