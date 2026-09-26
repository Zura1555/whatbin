# WhatBin Sanity Studio

Sanity Studio for WhatBin's source-backed disposal rules.

## Local development

Run `npm run dev` from this directory.

## Dataset

- Project: `xqeddep2`
- Dataset: `production` (public published content)
- Published mattress rules: `old-mattress-hanoi` and `old-mattress-ho-chi-minh-city`
- Published fluorescent-lamp rules: `used-fluorescent-lamp-hanoi` and `used-fluorescent-lamp-ho-chi-minh-city`
- Published mercury-thermometer rules: `used-mercury-thermometer-hanoi` and `used-mercury-thermometer-ho-chi-minh-city`
- Published standalone lithium-ion battery rules: `used-lithium-ion-battery-hanoi` and `used-lithium-ion-battery-ho-chi-minh-city`
- No power-bank rules are published. Current applicable city decisions do not establish a general route for intact power banks. An official [2023 Ministry of Agriculture and Environment report](https://vea.mae.gov.vn/tin-tuc-su-kien/8192/lan-toa-tinh-than-bao-ve-moi-truong) describes local Hanoi “Nhà của pin” programs collecting old batteries and broken power banks; this dated local-program report does not establish current citywide acceptance. `used-power-bank` remains `UNKNOWN` in both cities.

Do not add ward-level locations, hours, or fees without a current official source.

## Human-reviewed source research

The **Source research** Studio tool requests a transient preview or gap report from the app endpoint configured with `SANITY_STUDIO_RESEARCH_API_URL`. Set that variable in the Studio environment at build/dev time, and configure `SANITY_STUDIO_ORIGINS` on the app server with the exact Studio origin(s). The Studio uses `auth.loginMethod: 'token'` so `useClient()` exposes the signed-in user's token for Access API verification; cookie-based auth does not expose it. The browser does not search or retain sources.

Choose one existing canonical item and Hanoi or Ho Chi Minh City, then review the result. A preview is not saved until you explicitly select **Create unpublished draft**. The tool creates a unique versioned Sanity draft; an editor must review and publish it through the normal Studio workflow. Gap reports are never stored.

## Existing evidence migration

`node scripts/migrate-evidence.mjs` runs a read-only dry run and reports how many curated passages will be added to published rules. Before deploying the resolver, set `SANITY_API_TOKEN` to a token with permission to update these documents and run:

```sh
node scripts/migrate-evidence.mjs --write
```

The script updates published rules; review its dry-run output first. `app/knowledge-base.json` remains the migration input and is not read at runtime. Research drafts use the Studio user's token and do not require `SANITY_API_TOKEN`.
