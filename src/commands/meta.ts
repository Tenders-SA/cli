import { Command } from 'commander';
import { TendersaClient, MetaResource } from '@tenders-sa-org/sdk-js';
import type { TendersaClientConfig } from '@tenders-sa-org/sdk-js';

import chalk from 'chalk';
import { getConfig } from '../config';
import { type Column, type JsonOption, formatTable, handleError, renderJson } from '../utils';

function makeMeta(): MetaResource {
  const config: TendersaClientConfig = { apiKey: getConfig().apiKey };
  return new MetaResource(new TendersaClient(config));
}

export function registerMetaCommands(program: Command): void {
  const meta = program.command('meta').description('API metadata and status');

  meta
    .command('status')
    .option('--json', 'Output as JSON')
    .description('Check API status')
    .action(async (options) => {
      const api = makeMeta();
      try {
        const result = await api.status();
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        const s = result.data;
        console.log(chalk.bold(`API: ${s.healthy ? chalk.green('Healthy') : chalk.red('Unhealthy')}`));
        console.log(`Version:    ${s.version}`);
        console.log(`Timestamp:  ${s.timestamp ?? 'N/A'}`);
        if (s.entities) console.log(`Entities:   ${JSON.stringify(s.entities)}`);
        if (s.cron) console.log(`Cron:       ${JSON.stringify(s.cron)}`);
      } catch (err) { handleError(err); }
    });

  meta
    .command('usage')
    .option('--json', 'Output as JSON')
    .description('Check API usage stats')
    .action(async (options) => {
      const api = makeMeta();
      try {
        const result = await api.usage();
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        const usage = result.data;
        console.log(`Daily:   ${usage.daily} / ${usage.limit?.daily ?? 'N/A'}`);
        console.log(`Monthly: ${usage.monthly} / ${usage.limit?.monthly ?? 'N/A'}`);
      } catch (err) { handleError(err); }
    });

  meta
    .command('industries')
    .option('--json', 'Output as JSON')
    .description('List industry benchmarks')
    .action(async (options) => {
      const api = makeMeta();
      try {
        const result = await api.industries();
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        const INDUSTRY_COLUMNS: Column[] = [
          { header: 'ID', key: 'id', width: 24 },
          { header: 'Industry', key: 'industryName', width: 40 },
          { header: 'Sample', key: 'sampleSize', width: 8 },
          { header: 'Median Value', key: 'medianValue', width: 16 },
        ];
        console.log(formatTable(result.data as unknown as Record<string, unknown>[], INDUSTRY_COLUMNS));
      } catch (err) { handleError(err); }
    });
}
