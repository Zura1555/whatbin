# WhatBin

The WhatBin context describes household items and the local guidance used to decide how they should be disposed of.

## Language

**Jurisdiction**:
A geographic authority whose local rules govern disposal.

**Bulky waste**:
English label for the legally defined category of large discarded items (`chất thải rắn cồng kềnh`); the seed rules explicitly include mattresses.

**Canonical item**:
A normalized identity for a household item, used to match it to a disposal rule.
_Avoid_: raw model label

**Disposal rule**:
A reviewed instruction for a canonical item within a jurisdiction and effective period.

**Evidence passage**:
An exact excerpt from a current official source linked to the rule by source title, URL, citation, and version; it supports the rule but is not itself an instruction.

**Rule explanation**:
A resident-facing account of one or more deterministic disposal outcomes, grounded in the applicable rules and evidence; it cannot create or change an actionable instruction.

**Binding rule source**:
A current, in-force legal instrument that establishes the disposal decision for an item and jurisdiction.

**Agency clarification**:
Current official operational guidance that adds handling or collection detail but cannot establish or contradict the disposal rule.

**Research evidence gap**:
A source-research attempt failed to confirm a current, non-conflicting basis for a draft; it does not prove that no disposal route exists.

**Clarification**:
A bounded answer about a missing fact that could change which disposal rule applies.

**Unknown**:
The outcome when no reviewed rule applies to the item, jurisdiction, and date; it gives no actionable instruction.

**Conflict**:
The outcome when a reviewer publishes a separate record of unresolved disagreement among authoritative sources, or multiple published rules apply at once; the conflict takes precedence over a matching rule and gives no actionable instruction.
