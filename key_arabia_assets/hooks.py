app_name = "key_arabia_assets"
app_title = "Key Arabia Assets"
app_publisher = "Aiopssense"
app_description = "Fleet asset, custody, maintenance, fine, Salik and rider charge management"
app_email = "support@aiopssense.com"
app_license = "MIT"
app_version = "2.0.0"

required_apps = ["erpnext"]

before_install = "key_arabia_assets.install.before_install"
after_install = "key_arabia_assets.install.after_install"
after_migrate = "key_arabia_assets.install.after_migrate"

permission_query_conditions = {
    "Key Arabia Rider": "key_arabia_assets.permissions.rider_query_condition",
    "Key Arabia Asset Request": "key_arabia_assets.permissions.asset_request_query_condition",
    "Key Arabia Custody Movement": "key_arabia_assets.permissions.custody_movement_query_condition",
    "Key Arabia Maintenance Item": "key_arabia_assets.permissions.maintenance_item_query_condition",
    "Key Arabia Maintenance Job": "key_arabia_assets.permissions.maintenance_job_query_condition",
    "Key Arabia Fine": "key_arabia_assets.permissions.fine_query_condition",
    "Key Arabia Salik Transaction": "key_arabia_assets.permissions.salik_query_condition",
    "Key Arabia Import Batch": "key_arabia_assets.permissions.import_batch_query_condition",
    "Key Arabia Aggregator Profile": "key_arabia_assets.permissions.aggregator_query_condition",
    "Key Arabia Bike Package": "key_arabia_assets.permissions.bike_package_query_condition",
    "Key Arabia Replacement Assignment": "key_arabia_assets.permissions.replacement_query_condition",
    "Key Arabia Rider Charge Run": "key_arabia_assets.permissions.charge_run_query_condition",
}

has_permission = {
    "Key Arabia Rider": "key_arabia_assets.permissions.has_company_permission",
    "Key Arabia Asset Request": "key_arabia_assets.permissions.has_company_permission",
    "Key Arabia Custody Movement": "key_arabia_assets.permissions.has_company_permission",
    "Key Arabia Maintenance Item": "key_arabia_assets.permissions.has_company_permission",
    "Key Arabia Maintenance Job": "key_arabia_assets.permissions.has_company_permission",
    "Key Arabia Fine": "key_arabia_assets.permissions.has_company_permission",
    "Key Arabia Salik Transaction": "key_arabia_assets.permissions.has_company_permission",
    "Key Arabia Import Batch": "key_arabia_assets.permissions.has_company_permission",
    "Key Arabia Aggregator Profile": "key_arabia_assets.permissions.has_company_permission",
    "Key Arabia Bike Package": "key_arabia_assets.permissions.has_company_permission",
    "Key Arabia Replacement Assignment": "key_arabia_assets.permissions.has_company_permission",
    "Key Arabia Rider Charge Run": "key_arabia_assets.permissions.has_company_permission",
}

doctype_js = {
    "Asset": "public/js/asset.js",
}

doc_events = {
    "Asset": {
        "validate": "key_arabia_assets.asset.validate_asset",
    }
}

fixtures = [
    {"dt": "Role", "filters": [["name", "like", "Key Arabia%"]]},
    {"dt": "Custom Field", "filters": [["fieldname", "like", "key_arabia_%"]]},
]
