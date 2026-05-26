# @tendersa/cli

Official CLI for the [Tenders-SA Developer API](https://tenders-sa.org/developers) — South African public procurement data at your terminal.

## Installation

```bash
npm install -g @tendersa/cli
```

Or run directly:

```bash
npx @tendersa/cli tenders list
```

## Quick Start

```bash
# Configure your API key
tendersa config set tsa_prod_your_key

# Check API status
tendersa meta status

# List tenders
tendersa tenders list --status OPEN --province "Western Cape"

# Get tender details
tendersa tenders get tender_001

# Search
tendersa tenders search "road construction"

# List awards
tendersa awards list --limit 50

# Get company profile
tendersa companies get "BuildCorp SA"

# Check usage
tendersa meta usage
```

## Commands

### Config

| Command | Description |
|---------|-------------|
| `config get` | Show current API key (masked) |
| `config set <key>` | Save API key to `~/.tendersa/config.json` |

### Tenders

| Command | Description |
|---------|-------------|
| `tenders list [options]` | List tenders with filters |
| `tenders get <id>` | Get tender details |
| `tenders search <query>` | Search tenders |
| `tenders documents <id>` | List tender documents |
| `tenders analysis <id>` | Get AI analysis |
| `tenders value-estimate <id>` | Get value estimate |

### Awards

| Command | Description |
|---------|-------------|
| `awards list [options]` | List awards |
| `awards get <id>` | Get award details |

### Companies

| Command | Description |
|---------|-------------|
| `companies get <name>` | Get company profile by exact name |
| `companies search <query>` | Search companies |

### Meta

| Command | Description |
|---------|-------------|
| `meta status` | Check API health |
| `meta provinces` | Tender counts by province |
| `meta categories` | Tender counts by category |
| `meta usage` | API usage statistics |

### Options

- `--page <n>` — Page number (default: 1)
- `--limit <n>` — Items per page (default: 20)
- `--status <s>` — Filter by status (OPEN, CLOSED, etc.)
- `--province <p>` — Filter by province
- `--category <c>` — Filter by category

## License

MIT
