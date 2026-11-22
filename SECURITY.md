# Security policy

- Never commit API keys, access tokens, account IDs that grant access, or `.env` files.
- Rotate any key accidentally exposed in a repository, log, screenshot, or chat.
- The MCP extension receives keys through Claude Desktop's sensitive `user_config` fields. Diagnostic tools intentionally return only configured/not-configured status.
- The PWA stores the OpenRouter key in sessionStorage and calls OpenRouter directly from the browser. Use only a trusted device and HTTPS hosting.
- Do not use this PWA on shared/public devices. Clear browser session and local site data when retiring a device.
- Report security issues privately to the repository maintainer; do not publish active credentials in an issue.
