# WhatBin

WhatBin helps residents check how to dispose of household items in Hanoi and Ho Chi Minh City. Describe or photograph an item, choose a city, confirm the recognized item, and get the currently applicable published rule with its sources.

Current published coverage includes old mattresses, intact used household-size AA/AAA batteries, standalone rechargeable lithium-ion batteries (`used-lithium-ion-battery` / `Used rechargeable lithium-ion battery`), clearly identified used household fluorescent lamps or tubes whether intact or broken, and clearly identified discarded household mercury thermometers whether intact or broken. Standalone Li-ion batteries are distinct from intact AA/AAA household batteries and from a whole power bank. Digital/electronic or non-mercury thermometers, industrial instruments, and uncertain thermometer types are not supported. LEDs and other lamp types are not supported. For broken fluorescent lamps, Hanoi's rule provides only the general hazardous-waste storage and collection route; Ho Chi Minh City's rule instructs households not to break them and to retain broken lamps safely. The app does not invent cleanup procedures or ward-specific addresses, schedules, or fees.

Hanoi Decision 87/2025/QĐ-UBND (effective 2026-01-08) and Ho Chi Minh City Decision 58/2025/QĐ-UBND (effective 2025-04-25) apply their general discarded-battery/accumulator hazardous-waste rules to standalone Li-ion batteries. Hanoi requires safe, corrosion- and water-resistant, non-leaking packaging and allows home storage or periodic local collection without a service fee. Ho Chi Minh City requires the battery to remain intact (do not dismantle), hazardous waste to be kept separate and safe, and transfer to a licensed operator or local designated point; no fee applies only at a compliant point. These current city decisions do not establish a general route for intact power banks. An official [2023 Ministry of Agriculture and Environment report](https://vea.mae.gov.vn/tin-tuc-su-kien/8192/lan-toa-tinh-than-bao-ve-moi-truong) describes local Hanoi “Nhà của pin” programs collecting old batteries and broken power banks, but this dated report does not establish current citywide acceptance. `used-power-bank` / `Used power bank` is a separate candidate with no published rule, so it resolves `UNKNOWN` in both cities.

For discarded household mercury thermometers, Hanoi requires safe, corrosion- and water-resistant, non-leaking packaging and allows home storage or scheduled collection; it states no mercury-thermometer-specific instructions for a broken item or cleanup. Ho Chi Minh City says not to break them and, if broken, to retain them safely to avoid injury and mercury dispersal during sorting, collection, and treatment. Neither city’s cited rule provides a cleanup procedure.

## How guidance works

Sanity's published structured rules are the sole authority for disposal instructions. Runtime resolution reads exact, source-versioned evidence passages attached to those rules and displays a passage only when its exact source references match. Migrate the existing curated passages before deploying the new resolver; instructions are withheld when no active rule applies or applicable rules conflict.

Item recognition uses Gemini. Recognition proposes an item for the user to confirm; it does not choose a disposal rule. Photos are sent to Gemini for recognition and are not retained by the app. Keep `GEMINI_API_KEY` server-side.

## Run locally

Requirements: Node.js.

```sh
node app/server.mjs
```

Set `GEMINI_API_KEY` in the server environment for recognition and source research. Configure `SANITY_STUDIO_ORIGINS` with exact allowed Studio origins before enabling source research. Rule lookup uses the public Sanity production dataset.

Run the server tests from the repository root:

```sh
node --test app/server.test.mjs app/source-research.test.mjs studio/scripts/migrate-evidence.test.mjs
```

Run the Sanity Studio from its directory:

```sh
cd studio
npm ci
npm run dev
```

## Deploy with Vercel

Import the GitHub repository into Vercel, set the project root directory to `app/`, and configure `GEMINI_API_KEY` and `SANITY_STUDIO_ORIGINS`. Build the Studio with `SANITY_STUDIO_RESEARCH_API_URL` pointing to the deployed app's `/api/research-source`. Migrate existing evidence passages before deploying the new resolver; see [`studio/README.md`](studio/README.md). Vercel builds deployments from GitHub pushes; pushes to the configured production branch publish production deployments. `app/vercel.json` includes the static assets required by the server.

See [`app/README.md`](app/README.md) for server and API details and [`studio/README.md`](studio/README.md) for the content studio.

## Repository map

- `app/` — Node.js HTTP server, browser app, tests, and the legacy evidence migration input.
- `studio/` — Sanity Studio for managing disposal rules and human-reviewed research drafts.
- `docs/adr/` — architecture decisions.
- `CONTEXT.md` — project terminology and domain definitions.
- `WHATBIN-PHASE-1.md` — initial product scope and reviewed seed-rule notes.
