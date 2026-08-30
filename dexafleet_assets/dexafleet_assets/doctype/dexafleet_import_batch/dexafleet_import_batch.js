frappe.ui.form.on("DexaFleet Import Batch", {
  refresh(frm) {
    if (frm.doc.source_file && ["Uploaded", "Failed"].includes(frm.doc.status)) {
      frm.add_custom_button(__("Validate File"), () => frm.call("validate_file").then(() => frm.reload_doc()));
    }
    if (["Ready", "Ready with Warnings"].includes(frm.doc.status)) {
      frm.add_custom_button(__("Commit Import"), () => {
        if (frm.doc.status === "Ready with Warnings" && !frm.doc.warnings_confirmed) {
          frappe.msgprint(__("Confirm warnings before committing this batch.")); return;
        }
        frappe.confirm(__("Commit all ready rows? This creates ERP records."),
          () => frm.call("commit_rows").then(() => frm.reload_doc()));
      });
    }
  },
});

