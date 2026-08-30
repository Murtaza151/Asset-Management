# DexaFleet Asset Module Integration Contract

## Safe integration order

1. Create a new feature branch in the Lovable-exported project.
2. Apply `supabase_asset_module.sql` to a Supabase test project first.
3. Replace prototype arrays/localStorage through one repository/service layer.
4. Reuse the existing DexaFleet shell, authentication context, company context, sidebar and design tokens.
5. Add the Asset routes under Fleet & Assets without changing Recruitment, Visa, License or Company Admin routes.
6. Run company isolation and role tests with separate accounts.
7. Run import, movement, approval, report and audit reconciliation tests.
8. Merge only after QA and business UAT sign-off.

## Required application context

The Lovable application must pass the authenticated user into the module through `window.DEXAFLEET_CONTEXT.user` or the project user-context hook. Required values are `id`, `name`, `role`, `company`, `companyId` and `scope`.

The local fallback user exists only for offline prototype testing and must not be used as production authorization.

## Storage buckets

- `asset-documents`: private bucket for registrations, insurance, invoices and certificates.
- `asset-movement-proof`: private bucket for handover, return, workshop and police proof.
- Use company-id and asset-id prefixes.
- Generate signed URLs; never expose public bucket URLs for private documents.

## Non-negotiable rules

- Enforce company isolation with RLS, not frontend filters alone.
- Never delete movement or audit history; create reversals.
- Run duplicate checks in the database as well as the UI.
- Require rejection and reversal reasons.
- Recheck asset version and custody when approving a pending movement.
- Run imports through a validation/commit transaction and retain row results.
- Do not place the Supabase service-role key in the browser.

## Existing-system protection

Use new route, component, table and migration names scoped to the Asset module. Do not rename existing routes, modify existing module tables, or replace the shared sidebar/header. Register only the new Fleet & Assets navigation entries and permission keys.

## Super Admin feature control

- Reuse the existing feature catalog entry `fleet-assets`.
- Do not create a second Asset feature code.
- Resolve access from the effective company feature state: plan baseline plus company override.
- Hide Asset navigation when `fleet-assets` is disabled for the tenant.
- Super Admin controls plans, subscriptions and company overrides; Company Admin controls operational Asset permissions inside an enabled tenant.

## Controlled dropdown masters

- Store Asset Names by `company_id` and `asset_category_id`.
- Store Locations by `company_id` and location type.
- New values created through Add More remain pending and are linked to the submitted asset request.
- Asset Manager or Company Admin approval promotes a pending value into the approved company master.
- Use searchable custom dropdown components anchored below the field trigger; do not rely on native browser select popup placement.
- RLS must prevent one company from reading or reusing another company's custom master values.
