import frappe


PRIVILEGED_ROLES = {"System Manager", "Administrator"}


def _is_privileged(user: str) -> bool:
    if user == "Administrator":
        return True
    return bool(PRIVILEGED_ROLES.intersection(frappe.get_roles(user)))


def allowed_companies(user: str | None = None) -> list[str]:
    user = user or frappe.session.user
    if _is_privileged(user):
        return frappe.get_all("Company", pluck="name")

    return frappe.get_all(
        "User Permission",
        filters={"user": user, "allow": "Company"},
        pluck="for_value",
    )


def company_query_condition(doctype: str, user: str | None = None) -> str:
    user = user or frappe.session.user
    if _is_privileged(user):
        return ""

    companies = allowed_companies(user)
    if not companies:
        return "1=0"

    escaped = ", ".join(frappe.db.escape(company) for company in companies)
    return f"`tab{doctype}`.`company` in ({escaped})"


def rider_query_condition(user=None):
    return company_query_condition("DexaFleet Rider", user)


def asset_request_query_condition(user=None):
    return company_query_condition("DexaFleet Asset Request", user)


def custody_movement_query_condition(user=None):
    return company_query_condition("DexaFleet Custody Movement", user)


def maintenance_item_query_condition(user=None):
    return company_query_condition("DexaFleet Maintenance Item", user)


def maintenance_job_query_condition(user=None):
    return company_query_condition("DexaFleet Maintenance Job", user)


def fine_query_condition(user=None):
    return company_query_condition("DexaFleet Fine", user)


def salik_query_condition(user=None):
    return company_query_condition("DexaFleet Salik Transaction", user)


def import_batch_query_condition(user=None):
    return company_query_condition("DexaFleet Import Batch", user)


def aggregator_query_condition(user=None):
    return company_query_condition("DexaFleet Aggregator Profile", user)


def bike_package_query_condition(user=None):
    return company_query_condition("DexaFleet Bike Package", user)


def replacement_query_condition(user=None):
    return company_query_condition("DexaFleet Replacement Assignment", user)


def charge_run_query_condition(user=None):
    return company_query_condition("DexaFleet Rider Charge Run", user)


def has_company_permission(doc, user: str | None = None, permission_type: str | None = None) -> bool:
    user = user or frappe.session.user
    if _is_privileged(user):
        return True
    return bool(doc.company and doc.company in allowed_companies(user))
