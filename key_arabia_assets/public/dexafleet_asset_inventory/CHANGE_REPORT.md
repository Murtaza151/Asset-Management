# DexaFleet Asset & Inventory Corrected Local Build

## 2026-07-13 — DexaFleet company rider register

- Added 55 company-supplied rider records through the isolated `rider-company-data.js` adapter.
- Added Rider ID, cleaned display name, source name, email, UAE phone number, Emirates ID paper number, status, and company fields.
- Normalized source statuses to Active and On Vacation and removed the trailing `-KA` marker from display names only.
- Connected the same rider source to handover/takeover selectors and handover-sheet contact details.
- Included rider records in the temporary data snapshot and browser-state adapter for later Supabase replacement.

## 2026-07-13 — DexaFleet company bike register

- Added 100 company-supplied bike records through the isolated `asset-company-data.js` adapter.
- Set every record to Owned / DexaFleet and mapped Bike Number, registration expiry, vendor, and chassis number.
- Normalized hidden bidirectional characters from chassis values and converted dates to ISO format.
- Added ALDOBOWI and Bike Care to the DexaFleet supplier/vendor master.
- Connected the same bike source to the Maintenance bike selector without inventing rider or service-history details.
- Marked missing custody, holder, location, engine, model, meter, insurance, Salik, and purchase details as pending verification.

## 2026-07-13 — Operational mock data removed

- Removed all packaged asset, rider, handover, allocation, replacement, maintenance, Fine, and Salik operational sample records.
- Removed the automatic category-coverage generator that previously created 317 dashboard assets.
- Reset legacy browser-storage keys and introduced clean storage versions for real company data.
- Kept setup masters, field templates, client/aggregator names, report definitions, and the approved maintenance catalogue.
- Added safe empty states for the maintenance bike selector and current-month Fine/Salik filters.

## 2026-07-13 — Final English-only delivery package

- Audited all user-facing module sources and the bundled XLSX test workbook for Urdu and Hindi script.
- Confirmed that all interface labels, reports, validation messages, setup controls, and handover documentation are in English.
- Rebuilt the complete Asset, Inventory, Maintenance, Fine, Salik, and rider-charge module as a clean final ZIP.

## 2026-07-13 — Fine, Salik and rider-charge workspace

- Replaced the basic Fine/Salik review table with a full English-only single-page finance workspace.
- Added compact date/search/status/plate/rider filters, 18 KPI cards, seven report tabs, and visible-data CSV export.
- Added Salik and Fine CSV detection, preview, validation summary, duplicate rejection, batch metadata, and confirmation flow.
- Added timestamp-based plate/custody matching using Handover/Takeover data with explicit exception reason codes and overlap protection.
- Added maintenance ingestion from approved/ready jobs using only `allocation.rider` as the payroll-deductible amount.
- Added bike-assignment and Rider ID consolidated calculations with source drill-down and persisted calculation runs.
- Kept all mock finance state isolated in browser storage for later Lovable/Supabase adapter replacement.

## 2026-07-13 — Client / Aggregator master expansion

- Added 16 approved DexaFleet client/aggregator records: Talabat, Noon, Deliveroo, Careem, Amazon, InstaShop, Keeta, Smiles, elGrocer, Carrefour, Quiqup, Shipa Delivery, Emirates Post, EMX, Jeebly, and J&T Express.
- Reused the same adapter list in Add Asset client/aggregator selections.
- Added a safe data-repair merge so existing browser test storage receives missing records without creating case-insensitive duplicates.

## 2026-07-13 — Final module navigation

- Renamed the sidebar Dashboard entry to Asset & Inventory while keeping the same overview route.
- Finalized the sidebar as Asset & Inventory, Asset Register, Handover / Takeover, Maintenance, Reports, and Audit Trail.
- Removed the duplicated Overview/Register/Handover/Reports/Audit dashboard tabs.
- Added a count-free ERP navigation row for Overview, Asset Setup, Fine / Salik, Allocation Queue, Workflow Map, Aggregator Profiles, Bike Packages, and Replacement Bike.
- Removed the duplicated bottom Shortcuts panel.

## 2026-07-12 — Unified Asset Setup masters

- Mapped every Add Asset “Add More” source to Asset Setup: Asset Name, Location, Supplier/Dealer, Workshop/Vendor, Rental/Lease Provider, Finance Company, Telecom Provider, and Client/Aggregator.
- Added a compact master workspace with Add New, search, small Active/Inactive filter, Edit, Delete/Inactive, and Restore actions.
- Setup changes update the same mock-data collections consumed by Add Asset and persist in browser test storage.
- Delete is non-destructive: it removes a value from new selections while preserving existing asset history.
- Kept Maintenance Catalog, Approval Queue, and Audit Log on their specialist workflows.

## Corrected

