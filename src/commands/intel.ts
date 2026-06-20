import { Command } from 'commander';
import { TendersaClient, IntelligenceResource } from '@tenders-sa-org/sdk-js';
import type { TendersaClientConfig } from '@tenders-sa-org/sdk-js';

import { getConfig } from '../config';
import { type Column, type JsonOption, formatMeta, formatTable, handleError, renderJson } from '../utils';

function makeIntel(): IntelligenceResource {
  const config: TendersaClientConfig = { apiKey: getConfig().apiKey };
  return new IntelligenceResource(new TendersaClient(config));
}

export function registerIntelCommands(program: Command): void {
  const intel = program.command('intel').description('Intelligence operations');

  intel
    .command('sources')
    .option('--json', 'Output as JSON')
    .description('List intelligence sources')
    .action(async (options) => {
      const api = makeIntel();
      try {
        const result = await api.listSources();
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        const SRC_COLUMNS: Column[] = [
          { header: 'ID', key: 'id', width: 24 },
          { header: 'Name', key: 'name', width: 40 },
          { header: 'Type', key: 'sourceType', width: 20 },
        ];
        console.log(formatTable(result.data as unknown as Record<string, unknown>[], SRC_COLUMNS));
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });

  intel
    .command('items')
    .option('--source <source-id>', 'Filter by source ID')
    .option('--page <page>', 'Page number', '1')
    .option('--limit <limit>', 'Items per page', '20')
    .option('--json', 'Output as JSON')
    .description('List intelligence items')
    .action(async (options) => {
      const api = makeIntel();
      try {
        const params: Record<string, string | number | boolean | undefined | null> = {
          page: Number(options.page),
          limit: Number(options.limit),
        };
        if (options.source) params.sourceId = options.source as string;
        const result = await api.listItems(params);
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        const ITEM_COLUMNS: Column[] = [
          { header: 'ID', key: 'id', width: 24 },
          { header: 'Title', key: 'title', width: 50 },
          { header: 'Source', key: 'sourceName', width: 20 },
        ];
        console.log(formatTable(result.data as unknown as Record<string, unknown>[], ITEM_COLUMNS));
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });
}
