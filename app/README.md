# WhatBin server

Run from the repository root with Node.js:

```sh
node app/server.mjs
```

The server listens on port `3000`; set `PORT` to use another port. Recognition uses Gemini 3.7 Flash. Set `GEMINI_API_KEY` in the server environment; the key is used only server-side, and recognition returns HTTP 503 if it is not configured.

Run the deterministic rule-selection test from the repository root with `node --test app/server.test.mjs`.

## API

- `POST /api/recognize` accepts JSON with at least one of a description and image: `{"description":"an old mattress"}`, `{"description":"an intact used AA battery"}`, `{"description":"a used fluorescent tube, already broken"}`, `{"description":"a used mercury thermometer"}`, `{"image":{"mimeType":"image/jpeg","base64":"…"}}`, or `{"description":"a used fluorescent tube","image":{"mimeType":"image/jpeg","base64":"…"}}`. If both are supplied, recognition considers both. Supported image types are JPEG, PNG, and WebP. Recognition proposes old mattresses, clearly identified discarded intact household-size AA/AAA batteries, clearly identified used household fluorescent lamps/tubes whether intact or already broken, or clearly identified discarded household mercury thermometers whether intact or broken. The thermometer candidate is exactly `canonicalItemId: "used-mercury-thermometer"` and `itemName: "Used mercury thermometer"`; digital/electronic or non-mercury thermometers, industrial instruments, and uncertain types are unsupported. Recognition proposes a candidate only at confidence `0.8` or higher. It never confirms the item or returns disposal instructions.
- `POST /api/resolve` accepts a confirmed candidate, for example `{"jurisdiction":"hanoi","canonicalItemId":"used-fluorescent-lamp","confirmed":true}`. Shared lamp and thermometer item IDs/names are exactly `used-fluorescent-lamp` / `Used fluorescent lamp` and `used-mercury-thermometer` / `Used mercury thermometer`; their Sanity rule IDs are maintained with the published rules. Existing old-mattress and battery rule IDs remain distinct from their shared `canonicalItemId` values. Jurisdictions are `hanoi` and `ho-chi-minh-city`. It queries published Sanity rules in project `xqeddep2`, dataset `production`, and applies effective dates using the selected city's local date. Results are `MATCHED`, `UNKNOWN`, or `CONFLICT`; unknown/conflicting rules do not include actionable instructions.

The server limits request bodies and does not retain or log submitted descriptions or photos. Photos are sent to Google's Gemini service for recognition; do not submit sensitive images. Rule lookup is an anonymous public Sanity query. The API does not persist user cases. `app/knowledge-base.json` contains curated Vietnamese excerpts indexed to the exact source title, URL, citation, and required amendment/effective-date reference. Sanity remains the sole authority for instructions; a missing KB file or any source/version mismatch produces no excerpt while preserving the rule and source links.

Thermometer coverage is limited to clearly identified discarded household mercury thermometers; digital/electronic or non-mercury thermometers, industrial instruments, and uncertain types are unsupported. Hanoi requires safe, corrosion- and water-resistant, non-leaking packaging and permits home storage or scheduled collection, but its cited decision gives no mercury-thermometer-specific broken-item or cleanup instruction. Ho Chi Minh City says not to break mercury thermometers; if one is broken, retain it safely to avoid injury and mercury dispersal during sorting, collection, and treatment. Neither city's cited rule provides a cleanup procedure.

## Vercel

Import the repository and set the Vercel project root directory to `app`. Vercel uses `server.mjs` as the Node.js server entrypoint; `vercel.json` includes the knowledge base and static assets in the server bundle.

Set `GEMINI_API_KEY` in the Vercel project’s Environment Variables. Do not commit the key. Run `vercel dev` from `app/` to verify locally, or `vercel` for a preview deployment. Do not use `vercel --prod` without production approval.