- Prevented automatic local test-data deletion on refresh.
- Added explicit clean-reset URL behavior only through `?clearLocalTestData=1`.
- Replaced the hard-coded prototype user with an injectable DexaFleet user context and a company-admin offline fallback.
- Added Asia/Dubai current date and timestamp helpers.
- Updated expiry, downtime and Today movement calculations to use the live date.
- Removed the local Mac filesystem path from exported snapshots.
- Added collision-resistant identifiers for new integration work and import batches.
- Implemented the previously missing export function used by reports, movements and handover screens.
- Added UTF-8 BOM and spreadsheet formula-injection protection to CSV exports.
- Corrected the audit-list filter that previously returned every record.
- Corrected the local import control to advertise CSV only instead of falsely accepting Excel.
- Changed import preview to show all rows instead of only four.
- Added explicit confirmation for warning rows and blocking behavior for failed rows.
- Corrected import batch failure counts and added dynamic import timestamps.
- Replaced the fixed Today KPI date with the current Dubai date.
- Added a Supabase schema for assets, movements, approvals, audit and import batches.
- Added tenant RLS baseline policies and database uniqueness constraints.
- Added a Lovable/Supabase integration contract that protects existing DexaFleet routes and modules.
- Linked Asset Head and Asset Category changes to Location, Supplier/Dealer, Custody and Blocking Reason refresh.
- Restricted IT, SIM and stock categories to office/store/branch locations; vehicle-only yards, workshops and police locations no longer appear for a Monitor.
- Separated workshop masters from supplier/dealer masters.
- Added category-specific supplier filtering for Vehicle, IT, SIM, Quantity and Client assets.
- Added category-specific blocking reasons so vehicle, telecom, IT, stock and client reasons do not mix.
- Reused the existing Super Admin feature code `fleet-assets` and documented plan plus company-override access control.
- Changed Asset Name to descriptive free text; Asset Setup approval remains for new categories, not individual models.
- Separated Record Status from Approval Status.
- Changed IT Operating Aggregator to Department / Use options.
- Made Blocking Reason read-only and system-calculated.
- Limited IMEI to Mobile Phone, Tablet and Data Device categories.
- Added IT Manufacturer / Brand and Device Model fields.
- Added IT condition options: New, Good, Fair, Damaged, Under Repair, Lost and Scrapped.
- Added consolidated warranty-date, duplicate-serial, brand and model validation.
- Changed IT picture requirements to Front View, Back View and Serial / Asset Tag Photo.
- Added complete test-data coverage for all eight Asset Heads and all forty-four Asset Categories.
- Added a minimum of five records per category, producing at least 220 category-covered assets.
- Added category-specific test identifiers and values for Vehicle, SIM, IT, Quantity and Client-issued assets.
- Restored Asset Name as a controlled company/category dropdown with an Add More approval option.
- Added a controlled company/location dropdown with an Add More approval option.
- New Asset Name and Location values remain pending until Asset Manager or Admin approval.
- Approved values are persisted in the correct company master and appear automatically in future dropdowns.
- Saved company-specific name and location masters in local prototype state.

## Deliberately not connected to production

- The local HTML build still uses browser storage for offline testing.
- Supabase SQL must be reviewed against the existing `company_users` schema and applied to a test project first.
- Actual Lovable components, route registration and repository/service code require the Lovable source export.
- Drive saving is represented as a local export until a connected storage workflow is implemented.

## Company bike custody reconciliation — 13 July 2026

- Added `asset-assignment-data.js` as a replaceable frontend adapter for the supplied June/July bike assignment source.
- Reconciled 100 unique current bike positions and 175 de-duplicated handover/return custody events.
- Updated all 100 company bike assets with current rider, office, police or workshop state while preserving the official bike-register vendor and chassis data.
- Current result: 53 bikes assigned to riders, 35 in company stock, 9 in police custody and 3 in workshops.
- Added current rider mappings to the Maintenance bike adapter.
- Added assignment-only rider options for three IDs absent from the detailed rider master; no email, phone or Emirates ID was fabricated.
- Updated direct asset-row assignment support and numeric Rider ID recognition across custody, duplicate-assignment, bike-package and Fine/Salik responsibility logic.
- Advanced local prototype storage to v4 so older browser state cannot override the reconciled company data.
- Preserved one invalid source date as a documented anomaly instead of silently correcting it.
- Set Aggregator / Use to Talabat for all 100 imported company bikes.
- Available/company-stock bike rows now show the last rider ID, name, handover date and return date; the same fields are available in Asset Detail.
- Excluded the `Office parking` placeholder from last-rider identity fields for bike `01234`.
- Advanced browser prototype storage to v5 so the Talabat and last-rider updates replace cached v4 records.

## Official Salik CSV import — 13 July 2026

- Added an explicit Salik import schema for: Transaction ID, Trip Date, Trip Time, Transaction Post Date, Toll Gate, Direction, Tag Number, Plate and Amount(AED).
- Added support for the official `dd-MMM-yy` date format used by the supplied Salik report, including `29-Jun-26`.
- Added the detected Salik header list to the import preview for verification before confirmation.
- Updated custody matching to recognize the real numeric Rider IDs and close assignment windows from imported return/takeover movements.
- Preserved the existing Fine CSV format and unrelated finance screens.
# Final Maintenance Billing Update — 12 July 2026

