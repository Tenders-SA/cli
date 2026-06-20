# @tenders-sa-org/cli

Official CLI for the [Tenders-SA Developer API v2](https://tenders-sa.org/developers) — South African public procurement data at your terminal.

---

## Quick Start

```bash
npm install -g @tenders-sa-org/cli

# Configure your API key
tendersa config set tsa_prod_your_key

# List open tenders in Western Cape
tendersa tenders list --province "Western Cape"

# Get tender details
tendersa tenders get tender_001

# AI-powered search
tendersa tenders search "road construction"

# Get company intelligence profile
tendersa companies get "BuildCorp SA" --json | jq '.data'

# Check if a supplier is restricted
tendersa forensic check "Acme Corp"

# Check API health
tendersa meta status
```

---

## Commands

### Config

```
tendersa config set <api-key>     Save API key to ~/.tendersa/config.json
tendersa config get                Show current API key (masked)
```

### Tenders (14 subcommands)

| Command | Description |
|---------|-------------|
| `list` | List tenders (status, province, category, page, limit) |
| `get <id>` | Get tender details with awards |
| `search <query>` | AI-powered semantic search |
| `closing-soon` | Tenders closing soon |
| `new` | Newly published tenders |
| `bbbee` | Tenders with B-BBEE requirements |
| `by-province <province>` | Tenders in a specific province |
| `by-category <category>` | Tenders in a specific category |
| `counts` | Tender counts by province, category, status |
| `documents <id>` | Tender documents |
| `analysis <id>` | AI-generated analysis |
| `value-estimate <id>` | Estimated value range |
| `timeline <id>` | Tender timeline events |
| `awards <id>` | Awards for a tender |

### Awards (5 subcommands)

| Command | Description |
|---------|-------------|
| `list` | List awards (status, province, supplier, enterprise-type, bee-level, min-amount, max-amount) |
| `get <id>` | Award details |
| `analytics` | Award analytics (group-by, from, to) |
| `by-supplier <name>` | Awards by supplier name |
| `by-tender <id>` | Awards by tender ID |

### Companies (6 subcommands)

| Command | Description |
|---------|-------------|
| `get <name>` | Company profile (by exact name) |
| `search <query>` | Search companies (enterprise-type, bee-level, province, category) |
| `top` | Top companies by award value |
| `by-registration <reg>` | Company by registration number |
| `awards <name>` | Company award history |
| `directors <name>` | Company directors |

### Meta (3 subcommands)

| Command | Description |
|---------|-------------|
| `status` | API health, version, entity counts |
| `usage` | Daily and monthly usage |
| `industries` | Industry benchmarks |

### Categories (2 subcommands)

| Command | Description |
|---------|-------------|
| `list` | All tender categories with counts |
| `get <id>` | Category details |

### Provinces (3 subcommands)

| Command | Description |
|---------|-------------|
| `list` | All provinces with tender counts |
| `get <slug>` | Province details |
| `health <slug>` | Province health scores |

### Directors (3 subcommands)

| Command | Description |
|---------|-------------|
| `search <query>` | Search directors |
| `get <id>` | Director details |
| `by-organization <org-id>` | Directors by organization |

### SEO (4 subcommands)

| Command | Description |
|---------|-------------|
| `category <slug>` | SEO data for a category page |
| `province <slug>` | SEO data for a province page |
| `articles` | List articles |
| `article <id>` | Article details |

### Industry (2 subcommands)

| Command | Description |
|---------|-------------|
| `benchmarks` | Industry benchmarks |
| `get <id>` | Benchmark details |

### Services (2 subcommands)

| Command | Description |
|---------|-------------|
| `list` | All service types |
| `get <slug>` | Service type details |

### OCDS (2 subcommands)

| Command | Description |
|---------|-------------|
| `parties` | OCDS parties |
| `party <id>` | OCDS party details |

### Intel (2 subcommands)

| Command | Description |
|---------|-------------|
| `sources` | Intelligence sources |
| `items` | Intelligence items (--source) |

### Forensic (2 subcommands)

| Command | Description |
|---------|-------------|
| `suppliers` | List restricted suppliers |
| `check <name>` | Check if a company is restricted |

### CIPC (2 subcommands)

| Command | Description |
|---------|-------------|
| `enrichments` | CIPC company enrichments |
| `directors` | CIPC directors |

### Newsletters (2 subcommands)

| Command | Description |
|---------|-------------|
| `list` | Newsletter editions |
| `get <id>` | Edition details |

### Documents (2 subcommands)

| Command | Description |
|---------|-------------|
| `get <id>` | Document details |
| `url <id>` | Document download URL |

---

## Output Format

By default, list commands render as formatted tables, and detail commands render as key-value pairs. Add `--json` to any command for machine-readable JSON output:

```bash
tendersa tenders list --province Gauteng --json | jq '.data[].title'
tendersa companies get "BuildCorp SA" --json | jq '.data.profile'
```

---

## Configuration

API key stored at `~/.tendersa/config.json`:

```json
{ "apiKey": "tsa_prod_your_key" }
```

---

## Links

- [Platform](https://www.tenders-sa.org)
- [Developer Portal](https://tenders-sa.org/developers)
- [API Docs](https://tenders-sa.org/developers/docs)
- [GitHub](https://github.com/Tenders-SA/cli)
- [License](LICENSE)

---

## License

MIT
