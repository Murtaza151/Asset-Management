# DexaFleet Assets — Administrator Guide

## Entry points

- Search for **DexaFleet Assets** to open the operational dashboard.
- Standard list/form/report views remain available for every DocType.
- Asset records receive a **DexaFleet Operations** section after installation.

## Roles

- **DexaFleet Asset User** — operational request entry and read access.
- **DexaFleet Asset Manager** — riders, assets, custody submission, and asset approvals.
- **DexaFleet Operations Manager** — custody, allocation, packages, and replacements.
- **DexaFleet Workshop User** — draft/in-progress maintenance job entry.
- **DexaFleet Workshop Manager** — maintenance submission and catalogue requests.
- **DexaFleet Finance User** — Fine/Salik imports, matching, and charge calculations.
- **DexaFleet Finance Manager** — charge-run approval and finance reconciliation.
- **DexaFleet Company Admin** — company configuration and protected approvals.

Every operational user must also receive a **User Permission** for Company. Without it, the app intentionally returns no company-scoped data.

## Asset onboarding

1. Create a **DexaFleet Asset Request**.
2. Submit it for approval.
3. The configured approval role reviews identity, category, company, ownership, and legal data.
4. Approval creates or links the ERPNext Asset.
5. Use **DexaFleet Custody Movement** for every subsequent handover, return, workshop, police, client, correction, or reversal event.

Do not directly edit the current rider or custody fields on Asset; they are read-only snapshots derived from submitted movements.

## Maintenance

Maintenance prices are read from **DexaFleet Maintenance Item** and copied into each job row. This historical price snapshot is not changed by later catalogue updates.

A submitted bill requires:

- Invoice Number.
- At least one approved maintenance item.
- Evidence required by selected catalogue items.
- Charge allocations exactly equal to Grand Total.
- Invoice attachment when rider charge is greater than zero.

Only a Company Admin can approve and submit a Pending Approval maintenance bill as Ready for Road.

## Fine and Salik

Use **DexaFleet Import Batch** for CSV validation and commit. Warnings require explicit confirmation; blocked rows cannot commit.

After import, use custody matching. Matching uses plate and the submitted custody movement effective at the transaction timestamp. Missing assets, missing custody, non-rider custody, and equal-time overlaps become exceptions instead of guessed rider charges.

## Rider charge runs

1. Approve matched Fine/Salik records for charge.
2. Create a Rider Charge Run with date range and Company.
3. Calculate sources.
4. Review/exclude items.
5. Finance Manager approves the run, which locks source records to that run.
6. Post through the approved accounting/payroll workflow and record its reference.

The app does not silently post accounting transactions because each organization's chart of accounts and payroll design differ. Posting reference is explicit and auditable.

