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
}());
