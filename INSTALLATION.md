# Install NexaFlow AI Switch on Windows

This guide matches the current repository layout. Download files from [GitHub Releases](https://github.com/malikovlev96-hash/NexaFlow-AI-Switch/releases/latest), not the old 1.0.0 archive in the repository history.

## What to download

From the latest published release, download:

- `NexaFlow-AI-Switch-1.7.0-source.zip` — launcher, PWA, source and documentation.
- `NexaFlow-AI-Switch-1.7.0.mcpb` — Claude Desktop extension package.

If no release is published yet, use **Code → Download ZIP** on the repository page. You can build the MCPB from source with `BUILD-MCPB.cmd`.

## 1. Extract the project

1. Find the ZIP in your Downloads folder.
2. Right-click it and select **Extract All…**.
3. Open the extracted folder.
4. Keep `START-NEXAFLOW.cmd`, `desktop/`, `mobile/`, `assets/` and `server/` together.

## 2. Run the web companion on Windows

1. Install Python 3 from [python.org/downloads](https://www.python.org/downloads/). Enable **Add Python to PATH** if the installer offers it.
2. Double-click `START-NEXAFLOW.cmd`.
3. Enter `1` and press Enter.
4. Wait for the readiness check. Your browser opens `http://127.0.0.1:8765/`.
5. To stop the local server, open the launcher again and choose `2`.

Choose option `4` to diagnose Python and port 8765.

## 3. Install the Claude Desktop MCP extension

**Option A — prebuilt package**

1. Download `NexaFlow-AI-Switch-1.7.0.mcpb` from Releases.
2. Open Claude Desktop. If double-clicking the file does not open the installer, use the extension installation screen available in your Claude Desktop version.
3. Select the `.mcpb` file and confirm installation.
4. Open extension settings and add an API key for at least one provider.
5. Restart Claude Desktop if prompted.

**Option B — build it yourself**

1. Install Python 3.
2. Double-click `BUILD-MCPB.cmd` in the extracted project folder.
3. After successful verification, the package is created at `dist/NexaFlow-AI-Switch-1.7.0.mcpb`.
4. Open that file with Claude Desktop and confirm installation.

## 4. Configure a provider

NexaFlow does not issue API keys or include paid model access. Create a key with your chosen provider and paste it into the matching sensitive field in Claude Desktop extension settings.

Start with one provider and test it using `autoswitch_test_provider`. Model access, free quotas, regional availability and pricing are controlled by the provider and your account.

See [provider setup](docs/PROVIDERS-RU.md) for official links.

## 5. Install the PWA on a phone

The mobile companion is an installable website, **not a native APK or IPA**.

1. Host the project root over HTTPS, preserving the `mobile/` and `assets/` folders.
2. Open the hosted URL ending in `/mobile/`.
3. **Android:** Chrome menu → **Install app** / **Add to Home screen**.
4. **iPhone:** Safari Share → **Add to Home Screen**.

The PWA uses OpenRouter only. It does not connect to the Claude Desktop MCP process or sync keys/history with it.

## Security

- Never publish API keys in GitHub, screenshots or bug reports.
- Do not use the PWA on shared/public devices.
- The PWA stores its key in browser `sessionStorage` for the current session; history and favorites remain in local browser storage.
- Providers may charge for API requests. Monitor your own usage and limits.

## Troubleshooting

| Problem | What to check |
|---|---|
| Python not found | Install Python 3 and enable PATH integration. |
| 127.0.0.1 page unavailable | Run launcher option 4 and check whether port 8765 is free. |
| 401 | Verify the API key and selected provider. |
| 403 | Check key permissions, plan, region and model access. |
| 404 / Model not found | Verify the exact model ID in the provider dashboard. |
| 429 | Check rate limits/quota and retry later. |
| MCPB will not open | Install it from the extension screen available in your Claude Desktop version. |

When asking for help, include the NexaFlow version, Windows/Claude Desktop version and error text. Replace all secrets with `[REDACTED]`.
