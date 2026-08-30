# Local Verification Report

## 2026-07-13 — Key Arabia company rider import

- PASS: 55 company-supplied rider records loaded from the isolated rider-data adapter.
- PASS: no duplicate Rider IDs, emails, phone numbers, or Emirates ID paper numbers.
- PASS: all email addresses match the expected email format.
- PASS: all phone numbers match the 971 plus nine-digit UAE format.
- PASS: all Emirates ID paper numbers match the 784 plus twelve-digit format.
- PASS: statuses normalized to 52 Active and 3 On Vacation riders.
- PASS: rider contact and Emirates ID values are used by handover-sheet details instead of generated placeholders.
- PASS: all JavaScript syntax, inline scripts, and local HTML references pass after integration.
- NOT RUN: interactive `file://` browser testing remains unavailable under the current browser security policy.

## 2026-07-13 — Key Arabia company bike import

- PASS: 100 company-supplied bike records loaded from the isolated company-data adapter.
- PASS: all 100 bike numbers are unique.
- PASS: all 100 chassis numbers are unique and match the 17-character VIN pattern.
- PASS: all registration expiry values converted successfully to ISO dates.
- PASS: every imported record is Owned by Key Arabia and classified as Fleet / Vehicle → Bike.
- PASS: the vendor set contains only ALDOBOWI and Bike Care, matching the supplied register.
- PASS: Maintenance reads the same 100-bike source and leaves rider/service data blank until supplied.
- NOT RUN: interactive `file://` browser testing remains unavailable under the current browser security policy.

## 2026-07-13 — Empty operational data baseline

- PASS: packaged asset, rider, movement, allocation, replacement, maintenance, Fine, Salik, import-batch, and audit record arrays are empty.
- PASS: the automatic asset coverage seed function and uploaded bike sheet records are removed.
- PASS: legacy asset, maintenance, and finance browser-storage keys are cleared or superseded by clean versions.
- PASS: the maintenance form blocks submission until real bike assignment data is available.
- PASS: dashboard empty-state percentages and KPI totals resolve to zero instead of sample values.
- PASS: all standalone and inline JavaScript syntax checks pass after the cleanup.
- NOT RUN: interactive `file://` browser testing remains unavailable under the current browser security policy.

## 2026-07-13 — Final English-only package audit

- PASS: all HTML, JavaScript, CSS, Markdown, text, SQL, JSON, and CSV source files were scanned for Urdu, Arabic, Hindi, and Devanagari script; none was found.
- PASS: the bundled XLSX test workbook was unpacked and scanned for Urdu, Arabic, Hindi, and Devanagari script; none was found.
- PASS: all standalone JavaScript files passed `node --check`.
- PASS: inline scripts in both prototype HTML pages parsed successfully.
- PASS: all local CSS and JavaScript references used by the HTML pages resolve to packaged files.
- PASS: the final ZIP archive passed integrity testing.
- NOT RUN: interactive `file://` browser testing remains unavailable under the current browser security policy.

## 2026-07-13 — Fine and Salik workspace

- PASS: main prototype and finance module JavaScript syntax checks.
- PASS: all required English report tabs and system actions are present.
- PASS: Salik header mapping uses Trip Date + Trip Time and keeps Post Date as source detail.
- PASS: Fine header mapping uses Fine Number and issue date/time.
- PASS: duplicate protection uses Transaction ID or Fine Number during import.
- PASS: maintenance source accepts only Approved/Ready for Road jobs with a positive `allocation.rider` value.
- PASS: matching returns explicit unmatched/overlap reason codes and never silently selects the first overlapping assignment.
- PASS: responsive CSS provides nine KPI columns on wide screens and collapses safely at tablet/mobile breakpoints.
- NOT RUN: interactive local-file browser test because the available browser policy blocks `file://` navigation.

## 2026-07-13 — Client / Aggregator master data

