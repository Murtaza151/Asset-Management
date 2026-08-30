frappe.ui.form.on("DexaFleet Custody Movement", {
  refresh(frm) {
    frm.set_query("asset", () => ({filters: {company: frm.doc.company, docstatus: 1}}));
    frm.set_query("from_rider", () => ({filters: {company: frm.doc.company}}));
    frm.set_query("to_rider", () => ({filters: {company: frm.doc.company, status: "Active"}}));
    if (frm.doc.docstatus === 1 && !frm.doc.reversed_by_movement) {
      frm.add_custom_button(__("Create Reversal"), () => {
        frappe.prompt({fieldname: "reason", label: __("Reversal Reason"), fieldtype: "Small Text", reqd: 1},
          (values) => frm.call("make_reversal", values).then((r) => frappe.set_route("Form", "DexaFleet Custody Movement", r.message)));
      });
    }
  },
});

