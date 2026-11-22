# Changelog

## 1.7.0 — 2026-11-22

- Added complete tracked MCP server source and reproducible MCPB build scripts.
- Restricted automatic provider failover to transient/network/rate-limit/server failures; authentication, authorization, missing-model and invalid-request failures no longer trigger costly provider cascades.
- Added actionable HTTP error hints for 401, 403, 404, 429, 5xx and invalid request errors.
- Added a single-provider live API-key/model test and bounded parallel provider diagnostics.
- Hardened Windows launcher with Python detection, loopback-only binding, HTTP readiness check, port conflict detection, stop action, PID and separate logs.
- Fixed local PWA asset path by serving the project root and opening `/mobile/`.
- Reworked PWA onboarding, OpenRouter key validation, session-only key storage, streaming responses, model prices, favorites, system prompt, temperature, output limit and searchable local history.
- Improved service-worker cache versioning and navigation fallback; corrected PWA icon purpose metadata.
- Added Node.js smoke tests, GitHub Actions CI, MCPB build and CRC verification scripts.
- Added Russian/English documentation and explicit product limitations.

## 1.6.0 and earlier

Previous packaged release; see Git history for earlier changes.
