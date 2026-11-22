# 📦 NexaFlow AI Switch installation (Windows)

This guide is for `NexaFlow-Desktop-Mobile-1.0.0.zip`.

## 1. Download and extract

1. Open the [NexaFlow repository](https://github.com/malikovlev96-hash/NexaFlow-AI-Switch).
2. Download `NexaFlow-Desktop-Mobile-1.0.0.zip`.
3. In Windows File Explorer, right-click the ZIP and choose **Extract All…**.
4. Open the extracted `nexaflow_bundle` folder.

You should see `START-NEXAFLOW.cmd`, `NexaFlow-AI-Switch-Pro-1.6.0.mcpb`, `mobile/`, and `assets/`.

**Keep these files and folders together. Do not move the CMD launcher on its own.**

## 2. Run the web companion on Windows

1. Install Python 3 for Windows if it is not already installed: [python.org/downloads](https://www.python.org/downloads/).
2. Double-click `START-NEXAFLOW.cmd`.
3. Enter `1` and press Enter.
4. Your browser should open `http://127.0.0.1:8765/`.

Keep the extracted folder in place while using the local app.

## 3. Install the Claude Desktop extension

1. Install and open Claude Desktop.
2. Run `START-NEXAFLOW.cmd` from the extracted `nexaflow_bundle` folder.
3. Choose option `2`. The launcher opens `NexaFlow-AI-Switch-Pro-1.6.0.mcpb`.
4. Confirm the installation in Claude Desktop if prompted.
5. Check the extension in Claude Desktop settings and configure the provider API key.

If opening the `.mcpb` file does not launch the installer, use the extension installation screen available in your Claude Desktop version and select the `.mcpb` file manually. UI labels may vary by version.

## 4. Android and iPhone

The included mobile app is a PWA, not a native APK or IPA.

1. Publish the contents of `nexaflow_bundle` to an HTTPS static host.
2. Preserve the relative `mobile/` and `assets/` paths.
3. Open the hosted mobile page on your phone.
4. Android: Chrome menu → **Install app** / **Add to Home screen**.
5. iPhone: Safari Share → **Add to Home Screen**.

## 5. API key safety

- Never publish or share API keys.
- The mobile PWA stores its OpenRouter key in browser `localStorage`. Use a trusted personal device only.
- The mobile PWA does not sync credentials with Claude Desktop.
- Provider pricing, quotas, and model access are controlled by the provider.

## 6. Troubleshooting

| Problem | What to check |
|---|---|
| `Python not found` | Install Python 3 and enable the PATH option. |
| `127.0.0.1:8765` unavailable | Make sure the launcher and local server are still running. |
| `401 Unauthorized` | Verify the key, provider, API access, and authentication format. |
| `Model not found` | Check the exact model ID in provider documentation. |

Never include API keys in bug reports. Replace secrets with `[REDACTED]`.
