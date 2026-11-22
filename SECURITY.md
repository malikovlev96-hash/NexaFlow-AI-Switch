# Security Policy

## Reporting a vulnerability

Please do not report security vulnerabilities in public issues. Contact the repository owner privately through the GitHub profile: https://github.com/malikovlev96-hash

Include a description, impact, safe reproduction steps, affected version, and possible mitigation. Never include real API keys, passwords, tokens, or personal data.

## API key handling

- Keep provider keys out of source control.
- Use local secret storage or environment variables where available.
- Redact credentials from logs and screenshots.
- Rotate exposed credentials immediately.
- Use provider-side spending limits and least-privilege keys.

This policy does not imply that every integration or build has undergone a security audit.
