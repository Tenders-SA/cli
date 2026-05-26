# @tendersa/cli

Official CLI for the [Tenders-SA Developer API](https://tenders-sa.org/developers) — South African public procurement data at your terminal.

---

## About Tenders-SA

[Tenders-SA.org](https://www.tenders-sa.org) is an **AI-powered tender matching and application platform** for South African businesses. It aggregates tenders from national, provincial, and municipal government departments, SOEs (Eskom, Transnet, SANRAL), and public entities — sourced directly from official OCDS (Open Contracting Data Standard) feeds.

The platform goes beyond simple aggregation: AI enrichment extracts key requirements, generates summaries, estimates tender values, classifies categories, and calculates compatibility scores between your company profile and each opportunity. The result is a unified intelligence layer over South Africa's fragmented public procurement landscape.

### Key Platform Features

- **Tender Discovery** — Search and filter thousands of active, closed, and awarded tenders across all provinces and categories
- **AI Enrichment** — Every tender is processed through AI pipelines for summarisation, requirement extraction, value estimation, and classification
- **Company Intelligence** — Research award histories, track supplier performance, and perform due diligence
- **Organisation Profiles** — Procurement body profiles enriched with Google and Wikidata data
- **Award Analytics** — Analyse award patterns by enterprise type, BEE level, province, and category
- **Tender Toolkit** — BBBEE Calculator, Readiness Assessment, Market Heatmap, AI Proposal Generator

### Use Cases

- **Quick Tender Checks** — Check active tenders in a province without opening a browser
- **CI/CD Integration** — Embed tender data into your internal dashboards and reporting pipelines
- **Market Monitoring** — Script periodic scans of award activity in your sector
- **Data Export** — Pipe tender data into CSV, JSON processors, or analysis tools

---

## About the Developer API

The Tenders-SA Developer API exposes enriched procurement data through a set of RESTful endpoints. It serves from a dedicated infrastructure layer with its own database, synced from the main platform, ensuring the API remains fast and available independently of the main web application.

### API Base URL

```
https://api.tenders-sa.org/v1
```

### Authentication

All requests require an API key. Keys are generated through the [Developer Portal](https://tenders-sa.org/developers/api-keys) and use the format `tsa_prod_` followed by a unique generated string.

**Access Requirements:** API access requires a [Professional or Enterprise subscription](https://tenders-sa.org/pricing).

| Plan | Max Keys | Daily Limit | Monthly Limit |
|------|----------|-------------|---------------|
| Professional | 3 | 500 | 15,000 |
| Enterprise | 25 | 10,000 | 300,000 |

---

## Installation

```bash
npm install -g @tendersa/cli
```

Or run directly without installation:

```bash
npx @tendersa/cli tenders list
```

---

## Quick Start

```bash
# Configure your API key
tendersa config set tsa_prod_your_key

# Check API health
tendersa meta status

# List open tenders in Western Cape
tendersa tenders list --status OPEN --province "Western Cape"

# Get tender details
tendersa tenders get tender_001

# AI-powered search
tendersa tenders search "road construction"

# List awards
tendersa awards list --limit 50 --province Gauteng

# Get company intelligence profile
tendersa companies get "BuildCorp SA"

# Check usage
tendersa meta usage
```

---

## Commands

### Config

```bash
tendersa config set <api-key>   # Save API key to ~/.tendersa/config.json
tendersa config get              # Show current API key (masked)
```

Your API key is stored locally in `~/.tendersa/config.json` and is required before running any data commands.

### Tenders

| Command | Description |
|---------|-------------|
| `tenders list [options]` | List tenders with filters |
| `tenders get <id>` | Get tender details with awards |
| `tenders search <query>` | AI-powered semantic search |
| `tenders documents <id>` | List tender documents |
| `tenders analysis <id>` | Get AI-generated analysis |
| `tenders value-estimate <id>` | Get estimated value range |

**List options:**

| Option | Description |
|--------|-------------|
| `--status <s>` | Filter by status: `OPEN`, `CLOSED`, `AWARDED`, `CANCELLED` |
| `--province <p>` | Filter by province (e.g. `Gauteng`, `Western Cape`) |
| `--category <c>` | Filter by category (e.g. `Construction`, `IT`) |
| `--closing-after <d>` | Closing date after (ISO 8601) |
| `--closing-before <d>` | Closing date before (ISO 8601) |
| `--min-value <n>` | Minimum estimated value |
| `--max-value <n>` | Maximum estimated value |
| `--sort <s>` | Sort field: `closingDate`, `-closingDate`, `value`, `-value` |
| `--page <n>` | Page number (default: 1) |
| `--limit <n>` | Items per page (default: 20, max: 100) |

### Awards

| Command | Description |
|---------|-------------|
| `awards list [options]` | List awards with filters |
| `awards get <id>` | Get award details |

**List options:**

| Option | Description |
|--------|-------------|
| `--supplier-name <s>` | Filter by supplier name |
| `--enterprise-type <t>` | Filter by enterprise type (e.g. `SMME`, `QSE`) |
| `--bee-level <l>` | Filter by BEE level (e.g. `Level 1`) |
| `--province <p>` | Filter by province |
| `--category <c>` | Filter by category |
| `--min-amount <n>` | Minimum award amount |
| `--max-amount <n>` | Maximum award amount |
| `--from <d>` | Award date from (ISO 8601) |
| `--to <d>` | Award date to (ISO 8601) |
| `--page <n>` | Page number (default: 1) |
| `--limit <n>` | Items per page (default: 20, max: 100) |

### Companies

| Command | Description |
|---------|-------------|
| `companies get <name>` | Get company intelligence profile (by exact name) |
| `companies search <query>` | Search companies |

The company intelligence profile includes award history, contract values, enterprise type, BEE level, and compliance data aggregated from public procurement records.

### Meta

| Command | Description |
|---------|-------------|
| `meta status` | Check API health and data freshness |
| `meta provinces` | View tender counts by province |
| `meta categories` | View tender counts by category |
| `meta usage` | View your API usage statistics |

---

## Output Format

All commands output JSON to stdout by default. You can pipe results to tools like `jq` for processing:

```bash
tendersa tenders list --status OPEN --limit 5 | jq '.data[].title'
```

Error messages and progress output go to stderr, making piping safe.

---

## Configuration

The CLI stores a single configuration file at `~/.tendersa/config.json`:

```json
{
  "apiKey": "tsa_prod_your_key"
}
```

You can manage it via the `config` command:

```bash
tendersa config set tsa_prod_your_key
tendersa config get
```

The API key is also configurable via the `TENDERSA_API_KEY` environment variable, which takes precedence over the config file.

---

## Links

- [Tenders-SA Platform](https://www.tenders-sa.org) — Main website
- [Developer Portal](https://tenders-sa.org/developers) — API keys, docs, and pricing
- [API Documentation](https://tenders-sa.org/developers/docs) — Full API reference
- [API Key Management](https://tenders-sa.org/developers/api-keys) — Create and manage keys
- [Pricing](https://tenders-sa.org/pricing) — Subscription plans
- [GitHub](https://github.com/Tenders-SA/cli) — Source code & issues
- [Support](mailto:support@tenders-sa.org) — Email support
- [Developer Contact](mailto:developers@tenders-sa.org) — API & SDK feedback

---

## License

MIT
