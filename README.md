# WhatBin

WhatBin helps residents check how to dispose of household items in Hanoi and Ho Chi Minh City. Describe or photograph an item, choose a city, confirm the recognized item, and get the currently applicable published rule with its sources.

Current published coverage includes old mattresses, intact used household-size AA/AAA batteries, and clearly identified used household fluorescent lamps or tubes, whether intact or broken. LEDs and other lamp types are not supported. For broken fluorescent lamps, Hanoi's rule provides only the general hazardous-waste storage and collection route; Ho Chi Minh City's rule instructs households not to break them and to retain broken lamps safely. The app does not invent cleanup procedures or ward-specific addresses, schedules, or fees.

## How guidance works

Sanity's published, structured rules are the authority for disposal instructions and effective dates. The curated excerpts in `app/knowledge-base.json` are supporting evidence only; the app displays an excerpt only when its source and version match the rule. If no active rule applies, or applicable rules conflict, the app withholds actionable guidance.

Item recognition uses Gemini. Recognition proposes an item for the user to confirm; it does not choose a disposal rule. Photos are sent to Gemini for recognition and are not retained by the app. Keep `GEMINI_API_KEY` server-side.

## Run locally

Requirements: Node.js.

```sh
node app/server.mjs
```

Open `http://localhost:3000`. Set `PORT` to change the port. Set `GEMINI_API_KEY` in the server environment to enable item recognition. Rule lookup uses the public Sanity production dataset.

Run the server tests from the repository root:

```sh
node --test app/server.test.mjs
```

Run the Sanity Studio from its directory:

```sh
cd studio
npm ci
npm run dev
```

## Deploy with Vercel

Import the GitHub repository into Vercel, set the project root directory to `app/`, and configure `GEMINI_API_KEY` in the project's environment variables. Vercel builds deployments from GitHub pushes; pushes to the configured production branch publish production deployments. `app/vercel.json` includes the evidence file and static assets needed by the server.

See [`app/README.md`](app/README.md) for server and API details and [`studio/README.md`](studio/README.md) for the content studio.

## Repository map

- `app/` — Node.js HTTP server, browser app, tests, and curated supporting evidence.
- `studio/` — Sanity Studio for managing disposal rules.
- `docs/adr/` — architecture decisions.
- `CONTEXT.md` — project terminology and domain definitions.
- `WHATBIN-PHASE-1.md` — initial product scope and reviewed seed-rule notes.
