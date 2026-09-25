# WhatBin — Phase 1 Product Specification

## Scope

- Primary user: a household resident deciding how to dispose of an item locally.
- Initial jurisdictions: Ho Chi Minh City and Hanoi. Expand only after verifying each jurisdiction's current official rules.
- Demo item: an old mattress, treated as bulky waste.
- Guidance is city-wide for phase one. Do not invent or display ward-specific drop-off addresses, pickup contacts, fees, or hours. Tell users to confirm those details with their local ward or an authorized collector.
- Hackathon UI language: English. Link the original Vietnamese source and label any English translation as a translation, not official wording.

## Decision and evidence boundary

- Sanity structured rules determine the disposal action.
- The Knowledge Base supplies supporting official-source passages; it cannot override a structured rule. Each rule stores its governing source references and effective dates. Show a retrieved passage only when it matches the rule's cited source and version.
- Resolve against published rules active on the selected city's local date. `validFrom` is inclusive; `validUntil`, when present, is exclusive. Ignore drafts and future or expired rules. Disagreement between authoritative sources or overlapping active rules is `CONFLICT`; no active rule is `UNKNOWN`.
- Return explicit outcomes: `MATCHED`, `CLARIFICATION_REQUIRED`, `UNKNOWN`, or `CONFLICT`. Withhold actionable advice for `UNKNOWN` and `CONFLICT`.
- Invoke Jev only when a rule identifies a missing fact that could change its outcome. Jev may return only a bounded structured fact; the resolver runs again, and Jev never chooses the disposal action.
- Do not invoke Jev on the deterministic mattress path. Do not substitute generic advice for an item without a reviewed local rule.

## Runtime architecture

- The browser sends the selected city and item input to one thin server endpoint. The endpoint reads published Sanity rules only; no user account is required, and drafts remain inaccessible to the public response.
- Hosted image recognition proposes a canonical item for user confirmation before rule lookup. If recognition is uncertain or unsupported, let the user correct or describe the item; never silently choose the closest rule.
- Keep model credentials on the server. Do not retain or log user photos. Disclose external image processing.
- If the Knowledge Base is unavailable but a valid rule is available, show the rule and its direct source link without an excerpt. If rule resolution fails, or Jev is unavailable when clarification is required, withhold the action.
- Do not persist user cases for `UNKNOWN` or `CONFLICT` in Phase 1. Show the status to the user; the content owner reviews coverage through Sanity.

## Content review

- The independent reviewer subagent passed the source, current-applicability, and effective-date spot-check on 2026-09-24. The content owner approved publication; both rules were published to the public `production` dataset on 2026-09-24.

## Sanity mattress rules

- `old-mattress-hanoi`: bulky waste; agree on paid service handover with a collection/transport/treatment provider, or self-deliver to the commune/ward collection point during its locally specified period at no charge. Confirm the exact address and period locally.
- `old-mattress-ho-chi-minh-city`: bulky waste; reduce/dismantle to fit collection vehicles, then separate reusable/recyclable parts. If unable to reduce it at the point of generation and using the collection/transport unit's service, agree that service cost with the unit; confirm handoff details locally.
- Both instructions are English summaries, not official translations. Neither rule states an unverified location, schedule, or fee.

## First vertical slice

1. Reviewed, independently spot-checked, and published the two source-backed old-mattress rules on 2026-09-24.
2. Let the user select a city, submit item input, and confirm the recognized item before resolution.
3. Show the selected city's instruction, effective date, direct source link, and matching supporting passage when available.
4. Switch cities and verify that the instruction and evidence change appropriately.

## Seed sources

- Hanoi: [Decision 87/2025/QĐ-UBND PDF](https://datafiles.hanoi.gov.vn/gov-hni/6249/VanBan/2025/12/30/QDPQ-87-2025.pdf) and [official city record](https://cmshn.hanoi.gov.vn/van-ban-quy-pham-phap-luat/ve-viec-quy-dinh-quan-ly-chat-thai-ran-sinh-hoat-cua-ho-gia-dinh-ca-nhan-tren-dia-ban-thanh-pho-ha--231176), effective January 8, 2026; Articles 5(3)(a), 6(5), and 7(2)(c).
- Ho Chi Minh City: [Decision 36/2024/QĐ-UBND](https://congbao.hochiminhcity.gov.vn/cong-bao/van-ban/quyet-dinh/so/36-2024-qd-ubnd/ngay/26-06-2024/noi-dung/46704) is partially in force. [Decision 2736/QĐ-UBND](https://congbao.hochiminhcity.gov.vn/cong-bao/van-ban/quyet-dinh/so/2736-qd-ubnd/ngay/14-11-2025/noi-dung/48890/48893), effective November 14, 2025, removes Clause 4 of Article 5 and part of Article 8(2)(a) concerning local collection-point arrangements.
- Mattress classification: [Circular 02/2022/TT-BTNMT](https://congbao.chinhphu.vn/van-ban/thong-tu-so-02-2022-tt-btnmt-36691.htm), Article 3(4), includes discarded mattresses in the bulky-waste definition. Its reviewed 2025 and 2026 amendments do not change that definition.

These sources do not establish a current ward-specific drop-off address, schedule, or fee. Do not infer those details from provisions removed by Decision 2736.
