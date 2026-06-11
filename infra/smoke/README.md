# Poppet Smoke Environment

Smoke tests read `SMOKE_ENV`, defaulting to `local`, and then look for
`infra/smoke/env/<env>.env`. Direct shell environment variables take precedence over file values.

Tracked `*.env.example` files document the expected variables. Matching `*.env` files are ignored.
