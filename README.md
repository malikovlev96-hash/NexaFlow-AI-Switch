<div align="center">

# ⚡ NexaFlow AI Switch

### Your AI providers. One smart routing workspace.

Configure models, connect supported providers, and use fallback workflows through a desktop bundle and mobile companion app.

[🚀 Get the desktop bundle](NexaFlow-Desktop-Mobile-1.0.0.zip) · [📘 Russian guide](INSTALLATION-RU.md) · [📗 English guide](INSTALLATION.md) · [🐛 Report a bug](https://github.com/malikovlev96-hash/NexaFlow-AI-Switch/issues)

![GitHub repo size](https://img.shields.io/github/repo-size/malikovlev96-hash/NexaFlow-AI-Switch?style=for-the-badge&color=6C5CE7) ![GitHub last commit](https://img.shields.io/github/last-commit/malikovlev96-hash/NexaFlow-AI-Switch?style=for-the-badge) ![GitHub issues](https://img.shields.io/github/issues/malikovlev96-hash/NexaFlow-AI-Switch?style=for-the-badge)

</div>

---

## ✨ What is NexaFlow?

NexaFlow AI Switch is a configurable AI routing project. It brings provider setup, model selection, and supported fallback workflows into a single project bundle.

| Component | What it is for |
|---|---|
| **Windows launcher** | Opens the web companion, the Claude Desktop extension installer, and local checks. |
| **Claude Desktop MCPB** | Installs the bundled MCP extension in Claude Desktop. |
| **Mobile PWA** | Browser-based companion for the OpenRouter model catalog and chat. |

## 🚀 Install in 3 steps

1. **[Download the ZIP](NexaFlow-Desktop-Mobile-1.0.0.zip)** from this repository.
2. Extract the complete ZIP archive. Do not run files from inside the ZIP preview.
3. Open the extracted `nexaflow_bundle` folder and double-click `START-NEXAFLOW.cmd`.

Choose an action in the launcher:

| Menu | Action |
|---|---|
| `1` | Starts the local mobile/desktop web interface. Requires Python 3 for the local web server. |
| `2` | Opens `NexaFlow-AI-Switch-Pro-1.6.0.mcpb` to install the Claude Desktop extension. |
| `3` | Opens the mobile installation guide. |
| `4` | Checks whether the main files and Python are present. |
| `0` | Exits. |

For screenshots-free, step-by-step instructions, see **[INSTALLATION.md](INSTALLATION.md)** or **[инструкцию на русском](INSTALLATION-RU.md)**.

## 📱 Android and iPhone

The `mobile` folder is a Progressive Web App (PWA), not a native APK or IPA. Publish the bundle contents to an HTTPS static host while preserving the `mobile/` and `assets/` paths. Then open the hosted mobile page:

- **Android:** open the HTTPS page in Chrome → browser menu → **Install app** or **Add to Home screen**.
- **iPhone:** open the HTTPS page in Safari → **Share** → **Add to Home Screen**.

Full details: [mobile guide](nexaflow_bundle/mobile/INSTALL-MOBILE.txt) (inside the ZIP).

## 🔐 API keys and privacy

- Never commit API keys, `.env` files, passwords, or private configuration.
- Do not post API keys in issues, screenshots, or chat messages.
- The mobile PWA stores its OpenRouter key in that browser’s `localStorage` and sends requests directly to OpenRouter. Use it only on a trusted personal device.
- The mobile PWA is a separate companion client. It does not connect to Claude Desktop’s local MCP process or automatically share its saved settings.
- Use provider-side spending limits. “Free” model listings do not guarantee quota, availability, or unlimited use.

## ⚙️ Important limitations

NexaFlow does not silently replace Claude’s own internal model. Routing and fallback apply only to requests that are sent through NexaFlow’s supported MCP/API workflow. Provider compatibility, model access, pricing, quotas, and rate limits depend on each provider and may change.

## 🧰 Troubleshooting

**The launcher says files are missing**
- Extract the whole ZIP archive first.
- Run `START-NEXAFLOW.cmd` from inside the extracted `nexaflow_bundle` folder. Do not move the CMD file away from the other folders.

**The web app does not open or the page cannot be reached**
- Install Python 3 and ensure the `py` launcher or `python` command is available.
- Run the launcher again and choose option `1`.

**The `.mcpb` file does not open**
- Open Claude Desktop and use its extension installation flow, then select `NexaFlow-AI-Switch-Pro-1.6.0.mcpb` from the extracted bundle.
- Make sure Claude Desktop is installed and up to date.

**401 / Unauthorized**
- Confirm the API key belongs to the selected provider and is active.
- Check the provider’s required authentication format and account access.
- Never share the key when requesting support; redact it from logs.

## 🤝 Contributing

Bug reports and tested improvements are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) first. Please state exactly which provider and environment you tested.

## 📄 License

No license has been added yet. Until the repository owner publishes one, reuse and redistribution are not automatically permitted.

<div align="center">

**Built to make multi-provider AI workflows easier to manage.**

</div>
