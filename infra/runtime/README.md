# Poppet Runtime

This layer is local-first and mirrors the remote-ready shape from the reference app.

Tracked files under `infra/runtime/env/*.env.example` document the expected variables. The
matching `*.env` files are ignored because they contain local secrets and deployment-specific
values.

## Environments

- `local.env` powers Docker Compose and local API development.
- `dev.env` is reserved for a future remote development runtime.
- `prod.env` is reserved for a future production runtime.

The local runtime exposes host ports in the `6200` family:

- Web: `6200`
- API: `6201`
- Postgres: `6202`
- Electric: `6203`
- Valkey: `6204`
- MinIO API: `6205`
- MinIO console: `6206`
- Meilisearch: `6207`

`DATABASE_URL`, `ELECTRIC_URL`, and `VALKEY_URL` in `local.env` are host-facing so local commands
can use them directly. Docker Compose overrides those same values for containers that need service
names on the Compose network.
