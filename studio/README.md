# WhatBin Sanity Studio

Sanity Studio for WhatBin's source-backed disposal rules.

## Local development

Run `npm run dev` from this directory.

## Schema deployment

The local Studio schema registers `disposalConflict`. Before creating these records in the hosted Studio, an authorized operator must deploy the schema with `npx sanity schema deploy` from this directory. Schema deployment changes Sanity's hosted schema; it does not create or publish conflict documents.

## Dataset

- Project: `xqeddep2`
- Dataset: `production` (public published content)
- Published mattress rules: `old-mattress-hanoi` and `old-mattress-ho-chi-minh-city`
- Published household AA/AAA battery rules: `used-household-battery-hanoi` and `used-household-battery-ho-chi-minh-city`.
- Published fluorescent-lamp rules: `used-fluorescent-lamp-hanoi` and `used-fluorescent-lamp-ho-chi-minh-city`
- Published mercury-thermometer rules: `used-mercury-thermometer-hanoi` and `used-mercury-thermometer-ho-chi-minh-city`
- Published standalone lithium-ion battery rules: `used-lithium-ion-battery-hanoi` and `used-lithium-ion-battery-ho-chi-minh-city`
- No phone or power-bank rules are published. `used-mobile-phone` / `Used mobile phone` remains `UNKNOWN` until a reviewed rule is published; `used-power-bank` / `Used power bank` remains `UNKNOWN` in both cities. No power-bank coverage was added. Current applicable city decisions do not establish a general route for intact power banks. An official [2023 Ministry of Agriculture and Environment report](https://vea.mae.gov.vn/tin-tuc-su-kien/8192/lan-toa-tinh-than-bao-ve-moi-truong) describes local Hanoi “Nhà của pin” programs collecting old batteries and broken power banks; this dated local-program report does not establish current citywide acceptance.

Do not add ward-level locations, hours, or fees without a current official source.

## Reviewer-recorded source conflicts

When an independent reviewer confirms unresolved disagreement between current official sources, create a separate `disposalConflict` record for the canonical item and jurisdiction. Enter its effective start date, optional exclusive end date, concise unresolved summary, and at least two competing claims with each source's title, official URL, version/status, and exact citation. The record contains no disposal instruction.

Publishing an active conflict record makes the public resolver return `CONFLICT` ahead of any matching rule. The result carries no route; the optional explainer may describe the recorded claims but cannot decide which source prevails. Drafts and unpublished research are not used.

## Human-reviewed source research

The **Source research** Studio tool requests a transient preview or gap report from the app endpoint configured with `SANITY_STUDIO_RESEARCH_API_URL`. Set that variable in the Studio environment at build/dev time, and configure `SANITY_STUDIO_ORIGINS` on the app server with the exact Studio origin(s). The Studio uses `auth.loginMethod: 'token'` so `useClient()` exposes the signed-in user's token for Access API verification; cookie-based auth does not expose it. The browser does not search or retain sources.

Choose one canonical item and an eligible city, then review the result. The phone item is available for Hanoi source research only; no Ho Chi Minh City phone source was verified. The Hanoi candidate draws on the official [Decision 87/2025/QĐ-UBND city record](https://vanban.hanoi.gov.vn/chi-tiet-van-ban/ve-viec-quy-dinh-quan-ly-chat-thai-ran-sinh-hoat-cua-ho-gia-dinh-ca-nhan-tren-dia-ban-thanh-pho-ha--231176) and [official attachment](https://datafiles.hanoi.gov.vn/gov-hni/6847/VanBan/2026/1/6/Q%C4%90PQ-UBND-87-2025.pdf), Articles 5(1)(h), 7(2)(a), and 7(1)(a). **Unpublished review wording (Article 7(2)(a)):** Keep the discarded phone separate in its own bag; transfer it to an organization or person for reuse or recycling, or to the household waste collection service. Alternatively, store it at home and periodically take it to the commune-designated central collection point. The attachment's internal number/date/effective-date fields are blank; portal metadata provides instrument identity and currentness details. Article 7(1)(a) leaves urban collection time/place to commune directions; do not infer an exact point, schedule, or fee. A preview is not saved until you explicitly select **Create unpublished draft**. This is an unpublished research candidate, not an approved or published rule; only then does the tool create a unique versioned Sanity draft for editor review and publication. Gap reports are never stored.

## Existing evidence migration

`node scripts/migrate-evidence.mjs` runs a read-only dry run and reports how many curated passages will be added to published rules. Before deploying the resolver, set `SANITY_API_TOKEN` to a token with permission to update these documents and run:

```sh
node scripts/migrate-evidence.mjs --write
```

The script updates published rules; review its dry-run output first. `app/knowledge-base.json` remains the migration input and is not read at runtime. Research drafts use the Studio user's token and do not require `SANITY_API_TOKEN`.
