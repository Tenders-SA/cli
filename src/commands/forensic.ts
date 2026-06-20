import { Command } from 'commander';
import { TendersaClient, ForensicResource } from '@tenders-sa-org/sdk-js';
import type { TendersaClientConfig } from '@tenders-sa-org/sdk-js';

import { getConfig } from '../config';
import { type Column, type JsonOption, formatMeta, formatTable, handleError, renderJson } from '../utils';

function makeForensic(): ForensicResource {
  const config: TendersaClientConfig = { apiKey: getConfig().apiKey };
  return new ForensicResource(new TendersaClient(config));
}

export function registerForensicCommands(program: Command): void {
  const fore = program.command('forensic').description('Forensic and restricted supplier operations');

  fore
    .command('suppliers')
    .option('--page <page>', 'Page number', '1')
    .option('--limit <limit>', 'Items per page', '20')
    .option('--json', 'Output as JSON')
    .description('List restricted suppliers')
    .action(async (options) => {
      const api = makeForensic();
      try {
        const result = await api.listRestrictedSuppliers({ page: Number(options.page), limit: Number(options.limit) });
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        const SUP_COLUMNS: Column[] = [
          { header: 'ID', key: 'id', width: 24 },
          { header: 'Name', key: 'supplierName', width: 40 },
          { header: 'Status', key: 'restrictionStatus', width: 16 },
        ];
        console.log(formatTable(result.data as unknown as Record<string, unknown>[], SUP_COLUMNS));
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });

  fore
    .command('check <company-name>')
    .option('--json', 'Output as JSON')
    .description('Check if a company is a restricted supplier')
    .action(async (name: string, options) => {
      const api = makeForensic();
      try {
        const result = await api.checkRestrictedSupplier({ name });
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        const r = result.data;
        const matchName = r.match?.supplierName;
        console.log(`Company:         ${matchName ?? name}`);
        console.log(`Restricted:      ${r.restricted ? 'YES' : 'No'}`);
        if (r.match?.status) console.log(`Status:          ${r.match.status}`);
        if (r.match?.restrictionType) console.log(`Type:            ${r.match.restrictionType}`);
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });
}
