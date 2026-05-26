import { Command } from 'commander';
import { TendersaClient, AwardsResource, type AwardListParams } from '@tendersa/sdk';
import type { TendersaClientConfig } from '@tendersa/sdk';

import { getConfig } from '../config';
import { type Column, formatMeta, formatTable } from '../utils';

function makeAwards(): AwardsResource {
  const config: TendersaClientConfig = { apiKey: getConfig().apiKey };
  return new AwardsResource(new TendersaClient(config));
}

const AWARD_COLUMNS: Column[] = [
  { header: 'ID', key: 'awardId', width: 24 },
  { header: 'Title', key: 'title', width: 50 },
  { header: 'Supplier', key: 'supplierName', width: 30 },
  { header: 'Amount', key: 'amount', width: 14 },
  { header: 'Status', key: 'status', width: 12 },
];

export function registerAwardsCommands(program: Command): void {
  const awards = program.command('awards').description('Award operations');

  awards
    .command('list')
    .option('-s, --status <status>', 'Filter by status')
    .option('-p, --province <province>', 'Filter by province')
    .option('--page <page>', 'Page number', '1')
    .option('--limit <limit>', 'Items per page', '20')
    .description('List awards')
    .action(async (options) => {
      const api = makeAwards();
      try {
        const params: AwardListParams = {};
        if (options.status) params.status = options.status;
        if (options.province) params.province = options.province;
        params.page = Number(options.page);
        params.limit = Number(options.limit);

        const result = await api.list(params);
        if (result.data.length === 0) {
          console.log('No awards found');
          return;
        }
        console.log(formatTable(result.data as unknown as Record<string, unknown>[], AWARD_COLUMNS));
        console.log(formatMeta(result.meta));
      } catch (err) {
        console.error(err instanceof Error ? err.message : String(err));
        process.exit(1);
      }
    });

  awards
    .command('get <award-id>')
    .description('Get award details')
    .action(async (awardId: string) => {
      const api = makeAwards();
      try {
        const result = await api.get(awardId);
        const award = result.data;
        console.log(`ID:       ${award.awardId}`);
        console.log(`Title:    ${award.title ?? ''}`);
        console.log(`Supplier: ${award.supplierName ?? ''}`);
        console.log(`Amount:   R ${(award.amount ?? 0).toLocaleString()}`);
        console.log(`Status:   ${award.status ?? ''}`);
        console.log(`Date:     ${award.awardDate ?? ''}`);
      } catch (err) {
        console.error(err instanceof Error ? err.message : String(err));
        process.exit(1);
      }
    });
}
