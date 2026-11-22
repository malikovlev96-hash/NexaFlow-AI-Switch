# Contributing

Thanks for your interest in NexaFlow AI Switch.

## Ways to contribute

- Report reproducible bugs.
- Improve setup and troubleshooting documentation.
- Add or improve provider adapters.
- Add tests for routing and fallback behavior.
- Improve accessibility, reliability, and user experience.

## Before opening an issue

1. Search existing issues.
2. Include the build version and operating system.
3. Describe expected and actual behavior.
4. Include sanitized logs and exact error messages.
5. Never include API keys, tokens, passwords, or private account data.

## Pull requests

1. Keep changes focused and explain why they are needed.
2. Avoid committing generated files, local settings, or secrets.
3. Add or update tests for behavior changes.
4. Update documentation when setup or provider behavior changes.
5. State which providers and environments you actually tested.

## Provider adapter checklist

- Document the official endpoint and authentication method.
- Validate model IDs and request/response formats.
- Handle timeouts, rate limits, quota errors, and invalid credentials.
- Redact secrets from all errors and logs.
- Include a test plan that does not expose real credentials.
