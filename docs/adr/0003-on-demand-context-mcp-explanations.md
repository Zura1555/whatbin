# On-demand explanations use read-only Sanity Context MCP

## Status

Accepted

## Decision

Resolve the selected item and city deterministically before offering the optional explanation UI. Published structured rules remain the only action authority. An active reviewer-published `disposalConflict` record overrides a matching rule; overlapping active rules also produce `CONFLICT`. Explanations cannot create, change, or recommend an action. `UNKNOWN` means WhatBin lacks a reviewed rule, not that no legal route exists. Compare cities only when both independently resolve `MATCHED` for the same canonical item.

Use one Sanity Context Knowledge Base containing published rules, the official source documents cited by those rules, and published conflict records. Exclude drafts and unpublished research. The server connects to Sanity Context over HTTPS with `@ai-sdk/mcp` and streams Gemini `gemini-3.6-flash` explanations through the AI SDK's `streamText` and `@ai-sdk/google`. MCP tools remain read-only; configure an organization-level Context Viewer token. The app does not publish or write Sanity content.

Keep chat history in the browser page only and send a bounded history with each explicit follow-up. The app does not persist or log questions or chat history. If Gemini, Context, or the Knowledge Base is unavailable, preserve the deterministic result and return no explanation.

## Consequences

The rule resolver remains independently usable when the explainer is unavailable. `CONFLICT` records are review data, not advice. The Knowledge Base endpoint, published corpus, organization token, and Gemini key require deployment configuration; dashboard configuration must be verified separately.
