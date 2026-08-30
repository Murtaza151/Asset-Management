# Installation — DexaFleet Assets 1.0

## Supported platform

- Frappe Framework `>=15.0.0,<16.0.0`
- ERPNext `>=15.0.0,<16.0.0`
- Python and Node versions supported by the selected ERPNext v15 release
- MariaDB configuration supported by ERPNext v15

Always take a verified database and files backup before installing an app on an existing site.

## Install from Git

Run from the Frappe Bench directory:

```bash
bench get-app https://github.com/Murtaza151/dexafleet-asset-management.git --branch v1.0.0
bench --site <site-name> install-app dexafleet_assets
bench --site <site-name> migrate
bench build --app dexafleet_assets
bench --site <site-name> clear-cache
bench restart
```

Verify:

```bash
bench --site <site-name> list-apps
bench --site <site-name> doctor
```

`dexafleet_assets` must appear in `list-apps`.

## Upgrade

```bash
cd apps/dexafleet_assets
git fetch --tags
git checkout <tested-release-tag>
cd ../..
bench --site <site-name> migrate
bench build --app dexafleet_assets
bench --site <site-name> clear-cache
bench restart
```

## Uninstall

Uninstalling deletes DocType data owned by this app. Export required records and take a backup first.

```bash
bench --site <site-name> backup --with-files
bench --site <site-name> uninstall-app dexafleet_assets
```

Standard ERPNext Asset records are not owned by this app, but DexaFleet custom fields and links require a reviewed cleanup plan before permanent removal.

## Initial configuration

1. Open **DexaFleet Assets Settings**.
2. Select the default Company and alert thresholds.
3. Assign Company User Permissions to every non-System-Manager user.
4. Assign only the required DexaFleet roles.
5. Review the seeded maintenance catalogue and approved prices per Company.
6. Create riders, aggregator profiles, asset requests, and custody history.
7. Test with non-production data before importing operational records.
