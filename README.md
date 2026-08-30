# Key Arabia Asset Management

ERPNext/Frappe application project for Key Arabia asset, custody, maintenance, Fine/Salik, rider-charge, approval, reporting, and audit workflows.

## Repository status

The installable Frappe package is named `key_arabia_assets` and targets ERPNext/Frappe v15. This public repository contains only the reviewed application code and safe operational documentation.

Use a test site and a verified backup before installing on an existing ERPNext site. See `docs/INSTALLATION.md` and the release notes for the exact version tested by the current release.

## Contents

- `key_arabia_assets/` — installable Frappe application package.
- `docs/` — installation, administration, and data-migration guidance.

## Delivered modules

- Company-scoped riders, asset requests, and ERPNext Asset extensions.
- Controlled custody movement, handover/return, correction, and reversal history.
- Bike package readiness and replacement assignments.
- Maintenance catalogue, historical price snapshots, evidence rules, allocation, and approval.
- Fine and Salik staged imports, timestamp custody matching, and exception handling.
- Rider charge reconciliation runs with duplicate-source protection and explicit posting references.
- Operational dashboard and standard Script Reports.
- Role permissions, Company User Permission enforcement, audit comments, and change tracking.

## Installation flow

```bash
bench get-app https://github.com/Murtaza151/Key-Arabia-Asset-Management.git --branch v2.0.0
bench --site <site-name> install-app key_arabia_assets
bench --site <site-name> migrate
bench build --app key_arabia_assets
```

Detailed installation, configuration, upgrade, and uninstall notes are in [docs/INSTALLATION.md](docs/INSTALLATION.md).
