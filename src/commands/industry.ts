import { Command } from 'commander';
import { TendersaClient, IndustryResource } from '@tenders-sa-org/sdk-js';
import type { TendersaClientConfig } from '@tenders-sa-org/sdk-js';

import { getConfig } from '../config';
import { type Column, type JsonOption, formatMeta, formatTable, handleError, renderJson } from '../utils';

function makeIndustry(): IndustryResource {
  const config: TendersaClientConfig = { apiKey: getConfig().apiKey };
  return new IndustryResource(new TendersaClient(config));
}

export function registerIndustryCommands(program: Command): void {
  const ind = program.command('industry').description('Industry benchmark operations');

  ind
    .command('benchmarks')
    .option('--json', 'Output as JSON')
    .description('List industry benchmarks')
    .action(async (options) => {
      const api = makeIndustry();
      try {
        const result = await api.list();
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        const BENCH_COLUMNS: Column[] = [
          { header: 'ID', key: 'id', width: 24 },
          { header: 'Industry', key: 'industryName', width: 40 },
          { header: 'Sample', key: 'sampleSize', width: 8 },
          { header: 'Median Value', key: 'medianValue', width: 16 },
        ];
        console.log(formatTable(result.data as unknown as Record<string, unknown>[], BENCH_COLUMNS));
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });

  ind
    .command('get <benchmark-id>')
    .option('--json', 'Output as JSON')
    .description('Get benchmark details')
    .action(async (benchmarkId: string, options) => {
      const api = makeIndustry();
      try {
        const result = await api.get(benchmarkId);
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        console.log(JSON.stringify(result.data, null, 2));
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });
}
