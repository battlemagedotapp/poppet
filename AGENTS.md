# Strawdev Poppet

## Documentation Sources

Use these sources first when working on this repository:

1. Local library README:
   `node_modules/<library-name>/README.md`

   Start with the README shipped inside the installed library package. Local
   package documentation should be checked first because it matches the
   dependency version currently installed in `node_modules`.

2. Web documentation:
   Use the official web documentation for the library or framework being used.

   Web documentation should be used for deeper guides, examples, API details,
   and behavior that is not fully explained in the local package README.

## Project Stack

- React
- TypeScript
- Vite
- TanStack Router
- Tailwind CSS
- Vitest
- oxlint / oxfmt

## Verification

Use two tiers:

- During implementation, prefer `CI=1 pnpm run verify` for fast feedback.
- Before considering the task complete, run `CI=1 pnpm run verify:full`.
- If you are already in the final implementation phase and would run `verify:full` immediately after
  `verify`, skip the redundant fast verification and run only `CI=1 pnpm run verify:full`.
- **Use Workspace Scripts**: Always use the defined `pnpm` scripts in `package.json` (such as `pnpm run lintfix`, `pnpm run lint`, or `pnpm run verify:full`) for all verification, formatting, and linting tasks. Do not construct or run raw CLI commands manually when workspace scripts are already provided.

Do not run generation or verification commands in parallel in this repo.
