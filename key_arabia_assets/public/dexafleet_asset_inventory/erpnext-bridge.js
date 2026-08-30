(function () {
    "use strict";

    let parent_window;
    try {
        parent_window = window.parent !== window ? window.parent : null;
    } catch (error) {
        parent_window = null;
    }

    const frappe_context = parent_window?.frappe;
    if (!frappe_context) {
        return;
    }

    const session_user = frappe_context.session?.user || "";
    const user_info = frappe_context.boot?.user_info?.[session_user] || {};
    const roles = frappe_context.boot?.user?.roles || [];
    const is_system_manager = roles.includes("System Manager");
    const default_company = frappe_context.defaults?.get_default?.("company") || frappe_context.boot?.sysdefaults?.company || "";

    window.DEXAFLEET_CONTEXT = {
        user: {
            id: session_user,
            name: user_info.full_name || session_user,
            role: is_system_manager ? "Company Admin" : (roles[0] || "User"),
            company: default_company,
            companyId: default_company,
            scope: is_system_manager ? "Company" : "User",
        },
    };

    // Database Sync Caches
    let lastAssets = [];
    let lastRiders = [];
    let lastMovements = [];

    // Custom Load Handler
    window.onPrototypeDataLoad = function (replaceArray, restoreObject, callback) {
        // Remove the preview warning notice from the parent page
        if (parent_window && parent_window.document) {
            const notice = parent_window.document.querySelector(".dexafleet-preview-notice");
            if (notice) {
                notice.style.display = "none";
            }
        }

        frappe_context.call({
            method: "key_arabia_assets.api.load_prototype_data",
            callback: function (r) {
                const dbData = r.message || {};
                
                // If assets exist in DB, populate the dashboard with them
                if (dbData.assets && dbData.assets.length > 0) {
                    replaceArray(window.assets, dbData.assets);
                } else {
                    // Database is empty. Bootstrap it by saving default mock assets!
                    frappe_context.call({
                        method: "key_arabia_assets.api.save_assets",
                        args: { assets: window.assets },
                    });
                }

                // If riders exist in DB, populate
                if (dbData.riders && dbData.riders.length > 0) {
                    replaceArray(window.riders, dbData.riders);
                } else {
                    // Bootstrap riders
                    frappe_context.call({
                        method: "key_arabia_assets.api.save_riders",
                        args: { riders: window.riders },
                    });
                }

                // If movements exist in DB, populate
                if (dbData.movements && dbData.movements.length > 0) {
                    replaceArray(window.movements, dbData.movements);
                }

                // Update caches
                lastAssets = JSON.parse(JSON.stringify(window.assets));
                lastRiders = JSON.parse(JSON.stringify(window.riders));
                lastMovements = JSON.parse(JSON.stringify(window.movements));

                callback();
            }
        });
    };

    // Custom Save Handler
    window.onPrototypeDataSave = function () {
        // Compare assets
        const changedAssets = [];
        window.assets.forEach(a => {
            const cached = lastAssets.find(la => la.id === a.id);
            if (!cached || JSON.stringify(cached) !== JSON.stringify(a)) {
                changedAssets.push(a);
            }
        });

        if (changedAssets.length > 0) {
            frappe_context.call({
                method: "key_arabia_assets.api.save_assets",
                args: { assets: changedAssets },
                callback: function() {
                    lastAssets = JSON.parse(JSON.stringify(window.assets));
                }
            });
        }

        // Compare riders
        const changedRiders = [];
        window.riders.forEach(r => {
            const cached = lastRiders.find(lr => lr.id === r.id);
            if (!cached || JSON.stringify(cached) !== JSON.stringify(r)) {
                changedRiders.push(r);
            }
        });

        if (changedRiders.length > 0) {
            frappe_context.call({
                method: "key_arabia_assets.api.save_riders",
                args: { riders: changedRiders },
                callback: function() {
                    lastRiders = JSON.parse(JSON.stringify(window.riders));
                }
            });
        }

        // Compare movements
        const newMovements = [];
        window.movements.forEach(m => {
            if (!lastMovements.some(lm => lm.id === m.id)) {
                newMovements.push(m);
            }
        });

        if (newMovements.length > 0) {
            frappe_context.call({
                method: "key_arabia_assets.api.save_movements",
                args: { movements: newMovements },
                callback: function() {
                    lastMovements = JSON.parse(JSON.stringify(window.movements));
                }
            });
        }
    };
}());
