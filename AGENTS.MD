# @tenders-sa-org/cli — Agent Instructions

**Path**: `api-sdk-packages/cli/` | **Published**: [npm](https://npmjs.com/package/@tenders-sa-org/cli) | **Repo**: [github.com/Tenders-SA/cli](https://github.com/Tenders-SA/cli)

## What It Is
CLI tool wrapping `@tenders-sa-org/sdk-js` with Commander.js. Access all 90+ v2 API endpoints from the terminal across 16 resource groups.

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
| `src/commands/tenders.ts` | 14 tender subcommands (list, get, search, closing-soon, new, bbbee, by-province, by-category, counts, documents, analysis, value-estimate, timeline, awards) |
| `src/commands/awards.ts` | 5 award subcommands (list, get, analytics, by-supplier, by-tender) |
| `src/commands/companies.ts` | 6 company subcommands (get, search, top, by-registration, awards, directors) |
| `src/commands/meta.ts` | 3 meta subcommands (status, usage, industries) |
| `src/commands/categories.ts` | 2 category subcommands (list, get) |
| `src/commands/provinces.ts` | 3 province subcommands (list, get, health) |
| `src/commands/directors.ts` | 3 director subcommands (search, get, by-organization) |
| `src/commands/seo.ts` | 4 SEO subcommands (category, province, articles, article) |
| `src/commands/industry.ts` | 2 industry subcommands (benchmarks, get) |
| `src/commands/services.ts` | 2 service subcommands (list, get) |
| `src/commands/ocds.ts` | 2 OCDS subcommands (parties, party) |
| `src/commands/intel.ts` | 2 intelligence subcommands (sources, items) |
| `src/commands/forensic.ts` | 2 forensic subcommands (suppliers, check) |
| `src/commands/cipc.ts` | 2 CIPC subcommands (enrichments, directors) |
| `src/commands/newsletters.ts` | 2 newsletter subcommands (list, get) |
| `src/commands/documents.ts` | 2 document subcommands (get, url) |
| `src/config.ts` | API key config storage (`~/.tendersa/config.json`) |
| `src/utils.ts` | Shared formatting utilities (formatTable, formatMeta, formatError, renderJson, handleError) |

## Architecture Notes
- **Wraps sdk-js v0.2.0** — uses local `file:../js` dependency for development; tsup bundles everything into a single ESM file on build
- **16 resource groups** — all v2 API endpoints exposed via `tendersa <resource> <command>`
- **--json flag** — every command supports `--json` for machine-readable JSON output (default is human-readable tables/key-value)
- **bin**: `tendersa` → `dist/cli.js` (must NOT have `./` prefix)
- **Shebang**: added via tsup `banner: { js: "#!/usr/bin/env node" }`
- **Pre-action hook**: checks API key config before any command
- **Config file**: `~/.tendersa/config.json`
- **No semantic-release** — publish manually

## Published
- v0.2.0-pre.0 (current) — v2 API: 16 resource groups, 50+ subcommands, `--json` flag on all commands, human-readable tables by default
- v0.1.0 → v0.1.1 → v0.1.2 (bin entry fix, shebang fix)
