frappe.pages["key-arabia-assets-dashboard"].on_page_load = function (wrapper) {
  const page = frappe.ui.make_app_page({parent: wrapper, title: __("Key Arabia Asset Management"), single_column: true});
  page.set_primary_action(__("New Asset Request"), () => frappe.new_doc("Key Arabia Asset Request"));
  page.add_menu_item(__("New Custody Movement"), () => frappe.new_doc("Key Arabia Custody Movement"));
  page.add_menu_item(__("New Maintenance Job"), () => frappe.new_doc("Key Arabia Maintenance Job"));
  page.add_menu_item(__("Import Batch"), () => frappe.new_doc("Key Arabia Import Batch"));
  $(wrapper).find(".layout-main-section").html(`
    <style>
      .dxa-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin:16px 0}
      .dxa-card{background:var(--card-bg);border:1px solid var(--border-color);border-radius:10px;padding:16px;cursor:pointer}
      .dxa-card span{color:var(--text-muted);font-size:12px}.dxa-card strong{display:block;font-size:25px;margin-top:6px}
      .dxa-actions{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0 20px}
    </style>
    <div class="dxa-actions">
      <button class="btn btn-default" data-route="List/Asset">${__("Asset Register")}</button>
      <button class="btn btn-default" data-route="List/Key Arabia Custody Movement">${__("Movement Ledger")}</button>
      <button class="btn btn-default" data-route="List/Key Arabia Maintenance Job">${__("Maintenance")}</button>
      <button class="btn btn-default" data-route="List/Key Arabia Fine">${__("Fine / Salik")}</button>
      <button class="btn btn-default" data-route="List/Key Arabia Rider Charge Run">${__("Rider Charges")}</button>
    </div><div class="dxa-grid" data-kpis></div>`);
  $(wrapper).on("click", "[data-route]", function () { frappe.set_route($(this).data("route").split("/")); });
  frappe.call("key_arabia_assets.api.dashboard").then(({message}) => {
    const cards = [
      [__("Total Assets"), message.assets, "List/Asset"], [__("Assigned to Riders"), message.assigned, "List/Asset"],
      [__("Company Stock"), message.stock, "List/Asset"], [__("In Workshop"), message.workshop, "List/Asset"],
      [__("Police Custody"), message.police, "List/Asset"], [__("Expiring in 30 Days"), message.expiring, "List/Asset"],
      [__("Asset Approvals"), message.pending_asset_requests, "List/Key Arabia Asset Request"],
      [__("Maintenance Approvals"), message.pending_maintenance, "List/Key Arabia Maintenance Job"],
      [__("Fine Exceptions"), message.fine_exceptions, "List/Key Arabia Fine"],
      [__("Salik Exceptions"), message.salik_exceptions, "List/Key Arabia Salik Transaction"]
    ];
    $(wrapper).find("[data-kpis]").html(cards.map(([label,value,route]) => `<div class="dxa-card" data-route="${route}"><span>${label}</span><strong>${value}</strong></div>`).join(""));
  });
};

