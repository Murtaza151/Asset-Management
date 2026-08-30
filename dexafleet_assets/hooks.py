app_name = "dexafleet_assets"
app_title = "DexaFleet Assets"
app_publisher = "Aiopssense"
app_description = "Fleet asset, custody, maintenance, fine, Salik and rider charge management"
app_email = "support@aiopssense.com"
app_license = "MIT"
app_version = "1.0.0"

required_apps = ["erpnext"]

before_install = "dexafleet_assets.install.before_install"
after_install = "dexafleet_assets.install.after_install"
after_migrate = "dexafleet_assets.install.after_migrate"

permission_query_conditions = {
    "DexaFleet Rider": "dexafleet_assets.permissions.rider_query_condition",
    "DexaFleet Asset Request": "dexafleet_assets.permissions.asset_request_query_condition",
    "DexaFleet Custody Movement": "dexafleet_assets.permissions.custody_movement_query_condition",
    "DexaFleet Maintenance Item": "dexafleet_assets.permissions.maintenance_item_query_condition",
    "DexaFleet Maintenance Job": "dexafleet_assets.permissions.maintenance_job_query_condition",
    "DexaFleet Fine": "dexafleet_assets.permissions.fine_query_condition",
    "DexaFleet Salik Transaction": "dexafleet_assets.permissions.salik_query_condition",
    "DexaFleet Import Batch": "dexafleet_assets.permissions.import_batch_query_condition",
    "DexaFleet Aggregator Profile": "dexafleet_assets.permissions.aggregator_query_condition",
    "DexaFleet Bike Package": "dexafleet_assets.permissions.bike_package_query_condition",
    "DexaFleet Replacement Assignment": "dexafleet_assets.permissions.replacement_query_condition",
    "DexaFleet Rider Charge Run": "dexafleet_assets.permissions.charge_run_query_condition",
}

has_permission = {
    "DexaFleet Rider": "dexafleet_assets.permissions.has_company_permission",
    "DexaFleet Asset Request": "dexafleet_assets.permissions.has_company_permission",
    "DexaFleet Custody Movement": "dexafleet_assets.permissions.has_company_permission",
    "DexaFleet Maintenance Item": "dexafleet_assets.permissions.has_company_permission",
    "DexaFleet Maintenance Job": "dexafleet_assets.permissions.has_company_permission",
    "DexaFleet Fine": "dexafleet_assets.permissions.has_company_permission",
    "DexaFleet Salik Transaction": "dexafleet_assets.permissions.has_company_permission",
    "DexaFleet Import Batch": "dexafleet_assets.permissions.has_company_permission",
    "DexaFleet Aggregator Profile": "dexafleet_assets.permissions.has_company_permission",
    "DexaFleet Bike Package": "dexafleet_assets.permissions.has_company_permission",
    "DexaFleet Replacement Assignment": "dexafleet_assets.permissions.has_company_permission",
    "DexaFleet Rider Charge Run": "dexafleet_assets.permissions.has_company_permission",
}

doctype_js = {
    "Asset": "public/js/asset.js",
}

doc_events = {
    "Asset": {
        "validate": "dexafleet_assets.asset.validate_asset",
    }
}

fixtures = [
    {"dt": "Role", "filters": [["name", "like", "DexaFleet%"]]},
]
