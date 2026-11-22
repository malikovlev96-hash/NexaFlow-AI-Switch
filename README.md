# NexaFlow AI Switch 1.7.0

NexaFlow is delivered as two distinct products:

1. **Claude Desktop MCP extension** (`dist/NexaFlow-AI-Switch-1.7.0.mcpb`) — an MCP tool server that routes requests only when Claude invokes its tools.
2. **Mobile/Desktop PWA companion** (`mobile/`) — a browser app using the OpenRouter API directly.

These products do **not** share credentials, history, or settings. The PWA is not a remote control for Claude Desktop and does not connect to the local MCP process.

## Requirements

- Claude Desktop with MCPB extension support.
- Node.js 18+ for building/testing the MCP source; Claude Desktop uses the packaged Node runtime as configured by MCPB.
- Python 3 on Windows only for the local static PWA preview.

## Build and test

```bash
npm test
npm run check
python tools/build_mcpb.py
python tools/verify_mcpb.py dist/NexaFlow-AI-Switch-1.7.0.mcpb
```

The MCPB is a ZIP container with `manifest.json`, `icon.png`, `server/index.js`, and `README.md`. Install it by opening the `.mcpb` file in Claude Desktop.

## Providers

The MCP server contains 18 configured provider integrations: xAI, Groq, Google Gemini, OpenRouter, Mistral, Cloudflare Workers AI, NVIDIA NIM, Cohere, SambaNova, Z.ai, OpenAI, DeepSeek, Cerebras, Together AI, Fireworks AI, Hugging Face, GitHub Models, and Perplexity.

A provider integration means an endpoint adapter is present; it does **not** guarantee current account access, free quota, availability, or compatibility with every model. Bring your own API key. Model IDs and plan availability can change. Run `autoswitch_test_provider` for a minimal live test of one configured provider, or `autoswitch_test` for all configured providers (up to four concurrent checks). Tests may consume quota.

## Model catalogue and pricing

`autoswitch_models` reads the live OpenRouter model catalogue. It returns model ID, name, context length, provider namespace, listed input/output prices, and whether both listed prices are zero. Prices are in USD per token in the API response; the mobile UI displays an equivalent per-million-token figure. `autoswitch_estimate_cost` provides an approximate estimate.

This is not a full native catalogue for every upstream provider. A universal catalogue and reliable cross-provider pricing cannot be asserted without querying each provider's authenticated account-specific model/pricing endpoints. The `autoswitch_providers` tool returns official API-key and pricing links for the 18 configured integrations.

## Failover and errors

- Authentication, permission, missing-model, and invalid-request errors (400/401/403/404/422) stop automatic failover. Fix the key, account access, or model ID first.
- Network/timeouts, 408/425, 429, and 5xx failures can trigger failover to the next configured provider.
- Transient HTTP failures may be retried once. This may still incur provider-side processing in rare cases; monitor provider usage.
- API keys are never included in status or diagnostic output.

## Windows local PWA

Run `START-NEXAFLOW.cmd`, choose **1** to start, **2** to stop, or **4** to diagnose Python/port 8765. The server binds only to `127.0.0.1`. The launcher probes the actual page before opening it, checks for a port conflict, and records its PID/logs under `%LOCALAPPDATA%\NexaFlow`.

## Mobile PWA

Host the project root on HTTPS, preserving the `mobile/` and `assets/` folders. Open `/mobile/` on Android Chrome or iOS Safari and install it to the home screen. The PWA uses OpenRouter only. Its API key is stored in `sessionStorage` for the current browser session; chat history and favorites are stored locally in browser storage. Do not use a shared device.

## Known limitations

- The MCP extension cannot intercept Claude Desktop's built-in Claude model selection, subscription limits, or internal requests. It cannot automatically switch Claude's internal model to another Claude model. It only routes explicit MCP tool calls.
- Claude Desktop owns the extension configuration UI. This project supplies provider/key/model fields through MCPB `user_config`; it cannot inject a custom first-run wizard into Claude Desktop's installer.
- PWA and MCP settings/keys/history are not synchronized. Secure cross-device sync requires an authenticated backend and user-controlled deployment.
- This release does not ship signed native Android APK or iOS IPA. The mobile client is a PWA. APK/IPA signing requires Android/iOS build pipelines and signing credentials.
- The PWA currently supports OpenRouter, not all 18 MCP providers.
- Streaming is available in the PWA for OpenRouter. MCP responses are returned as completed tool results; streaming MCP transport is not implemented here.
- Image/audio/file multimodal inputs, universal usage-cost accounting, persistent budgets, and push notifications are not implemented. Provider pricing/usage schemas vary and must not be guessed.
- No self-updater is installed. Releases are distributed as versioned MCPB/PWA bundles; use GitHub Releases or download a verified bundle manually.

## Security

Never commit API keys. Claude Desktop stores sensitive MCPB configuration values as sensitive settings. The PWA key is session-scoped and sent directly to OpenRouter over HTTPS. Review `SECURITY.md` before deployment.
