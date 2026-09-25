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
An excerpt from an official source that supports a disposal rule; it is not itself a disposal instruction.

**Clarification**:
A bounded answer about a missing fact that could change which disposal rule applies.

**Unknown**:
The outcome when no reviewed rule applies to the item, jurisdiction, and date; it gives no actionable instruction.

**Conflict**:
The outcome when applicable authoritative sources disagree or multiple published rules apply at once.