- PASS: all 16 requested client/aggregator names exist in the Key Arabia master seed.
- PASS: Add Asset aggregator options use the same approved source list.
- PASS: existing local test data is merged case-insensitively without duplicate Key Arabia entries.

## 2026-07-13 — Navigation verification

- PASS: sidebar Asset & Inventory targets the existing dashboard section.
- PASS: final six sidebar entries are present and Maintenance retains its existing module link.
- PASS: duplicate dashboard tabs and bottom Shortcuts block were removed.
- PASS: all eight count-free ERP navigation targets resolve to existing sections.

## 2026-07-12 — Asset Setup master controls

- PASS: setup-manager and main prototype JavaScript syntax checks.
- PASS: all eight Add Asset “Add More” sources have a corresponding Asset Setup card.
- PASS: master UI includes Add New, search, compact status filter, row Edit, Delete/Inactive, and Restore.
- PASS: duplicate validation is scoped by company and parent/type.
- PASS: changes call the existing persistence adapter; hierarchy, templates, and document rules are persisted.
- PASS: responsive controls collapse on narrow screens and the table stays inside a bounded scroll container.
- NOT RUN: interactive browser test because the available browser policy blocks local `file://` navigation; static and syntax checks were completed instead.

## Passed

- JavaScript syntax check with Node.
- All inline click/change/input handler function references resolve.
- Missing `mockExport` function is now defined.
- No hard-coded date remains in the Today movement comparison.
- Local import file control no longer claims unsupported XLSX handling.
- Audit filter bypass expression removed.
- Refresh-reset control no longer sets a permanent reset flag.
- Supabase SQL includes RLS enablement for all new module tables.
- Existing source package files remain separate; no live Key Arabia module was changed.
- Monitor/IT location rules exclude parking yard, workshop, police station and vendor yard.
- Supplier/Dealer master no longer contains workshop records.
- Asset category changes refresh all linked dropdowns.
- Category-specific blocker mappings are present for Vehicle, IT, SIM, Quantity and Client assets.
- All inline UI handlers resolve after the final Add Asset changes.
- JavaScript syntax passes after the final Add Asset changes.
- Asset Name is free text and no longer requires model-level Asset Setup approval.
- IMEI is conditional by supported category.
- Warranty-before-purchase and duplicate-company-serial validations are present.
- User-facing source strings were scanned for Roman Urdu terms; none were found.
- Eight Asset Heads and forty-four unique Asset Categories were detected.
- Minimum test-data target is 220 records: five records for every category.
- Coverage seeding preserves existing records and fills only missing category counts.
- Vehicle, SIM, IT, Quantity and Client records receive category-specific identifiers and fields.
- Asset Name and Location Add More approval hooks are present.
- Approved custom values are persisted in company-specific local masters.
- JavaScript syntax and all inline handlers pass after the controlled-dropdown changes.

## Required before live integration

- Browser walkthrough of every page with the Lovable design shell.
- Supabase test-project migration and rollback test.
- Separate-account company isolation and role tests.
- Storage bucket upload and signed-URL tests.
- Large import, concurrency and transaction tests.
- Developer, independent tester, business-team, QA and client-UAT sign-off.

## Company bike custody reconciliation — 13 July 2026

- JavaScript syntax for every local adapter/module file: PASS
- Inline JavaScript parse for Asset and Maintenance HTML: PASS
- Current bike positions: PASS (100 unique bikes)
- Imported custody events: PASS (175 events, all mapped to known assets)
- Current assignment totals: PASS (53 rider, 35 stock, 9 police, 3 workshop)
- Current Maintenance rider mappings: PASS (53)
- Leading-zero bike number `01234`: PASS
- Bike 57721 current rider/date spot check: PASS
- Bike 57067 prior return and latest reassignment spot check: PASS
- Detailed-or-assignment-only rider coverage: PASS
- Assignment-only riders contain no fabricated contact or Emirates ID details: PASS
- Browser state version reset from v3 to v4: PASS
- Source anomaly preservation: PASS (one return date precedes its handover date)
- NOT RUN: interactive browser walkthrough because local `file://` navigation is unavailable in the current test environment.
- Aggregator / Use Talabat mapping: PASS (100/100 bikes)
- Available bike last-rider mapping: PASS (34/34 returned bikes with real rider records)
- Office placeholder exclusion for bike `01234`: PASS
- Asset Register last-rider row output and Asset Detail fields: PASS (static source verification)
- Browser state version reset from v4 to v5: PASS

