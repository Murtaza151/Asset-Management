# Data Migration and Reconciliation

## Source package

The repository retains the original ZIP under `source-package/` and the extracted browser prototype under `prototype/`. Those files are business/reference material; they are not executed during app installation.

## Recommended sequence

1. Company, users, roles, and Company User Permissions.
2. ERPNext Asset Categories, Locations, Suppliers, and Customers.
3. DexaFleet Aggregator Profiles and maintenance catalogue.
4. DexaFleet Riders.
5. ERPNext Assets and DexaFleet operational fields.
6. Custody Movements in ascending timestamp order.
7. Bike Packages and active Replacement Assignments.
8. Maintenance history.
9. Fine and Salik source files through staged Import Batches.
10. Rider Charge Runs after custody reconciliation.

## Supplied reconciliation targets

The reviewed prototype reports these source expectations:

- 100 unique company bikes.
- 55 detailed riders plus three assignment-only rider IDs.
- 175 de-duplicated custody events.
- Current custody target: 53 rider, 35 company stock, 9 police, and 3 workshop.
- One preserved source anomaly where a return date precedes its handover date; it requires business review and must not be silently corrected.

Treat these as reconciliation targets, not authorization to overwrite ERPNext production data.

## Import controls

- Work on a restored test copy first.
- Export row-level validation results.
- Resolve blocked rows before commit.
- Confirm warnings explicitly.
- Re-run duplicate checks after every import batch.
- Reconcile current custody from submitted movement history, not from a manually edited asset snapshot.
- Retain original files and batch identifiers for audit.

