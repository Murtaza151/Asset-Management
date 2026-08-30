frappe.ui.form.on("Key Arabia Maintenance Job", {
  refresh(frm) {
    frm.set_query("asset", () => ({filters: {company: frm.doc.company, docstatus: 1}}));
    frm.set_query("maintenance_item", "items", () => ({filters: {company: frm.doc.company, is_active: 1}}));
    if (["Draft", "In Progress", "Correction Required"].includes(frm.doc.status) && !frm.is_new()) {
      frm.add_custom_button(__("Submit for Approval"), () => frm.call("submit_for_approval").then(() => frm.reload_doc()));
    }
    if (frm.doc.status === "Pending Approval" && frappe.user.has_role(["Key Arabia Company Admin", "System Manager"])) {
      frm.add_custom_button(__("Approve & Release"), () => frm.savesubmit());
      frm.add_custom_button(__("Request Correction"), () => {
        frappe.prompt({fieldname: "reason", label: __("Correction Reason"), fieldtype: "Small Text", reqd: 1},
          (values) => frm.call("request_correction", values).then(() => frm.reload_doc()));
      });
    }
  },
});