## Official Salik CSV import — 13 July 2026

- Supplied `/Users/apple/Downloads/salik.csv` detected as SALIK: PASS
- Official nine-column header mapping: PASS
- `dd-MMM-yy` trip-date parsing: PASS
- Total rows: PASS (131)
- Accepted rows: PASS (131)
- Rejected rows: PASS (0)
- Duplicate rows against a clean workspace: PASS (0)
- Accepted amount: PASS (AED 586.00)
- Header list visible in import preview: PASS
- Numeric Rider ID custody-source recognition: PASS (static and adapter validation)
# Final Maintenance Billing Verification — 12 July 2026

- Invoice Number required on submitted bills: PASS
- Invoice Number uniqueness validation: PASS
- Invoice Picture conditional rider-charge validation: PASS
- Blank workshop meter default and mandatory submit validation: PASS
- Bike service KPI mapping and oil extra/remaining calculation: PASS
- Invoice Number used as saved job/reference number: PASS
- Service target snapshot persistence: PASS
- Company-scoped 216-item catalogue data: PASS
- Eight-by-two compact dashboard KPI layout: PASS
- Oil Status gated by OIL CHANGE selection: PASS
- Search/result single-line layout and short count: PASS
- Approval audit card removal: PASS
- Admin bill-review gate before Approve & Release: PASS
- Exact 9 + 9 compact desktop bill-header layout: PASS
- Work Done / Remarks form and payload removal: PASS
- Current-month refresh default and Reset all-history behavior: PASS
- Compact topbar, sticky offset and full-width maintenance layout: PASS
- Asset-wide compact KPI override and responsive columns: PASS
- In-shell Maintenance Job view with sidebar/topbar retained: PASS
- Production-style Key Arabia font stack and shared typography scale: PASS
- Eight-card compact dashboard action row and removed pseudo-title: PASS
- Bottom shortcut cleanup and retained sidebar Maintenance module: PASS
- Bikes in Police Custody wording and navigation: PASS
- Original dashboard action-card styling restored: PASS
- Cross-row duplicate KPI removal: PASS
- Separate movement-approval and asset-approval queue counts: PASS
- In Police Custody vehicle-neutral wording: PASS
- Five-action ERP toolbar and seven unique lower KPIs: PASS
- Workshop, Police Custody and Onboarding KPI relocation: PASS

- Official seven-column Fine header detection: PASS
- Fine header list shown in Import Preview: PASS
- Fine Plate No., Amount, Fine Number and issue date/time mapping: PASS
- Comma-formatted Fine amount parsing: PASS
- Fine sample import (3 accepted, 0 rejected, AED 1,460.00): PASS
- Salik import regression (131 accepted, 0 rejected, AED 586.00): PASS

- Bike 67929 source assignment and handover date verification: PASS
- Asset Register Handover Date and Return Date columns: PASS
- Assigned-asset Edit Assignment and Return actions: PASS
- Assignment correction updates current custody without deleting history: PASS
- Return movement updates return date and clears current rider: PASS
- Corrected rider finance matching with zero overlapping candidates: PASS
- Asset page inline JavaScript syntax validation: PASS

- JavaScript syntax validation: PASS
- Compulsory Main Work Type validation: PASS
- Approved price read-only control: PASS
- Multiple Extra Items calculation: PASS
- Labour and Grand Total calculation: PASS
- Charge allocation equality check: PASS
- Dynamic invoice/photo requirement rules: PASS
- Price change / new item request audit flow: PASS
- Historical bill price snapshot protection: PASS
