# Complete Asset Test Data Coverage

The local build contains eight Asset Heads and forty-four unique Asset Categories. On load, the coverage seeder checks every category and adds only the missing records required to reach at least five entries per category.

Minimum generated coverage: 44 categories × 5 records = 220 asset records.

## Category-specific data

- Vehicle records include unique plate, chassis, engine, model, odometer, registration, insurance and Salik identifiers.
- SIM records include unique mobile and ICCID values, provider, data, minutes and SIM status.
- IT records include unique serial values, conditional IMEI, manufacturer, model, warranty and security status.
- Quantity records include total, issued, damaged, available and reorder quantities.
- Client-issued records include unique client references, owner, profile, return rule and handover reference.

The seeder preserves existing sample records and adds only the shortfall. It does not create duplicate category names or overwrite existing records.

