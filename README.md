# WhatBin

WhatBin helps residents check how to dispose of household items in Hanoi and Ho Chi Minh City. Describe or photograph an item, choose a city, or use device location to select the nearer city, confirm the recognized item, and get the currently applicable published rule with its sources. Location access is requested only when explicitly selected.

Current published coverage includes old mattresses, intact used household-size AA/AAA batteries, standalone rechargeable lithium-ion batteries (`used-lithium-ion-battery` / `Used rechargeable lithium-ion battery`), clearly identified used household fluorescent lamps or tubes whether intact or broken, and clearly identified discarded household mercury thermometers whether intact or broken. Standalone Li-ion batteries are distinct from intact AA/AAA household batteries and from a whole power bank. Digital/electronic or non-mercury thermometers, industrial instruments, and uncertain thermometer types are not supported. LEDs and other lamp types are not supported. For broken fluorescent lamps, Hanoi's rule provides only the general hazardous-waste storage and collection-point instructions, not breakage cleanup or transport instructions; Ho Chi Minh City's cited rule does not address broken lamps. The canonical `used-mobile-phone` / `Used mobile phone` is available only for Hanoi source research, not published coverage; no phone rule is published, so phone resolution remains `UNKNOWN` until a reviewed rule is published. No Ho Chi Minh City phone disposal source was verified. Complete power banks remain `UNKNOWN` in both cities; no power-bank coverage was added.

An unpublished Hanoi phone research candidate is based on the official [Decision 87/2025/QĐ-UBND city record](https://vanban.hanoi.gov.vn/chi-tiet-van-ban/ve-viec-quy-dinh-quan-ly-chat-thai-ran-sinh-hoat-cua-ho-gia-dinh-ca-nhan-tren-dia-ban-thanh-pho-ha--231176) and its [official attachment](https://datafiles.hanoi.gov.vn/gov-hni/6847/VanBan/2026/1/6/Q%C4%90PQ-UBND-87-2025.pdf), especially Articles 5(1)(h), 7(2)(a), and 7(1)(a). **Unpublished review wording (Article 7(2)(a)):** Keep the discarded phone separate in its own bag; transfer it to an organization or person for reuse or recycling, or to the household waste collection service. Alternatively, store it at home and periodically take it to the commune-designated central collection point. Article 7(1)(a) makes urban collection time and place dependent on commune directions; no exact point, schedule, or fee is stated here. The attachment's internal number, date, and effective-date fields are blank; portal metadata supplies the instrument identity, signer, issuance/effective dates, and current legal status. This source supports research only; the candidate is not approved or published.

Hanoi Decision 87/2025/QĐ-UBND (effective 2026-01-08) and Ho Chi Minh City Decision 58/2025/QĐ-UBND (effective 2025-04-25) apply their general discarded-battery/accumulator hazardous-waste rules to standalone Li-ion batteries. Hanoi requires safe, corrosion- and water-resistant, non-leaking packaging and allows home storage or periodic local collection without a service fee. Ho Chi Minh City requires the battery to remain intact (do not dismantle), hazardous waste to be kept separate and safe, and transfer to a licensed operator or local designated point; no fee applies only at a compliant point. These current city decisions do not establish a general route for intact power banks. An official [2023 Ministry of Agriculture and Environment report](https://vea.mae.gov.vn/tin-tuc-su-kien/8192/lan-toa-tinh-than-bao-ve-moi-truong) describes local Hanoi “Nhà của pin” programs collecting old batteries and broken power banks, but this dated report does not establish current citywide acceptance. `used-power-bank` / `Used power bank` is a separate candidate with no published rule, so it resolves `UNKNOWN` in both cities.

For discarded household mercury thermometers, Hanoi requires safe, corrosion- and water-resistant, non-leaking packaging and allows home storage or scheduled collection; it states no mercury-thermometer-specific instructions for a broken item or cleanup. Ho Chi Minh City says not to break them and, if broken, to retain them safely to avoid injury and mercury dispersal during sorting, collection, and treatment. Neither city’s cited rule provides a cleanup procedure.

## How guidance works

Published Sanity rules remain the sole authority for disposal instructions. A reviewer-published `disposalConflict` record for the same item, city, and effective date takes precedence over a matching rule; overlapping active rules also produce `CONFLICT`. Runtime resolution uses published records only. It reads exact, source-versioned evidence passages and shows a passage only when its cited sources and versions match.

Item recognition uses Gemini and proposes only supported item categories for the user to confirm; it does not identify arbitrary objects or choose disposal rules. The current supported list is in [`app/README.md`](app/README.md). Photos are sent to Gemini for recognition and are not retained by the app. Keep `GEMINI_API_KEY` server-side.

After deterministic resolution, residents may explicitly ask for a source explanation. A server-side Gemini agent uses the AI SDK and read-only Sanity Context MCP tools, then streams its answer into the existing chat UI. It cannot choose or change an action; `UNKNOWN` and `CONFLICT` never receive a disposal route. City comparison is allowed only when both cities independently resolve the same item as `MATCHED`. Chat stays in the current page and is not persisted.

## Run locally

Requirements: Node.js 22 or later.

Copy `app/.env.example` to `app/.env` and fill in the Gemini API key, Sanity Context MCP URL, and organization Context Viewer token (`SANITY_API_READ_TOKEN`) before starting the server.

```sh
node --env-file=app/.env app/server.mjs
```

`app/.env` is Git-ignored and loaded with Node's built-in `--env-file`; on Vercel, set the same values as Environment Variables. Configure the Context endpoint to expose `initial_context` and a content reader (`knowledge_base_read`, `groq_query`, or `array_field_reader`); the server passes through the endpoint's configured tools. Use an organization-level Context Viewer token. Configure `SANITY_STUDIO_ORIGINS` with exact allowed Studio origins before enabling source research. Rule lookup uses the public Sanity production dataset.

Run the server tests from the repository root:

```sh
node --test app/server.test.mjs app/source-research.test.mjs app/context-agent.test.mjs studio/scripts/migrate-evidence.test.mjs
```

Run the Sanity Studio from its directory:

```sh
cd studio
npm ci
npm run dev
```

## Deploy with Vercel

Import the GitHub repository into Vercel, set the project root directory to `app/`, and configure `GEMINI_API_KEY`, `SANITY_CONTEXT_MCP_URL`, `SANITY_API_READ_TOKEN`, and `SANITY_STUDIO_ORIGINS`. Use an organization-level Context Viewer token. The endpoint must expose `initial_context` plus a content reader (`knowledge_base_read`, `groq_query`, or `array_field_reader`). Build the Studio with `SANITY_STUDIO_RESEARCH_API_URL` pointing to the deployed app's `/api/research-source`. Migrate existing evidence passages before deploying the new resolver; see [`studio/README.md`](studio/README.md). Vercel builds deployments from GitHub pushes; pushes to the configured production branch publish production deployments. `app/vercel.json` includes the static assets required by the server. Do not use `vercel --prod` without production approval.

See [`app/README.md`](app/README.md) for server and API details and [`studio/README.md`](studio/README.md) for the content studio.

## Repository map

- `app/` — Node.js HTTP server, browser app, tests, and the legacy evidence migration input.
- `studio/` — Sanity Studio for managing disposal rules, reviewer-recorded conflicts, and human-reviewed research drafts.
- `docs/adr/` — architecture decisions.
- `CONTEXT.md` — project terminology and domain definitions.
- `WHATBIN-PHASE-1.md` — initial product scope and reviewed seed-rule notes; the root README lists current expanded coverage. No post-Phase-1 roadmap is approved.
