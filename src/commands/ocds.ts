import { Command } from 'commander';
import { TendersaClient, OcdsResource } from '@tenders-sa-org/sdk-js';
import type { TendersaClientConfig } from '@tenders-sa-org/sdk-js';

import { getConfig } from '../config';
import { type Column, type JsonOption, formatMeta, formatTable, handleError, renderJson } from '../utils';

function makeOcds(): OcdsResource {
  const config: TendersaClientConfig = { apiKey: getConfig().apiKey };
  return new OcdsResource(new TendersaClient(config));
}

export function registerOcdsCommands(program: Command): void {
  const ocds = program.command('ocds').description('OCDS party operations');

  ocds
    .command('parties')
    .option('--page <page>', 'Page number', '1')
    .option('--limit <limit>', 'Items per page', '20')
    .option('--json', 'Output as JSON')
    .description('List OCDS parties')
    .action(async (options) => {
      const api = makeOcds();
      try {
        const result = await api.listParties({ page: Number(options.page), limit: Number(options.limit) });
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        const PARTY_COLUMNS: Column[] = [
          { header: 'ID', key: 'partyId', width: 24 },
          { header: 'Name', key: 'name', width: 50 },
        ];
        console.log(formatTable(result.data as unknown as Record<string, unknown>[], PARTY_COLUMNS));
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });

  ocds
    .command('party <party-id>')
    .option('--json', 'Output as JSON')
    .description('Get OCDS party details')
    .action(async (partyId: string, options) => {
      const api = makeOcds();
      try {
        const result = await api.getParty(partyId);
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        console.log(JSON.stringify(result.data, null, 2));
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });
}
