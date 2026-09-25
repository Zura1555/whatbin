# WhatBin server

Run from the repository root with Node.js:

```sh
node app/server.mjs
```

The server listens on port `3000`; set `PORT` to use another port. Recognition uses Gemini 3.6 Flash. Set `GEMINI_API_KEY` in the server environment; the key is used only server-side, and recognition returns HTTP 503 if it is not configured.

Run the deterministic rule-selection test from the repository root with `node --test app/server.test.mjs`.

## API

- `POST /api/recognize` accepts JSON with at least one of a description and image: `{"description":"an old mattress"}`, `{"description":"an intact used AA battery"}`, `{"image":{"mimeType":"image/jpeg","base64":"…"}}`, or `{"description":"an old mattress","image":{"mimeType":"image/jpeg","base64":"…"}}`. If both are supplied, recognition considers both. Supported image types are JPEG, PNG, and WebP. Recognition proposes only old mattresses or clearly identified, discarded, intact household-size AA/AAA batteries; vehicle/industrial batteries, device-installed packs, damaged/leaking cells, and unsupported or uncertain items are rejected. Gemini's structured response must meet the confidence and format checks; confirm the candidate before resolving it. Uncertain items return `candidate: null`.
- `POST /api/resolve` accepts `{"jurisdiction":"hanoi","canonicalItemId":"old-mattress","confirmed":true}` or `{"jurisdiction":"hanoi","canonicalItemId":"used-household-battery","confirmed":true}`. The old-mattress Sanity document IDs `old-mattress-hanoi` and `old-mattress-ho-chi-minh-city`, and battery rule IDs `used-household-battery-hanoi` and `used-household-battery-ho-chi-minh-city`, are distinct from their respective shared `canonicalItemId` values. Jurisdictions are `hanoi` and `ho-chi-minh-city`. It queries published Sanity rules in project `xqeddep2`, dataset `production`, and applies effective dates using the selected city's local date. Results are `MATCHED`, `UNKNOWN`, or `CONFLICT`; unknown/conflicting rules do not include actionable instructions.

The server limits request bodies and does not retain or log submitted descriptions or photos. Photos are sent to Google's Gemini service for recognition; do not submit sensitive images. Rule lookup is an anonymous public Sanity query. The API does not persist user cases. `app/knowledge-base.json` contains curated Vietnamese excerpts indexed to the exact source title, URL, citation, and required amendment/effective-date reference. Sanity remains the sole authority for instructions; a missing KB file or any source/version mismatch produces no excerpt while preserving the rule and source links.

## Vercel

Import the repository and set the Vercel project root directory to `app`. Vercel uses `server.mjs` as the Node.js server entrypoint; `vercel.json` includes the knowledge base and static assets in the server bundle.

Set `GEMINI_API_KEY` in the Vercel project’s Environment Variables. Do not commit the key. Run `vercel dev` from `app/` to verify locally, or `vercel` for a preview deployment. Do not use `vercel --prod` without production approval.
