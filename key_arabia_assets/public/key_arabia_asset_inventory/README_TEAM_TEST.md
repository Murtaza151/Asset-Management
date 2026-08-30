# Key Arabia Asset & Inventory Prototype - Team Test Pack

## Open First
Open `asset-inventory-prototype.html` in Chrome or any modern browser.

## What To Test
- Dashboard command center and clickable risk cards.
- Asset Register filters, asset detail, health, expiry, and source links.
- Add Asset form and approval behavior.
- Handover / Takeover movement register and movement form.
- Reports, filters, search, source links, and download/export.
- Import popup using the included Excel workbook as test data reference.

## Import Test Workbook
Use `key_arabia_asset_inventory_import_test_pack.xlsx`.

Recommended order:
1. Vendor Master
2. Location Master
3. Asset Master Import
4. Asset Movement Import
5. Fine Salik Import
6. Maintenance Import

## Feedback Needed
Please comment on:
- Missing fields.
- Wrong business logic.
- Confusing labels.
- Required approvals.
- Reports needed by asset, operations, finance, or onboarding teams.
- Any screen that is not easy for daily use.

## Important
This is a frontend prototype for business testing. It does not save to production backend yet.

## Corrected Local Build
- Browser test data now persists after refresh. Use `?clearLocalTestData=1` only when a deliberate clean reset is required.
- Dates, audit timestamps and expiry calculations use the current Asia/Dubai date/time.
- CSV import is the supported local import format. The Excel workbook remains the multi-sheet team test reference.
- Warning rows require a second explicit import confirmation; blocked rows cannot import.
- Register, movement, Fine/Salik and report exports download CSV files.
- The Supabase schema and Lovable handover contract are included but must be applied only to a test project before live integration.

## Release Gate
Do not integrate into key_arabia.com until developer testing, independent testing, business-team testing, QA review and client UAT are complete. Existing Recruitment, Visa, License and Company Admin routes must remain unchanged.
# Maintenance Billing Test

Open `maintenance-prototype.html`. Use **New Maintenance Job** to test the finalized controlled billing flow. Select a compulsory Main Work Type, add multiple Extra Items, enter Labour, and allocate the complete Grand Total before submitting. Use the approval audit section to test price-change and new-item approvals.