## Fine Import Header Update — 13 July 2026

- Added the official Fine import schema: SL No, Plate No., Amount, Details, Fine Number, Date and Time of Issuing The Fine:, and Location.
- Fine Import Preview now displays the detected canonical header list before confirmation.
- Fine rows now require Plate No., a numeric Amount, Fine Number, and a valid issue date/time before they can be accepted.
- Existing alternate Fine header aliases remain supported for later Lovable integration compatibility.

## Assignment Correction Update — 13 July 2026

- Added Handover Date and Return Date columns to Asset Register for bike custody visibility.
- Active rider assignments display `Active` when no return has been recorded.
- Added Edit Assignment beside Return for assigned assets; it opens the existing controlled holder-transfer workflow.
- Assignment corrections create a new movement and audit entry instead of deleting the original custody history.
- Saving a correction updates the bike's current rider, last rider, handover date/time, and active return state.
- Saving a return updates the bike's return date/time and clears the current rider.
- Finance assignment matching now closes the previous custody interval when a later assignment correction begins, preventing rider overlap.

- Final full-page bill uses Invoice Number as the submitted job/reference number.
- Invoice Number is mandatory for every submitted bill; Invoice Picture is mandatory only when Charge to Rider is greater than zero.
- Current Meter starts blank for workshop entry and calculates oil on-time/extra KM status.
- Bike selection loads last maintenance, last oil, next oil target, full-service, front-tyre and rear-tyre KPI values.
- Oil performance and service/tyre remaining snapshots are stored with the local bill record for later Supabase mapping.
- Complete 216-item company maintenance catalogue is stored in a replaceable mock-data file and managed through Asset Setup → Maintenance Catalog.
- Maintenance dashboard KPI cards are fixed to two compact desktop rows (eight cards per row).
- Oil Status calculates only when OIL CHANGE is selected in the bill checklist.
- Search and compact result count share one line; the separate Price & Item Approval Audit card was removed from the operational page.
- Approve & Release now opens a full bill review before Company Admin confirmation.
- Final bill header is locked to two compact desktop rows: nine primary fields, then Invoice Number, Invoice Picture and seven bike-service KPIs.
- Work Done / Remarks was removed from the maintenance bill form and new saved bill payloads.
- Maintenance dashboard refresh defaults Date From to the first day of the current Dubai month and Date To to today; Reset clears dates for all history.
- Maintenance topbar, title spacing and page side padding were reduced to maximize table width and visible rows.
- Asset Dashboard, Register, Setup and linked KPI grids now use the same compact KPI sizing as Maintenance.
- New Maintenance Job now opens inside the Fleet & Assets shell with sidebar and topbar retained instead of replacing the complete page.
- Asset and Maintenance typography now follows the production DexaFleet scale for page titles, sidebar navigation, buttons, filters, KPI labels/values and data tables.
- Asset Setup, Approval Queue and Fine / Salik moved from bottom shortcuts into the compact dashboard action KPI row.
- Duplicate bottom Maintenance shortcut was removed; the Fleet & Assets sidebar Maintenance module remains the single module entry.
- ACTION REQUIRED title was removed and Police labels now read Bikes in Police Custody.
- Dashboard operational cards were restored to their original action-card visual style; the ACTION REQUIRED title remains removed.
- Police wording is now In Police Custody for all vehicle types.
- Duplicate Final Handoff, Workshop, Police Custody and Approvals cards were removed from the main KPI row.
- Approvals now counts pending movement approvals; Approval Queue counts pending asset/new-edit requests.
- Workshop, In Police Custody and Onboarding moved into the lower operational KPI row.
- The upper five controls now use a flat ERP action toolbar with separators instead of KPI-card styling.

- Removed the large purple Maintenance Control Center banner.
- Reduced KPI card dimensions by approximately 50% and changed the desktop grid to 6 cards per row.
- Added six more KPI cards: Full Service, Engine Work, Accident Repair, Draft Jobs, In Progress and Correction Required.

- Added compulsory Main Work Type with approved locked price, service-KM rule, evidence rules and alert update.
- Added multiple Extra Items with locked catalogue price, editable quantity and automatic line total.
- Added automatic Main Price, Extra Items Total, Parts Subtotal and Grand Total; Labour remains manually editable.
- Added charge allocation validation requiring Company + Rider + Vendor/Warranty + Insurance to equal Grand Total.
- Added Workshop Manager price-change and new-item request flows plus Company Admin approval audit trail.
- Approved catalogue changes affect future bills only; every saved bill preserves its historical price snapshot.
- Updated Maintenance KPIs, job table and CSV export with parts, labour and grand-total reporting.
