# WhatBin server

Run from the repository root with Node.js:

```sh
node app/server.mjs
```

The server listens on port `3000`; set `PORT` to use another port. Recognition uses Gemini 3.6 Flash. Set `GEMINI_API_KEY` in the server environment; the key is used only server-side, and recognition returns HTTP 503 if it is not configured.

Run the deterministic rule-selection test from the repository root with `node --test app/server.test.mjs`.

## API

- `POST /api/recognize` accepts JSON with at least one of a description and image: `{"description":"an old mattress"}`, `{"description":"an intact used AA battery"}`, `{"description":"a used fluorescent tube, already broken"}`, `{"image":{"mimeType":"image/jpeg","base64":"…"}}`, or `{"description":"a used fluorescent tube","image":{"mimeType":"image/jpeg","base64":"…"}}`. If both are supplied, recognition considers both. Supported image types are JPEG, PNG, and WebP. Recognition proposes old mattresses, clearly identified discarded intact household-size AA/AAA batteries, or clearly identified used household fluorescent lamps/tubes whether intact or already broken. The lamp candidate is exactly `canonicalItemId: "used-fluorescent-lamp"` and `itemName: "Used fluorescent lamp"`; LED, incandescent/halogen, industrial, other, or uncertain lamp types are rejected. Vehicle/industrial batteries, device-installed packs, damaged/leaking cells, and unsupported or uncertain items are also rejected. Gemini's structured response must meet the existing confidence threshold of 0.8 and format checks; the user must explicitly confirm the candidate before resolving it. Recognition identifies the item only and does not choose disposal instructions.
- `POST /api/resolve` accepts a confirmed candidate, for example `{"jurisdiction":"hanoi","canonicalItemId":"used-fluorescent-lamp","confirmed":true}`. The shared lamp item is exactly `used-fluorescent-lamp` / `Used fluorescent lamp`; its Sanity rule IDs are `used-fluorescent-lamp-hanoi` and `used-fluorescent-lamp-ho-chi-minh-city`. Existing old-mattress and battery rule IDs remain distinct from their shared `canonicalItemId` values. Jurisdictions are `hanoi` and `ho-chi-minh-city`. It queries published Sanity rules in project `xqeddep2`, dataset `production`, and applies effective dates using the selected city's local date. Results are `MATCHED`, `UNKNOWN`, or `CONFLICT`; unknown/conflicting rules do not include actionable instructions. The Hanoi fluorescent-lamp rule gives the general household hazardous-waste storage and collection route, with no special broken-lamp cleanup or handoff steps. Ho Chi Minh City's rule says not to break fluorescent lamps and, if broken, to retain them safely to avoid injury and mercury release during sorting, collection, and treatment. It gives no cleanup procedure or ward-level address/time/schedule, and does not establish universal collection-point acceptance for broken lamps.

The server limits request bodies and does not retain or log submitted descriptions or photos. Photos are sent to Google's Gemini service for recognition; do not submit sensitive images. Rule lookup is an anonymous public Sanity query. The API does not persist user cases. `app/knowledge-base.json` contains curated Vietnamese excerpts indexed to the exact source title, URL, citation, and required amendment/effective-date reference. Sanity remains the sole authority for instructions; a missing KB file or any source/version mismatch produces no excerpt while preserving the rule and source links.

## Vercel

Import the repository and set the Vercel project root directory to `app`. Vercel uses `server.mjs` as the Node.js server entrypoint; `vercel.json` includes the knowledge base and static assets in the server bundle.

Set `GEMINI_API_KEY` in the Vercel project’s Environment Variables. Do not commit the key. Run `vercel dev` from `app/` to verify locally, or `vercel` for a preview deployment. Do not use `vercel --prod` without production approval.
