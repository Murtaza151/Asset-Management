frappe.pages["key-arabia-assets-dashboard"].on_page_load = function (wrapper) {
    const page = frappe.ui.make_app_page({
        parent: wrapper,
        title: __("Asset & Inventory"),
        single_column: true,
    });

    page.set_primary_action(__("Refresh"), () => {
        page.main.find(".dexafleet-asset-frame")[0]?.contentWindow.location.reload();
    }, "refresh");

    page.main.html(`
        <section class="dexafleet-asset-page" aria-label="${__("DexaFleet Asset & Inventory")}">
            <style>
                .dexafleet-asset-page {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                }
                .dexafleet-asset-frame {
                    width: 100%;
                    border: none;
                    background: transparent;
                    min-height: 720px;
                }
                .dexafleet-preview-notice {
                    background: #fdf6ec;
                    color: #e6a23c;
                    padding: 8px 16px;
                    font-size: 13px;
                    border-bottom: 1px solid #f5dab1;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
            </style>
            <div class="dexafleet-preview-notice" role="status">
                <i class="fa fa-info-circle" aria-hidden="true"></i>
                <span>${__("ERPNext preview: changes on this screen are stored in this browser only and are not yet written to ERPNext records.")}</span>
            </div>
            <iframe
                class="dexafleet-asset-frame"
                src="/assets/key_arabia_assets/dexafleet_asset_inventory/asset-inventory-prototype.html"
                title="${__("DexaFleet Asset & Inventory workspace")}">
            </iframe>
        </section>
    `);

    const frame = page.main.find(".dexafleet-asset-frame")[0];
    frame.addEventListener("load", () => resize_asset_frame(frame));
};

function resize_asset_frame(frame) {
    const resize = () => {
        try {
            const document_height = frame.contentDocument?.documentElement?.scrollHeight || 0;
            frame.style.height = `${Math.max(document_height, window.innerHeight - 160, 720)}px`;
        } catch (error) {
            frame.style.height = `${Math.max(window.innerHeight - 160, 720)}px`;
        }
    };

    resize();

    try {
        const observer = new ResizeObserver(resize);
        observer.observe(frame.contentDocument.documentElement);
        frame._dexafleet_resize_observer = observer;
    } catch (error) {
        // The minimum height remains usable when ResizeObserver is unavailable.
    }
}

