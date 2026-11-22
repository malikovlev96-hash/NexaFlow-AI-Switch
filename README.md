<div align="center">

# NexaFlow AI Switch

### One interface. Multiple AI providers. Smarter model routing.

**A configurable AI routing project for connecting model providers, choosing models, and handling fallback workflows.**

[Repository](https://github.com/malikovlev96-hash/NexaFlow-AI-Switch) · [Issues](https://github.com/malikovlev96-hash/NexaFlow-AI-Switch/issues) · [Security](SECURITY.md)

![Repo size](https://img.shields.io/github/repo-size/malikovlev96-hash/NexaFlow-AI-Switch?style=flat-square) ![Last commit](https://img.shields.io/github/last-commit/malikovlev96-hash/NexaFlow-AI-Switch?style=flat-square) ![Issues](https://img.shields.io/github/issues/malikovlev96-hash/NexaFlow-AI-Switch?style=flat-square)

</div>

---

## Overview

NexaFlow AI Switch is a project for routing requests across configurable AI model providers. Its goal is to make provider configuration, model selection, and fallback workflows easier to manage from one place.

The project is oriented toward desktop workflows, MCP-compatible clients such as Claude Desktop, and a mobile-friendly web experience. Exact provider support depends on the adapter and build being used.

## Project goals

- **Multiple providers** — configure different AI API services.
- **Model selection** — choose a model that fits the task, budget, and availability.
- **Fallback workflows** — try another configured provider when a request fails, where supported.
- **Desktop integration** — provide a convenient Windows setup and launch experience.
- **MCP integration** — expose supported functionality to MCP-compatible clients.
- **Mobile access** — offer a responsive web interface for supported workflows.

> **Important:** NexaFlow does not secretly replace the model running inside Claude or another AI client. Routing and fallback apply only to requests actually sent through NexaFlow. Provider quotas, pricing, model availability, and rate limits are controlled by each provider and can change.

## Getting started

1. Review the files included in the project.
2. Download a published build from **Releases** when one is available. If no release is listed, a packaged build has not yet been published here.
3. Follow the setup instructions included with that build.
4. Add your own provider API key in the local application settings.
5. Select a supported model and test the provider connection.

### API key safety

- Never paste API keys into GitHub issues, discussions, screenshots, or source files.
- Do not commit environment files or local configuration containing secrets.
- Use keys with minimum permissions and spending limits.
- Revoke and rotate a key immediately if it is exposed.
- On shared computers, remember that browser-based builds may store settings locally.

## Compatibility and provider support

Provider compatibility is adapter-specific. Check the provider’s current API documentation, endpoint format, model identifier, authentication method, and rate limits. A model being listed as free does not guarantee quota, uptime, or unrestricted access.

## Documentation

- [Русская версия README](README-RU.md)
- [Security policy](SECURITY.md)
- [Contributing guide](CONTRIBUTING.md)

## Troubleshooting

**401 / Unauthorized**
- Check that the API key belongs to the selected provider.
- Confirm that the key is active and has access to the requested API.
- Check the authentication format required by the provider.
- Never share the key; provide only the redacted error and provider name.

**Model not found**
- Verify the exact model ID in the provider’s current documentation.
- Confirm that the model is enabled for your account and endpoint.

**Rate limit / quota errors**
- Check provider usage, billing, and rate limits. Switching models does not bypass account limits.

## Contributing

Bug reports, documentation improvements, and tested provider adapters are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## License

No license has been added yet. Until a license is published, the repository is not granted an open-source license by default. Please contact the repository owner before redistributing or reusing the code.
