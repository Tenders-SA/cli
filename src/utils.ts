import chalk from 'chalk';

export interface Column {
  header: string;
  key: string;
  width: number;
}

export function formatTable(rows: Record<string, unknown>[], columns: Column[]): string {
  const lines: string[] = [];

  const header = columns.map((c) => c.header.padEnd(c.width)).join(' ');
  lines.push(chalk.bold(header));
  lines.push(columns.map((c) => '─'.repeat(c.width)).join(' '));

  for (const row of rows) {
    const line = columns.map((c) => {
      const val = String(row[c.key] ?? '');
      return val.length > c.width ? val.slice(0, c.width - 1) + '…' : val.padEnd(c.width);
    }).join(' ');
    lines.push(line);
  }

  return lines.join('\n');
}

export function formatMeta(meta: { requestId: string; timestamp: string; page?: number; totalCount?: number; apiVersion?: string }): string {
  const parts = [
    chalk.dim(`req: ${meta.requestId}`),
    chalk.dim(`v${meta.apiVersion ?? '?'}`),
  ];
  if (meta.page !== undefined && meta.totalCount !== undefined) {
    parts.push(chalk.dim(`total: ${meta.totalCount}`));
  }
  return parts.join(' · ');
}

export function formatError(err: unknown): string {
  if (err instanceof Error) {
    return chalk.red(err.message);
  }
  return chalk.red(String(err));
}
