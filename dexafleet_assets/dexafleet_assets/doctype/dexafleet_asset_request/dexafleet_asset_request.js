frappe.ui.form.on("DexaFleet Asset Request", {
  refresh(frm) {
    frm.set_query("fixed_asset_item", () => ({filters: {is_fixed_asset: 1, is_stock_item: 0, disabled: 0}}));
    if (["Draft", "Rejected"].includes(frm.doc.status) && !frm.is_new()) {
      frm.add_custom_button(__("Submit for Approval"), () => frm.call("submit_for_approval").then(() => frm.reload_doc()));
    }
    if (frm.doc.status === "Pending Approval" && frappe.user.has_role([frm.doc.approval_route, "System Manager"])) {
      frm.add_custom_button(__("Approve"), () => frm.call("approve_and_create_asset").then(() => frm.reload_doc()), __("Actions"));
      frm.add_custom_button(__("Reject"), () => {
        frappe.prompt({fieldname: "reason", label: __("Rejection Reason"), fieldtype: "Small Text", reqd: 1},
          (values) => frm.call("reject", values).then(() => frm.reload_doc()));
      }, __("Actions"));
    }
  },
});
