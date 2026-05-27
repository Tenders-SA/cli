# @tenders-sa-org/cli — Agent Instructions

**Path**: `api-sdk-packages/cli/` | **Published**: [npm](https://npmjs.com/package/@tenders-sa-org/cli) | **Repo**: [github.com/Tenders-SA/cli](https://github.com/Tenders-SA/cli)

## What It Is
CLI tool wrapping `@tenders-sa-org/sdk-js` with Commander.js. Access all 19+ API endpoints from the terminal.

## Quick Start
```bash
npm install
npm run build        # tsup: esm (node target), banner shebang, bundled
npm test             # vitest (tests/utils.test.ts)
npm version patch && npm publish   # manual publish (NO semantic-release)
```

## Key Files
| File | Purpose |
|------|---------|
| `src/cli.ts` | Main entry: Commander program, `tendersa` bin name |
| `src/commands/*.ts` | `tenders tenders`, `awards`, `companies`, `meta` subcommands |
| `src/config.ts` | API key config storage (`~/.tendersa/config.json`) |
| `src/utils.ts` | Shared formatting utilities |

## Architecture Notes
- **Wraps sdk-js** — update `@tenders-sa-org/sdk-js` first, bump CLI separately
- **bin**: `tendersa` → `dist/cli.js` (must NOT have `./` prefix)
- **Shebang**: added via tsup `banner: { js: "#!/usr/bin/env node" }`
- **Pre-action hook**: checks API key config before any command
- **Config file**: `~/.tendersa/config.json`
- **No semantic-release** — publish manually

## Published
- v0.1.0 → v0.1.1 → v0.1.2 (bin entry fix, shebang fix)
