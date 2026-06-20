import { Command } from 'commander';
import { TendersaClient, CipcResource } from '@tenders-sa-org/sdk-js';
import type { TendersaClientConfig } from '@tenders-sa-org/sdk-js';

import { getConfig } from '../config';
import { type Column, type JsonOption, formatMeta, formatTable, handleError, renderJson } from '../utils';

function makeCipc(): CipcResource {
  const config: TendersaClientConfig = { apiKey: getConfig().apiKey };
  return new CipcResource(new TendersaClient(config));
}

export function registerCipcCommands(program: Command): void {
  const cipc = program.command('cipc').description('CIPC company registry operations');

  cipc
    .command('enrichments')
    .option('--page <page>', 'Page number', '1')
    .option('--limit <limit>', 'Items per page', '20')
    .option('--json', 'Output as JSON')
    .description('List CIPC enrichments')
    .action(async (options) => {
      const api = makeCipc();
      try {
        const result = await api.listEnrichments({ page: Number(options.page), limit: Number(options.limit) });
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        const ENR_COLUMNS: Column[] = [
          { header: 'ID', key: 'id', width: 24 },
          { header: 'Company', key: 'companyName', width: 40 },
          { header: 'Status', key: 'status', width: 16 },
        ];
        console.log(formatTable(result.data as unknown as Record<string, unknown>[], ENR_COLUMNS));
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });

  cipc
    .command('directors')
    .option('--page <page>', 'Page number', '1')
    .option('--limit <limit>', 'Items per page', '20')
    .option('--json', 'Output as JSON')
    .description('List CIPC directors')
    .action(async (options) => {
      const api = makeCipc();
      try {
        const result = await api.listDirectors({ page: Number(options.page), limit: Number(options.limit) });
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        const DIR_COLUMNS: Column[] = [
          { header: 'ID', key: 'id', width: 24 },
          { header: 'Name', key: 'name', width: 35 },
          { header: 'Company', key: 'companyName', width: 35 },
        ];
        console.log(formatTable(result.data as unknown as Record<string, unknown>[], DIR_COLUMNS));
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });
}
