import { Command } from 'commander';
import { TendersaClient, AwardsResource } from '@tenders-sa-org/sdk-js';
import type { TendersaClientConfig, AwardListParams } from '@tenders-sa-org/sdk-js';

import { getConfig } from '../config';
import { type Column, type JsonOption, formatMeta, formatTable, handleError, renderJson } from '../utils';

function makeAwards(): AwardsResource {
  const config: TendersaClientConfig = { apiKey: getConfig().apiKey };
  return new AwardsResource(new TendersaClient(config));
}

const AWARD_COLUMNS: Column[] = [
  { header: 'ID', key: 'awardId', width: 24 },
  { header: 'Title', key: 'title', width: 45 },
  { header: 'Supplier', key: 'supplierName', width: 28 },
  { header: 'Amount', key: 'amount', width: 14 },
  { header: 'Status', key: 'status', width: 12 },
];

function buildAwardParams(options: Record<string, unknown>): AwardListParams {
  const params: AwardListParams = {};
  if (options.status) params.status = options.status as string;
  if (options.province) params.province = options.province as string;
  if (options.supplier) params.supplierName = options.supplier as string;
  if (options.enterpriseType) params.enterpriseType = options.enterpriseType as 'EME' | 'QSE' | 'Large';
  if (options.beeLevel) params.beeLevel = options.beeLevel as string;
  if (options.minAmount) params.minAmount = Number(options.minAmount);
  if (options.maxAmount) params.maxAmount = Number(options.maxAmount);
  params.page = Number(options.page);
  params.limit = Number(options.limit);
  return params;
}

export function registerAwardsCommands(program: Command): void {
  const awards = program.command('awards').description('Award operations');

  awards
    .command('list')
    .option('-s, --status <status>', 'Filter by status')
    .option('-p, --province <province>', 'Filter by province')
    .option('--supplier <name>', 'Filter by supplier name')
    .option('--enterprise-type <type>', 'Filter by enterprise type')
    .option('--bee-level <level>', 'Filter by B-BBEE level')
    .option('--min-amount <number>', 'Minimum award amount')
    .option('--max-amount <number>', 'Maximum award amount')
    .option('--page <page>', 'Page number', '1')
    .option('--limit <limit>', 'Items per page', '20')
    .option('--json', 'Output as JSON')
    .description('List awards')
    .action(async (options) => {
      const api = makeAwards();
      try {
        const result = await api.list(buildAwardParams(options));
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        if (result.data.length === 0) {
          console.log('No awards found');
          return;
        }
        console.log(formatTable(result.data as unknown as Record<string, unknown>[], AWARD_COLUMNS));
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });

  awards
    .command('get <award-id>')
    .option('--json', 'Output as JSON')
    .description('Get award details')
    .action(async (awardId: string, options) => {
      const api = makeAwards();
      try {
        const result = await api.get(awardId);
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        const a = result.data;
        console.log(`ID:       ${a.awardId}`);
        console.log(`Title:    ${a.title ?? ''}`);
        console.log(`Supplier: ${a.supplierName ?? ''}`);
        console.log(`Amount:   R ${(a.amount ?? 0).toLocaleString()}`);
        console.log(`Status:   ${a.status ?? ''}`);
        console.log(`Date:     ${a.awardDate ?? ''}`);
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });

  awards
    .command('analytics')
    .option('--group-by <field>', 'Group by (enterpriseType, beeLevel, province, category)')
    .option('--from <date>', 'Start date (YYYY-MM-DD)')
    .option('--to <date>', 'End date (YYYY-MM-DD)')
    .option('--json', 'Output as JSON')
    .description('Get award analytics')
    .action(async (options) => {
      const api = makeAwards();
      try {
        const result = await api.analytics({
          groupBy: options.groupBy,
          from: options.from,
          to: options.to,
        });
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        const ANALYTICS_COLUMNS: Column[] = [
          { header: 'Group', key: (options.groupBy ?? 'period'), width: 22 },
          { header: 'Awards', key: 'totalAwards', width: 8 },
          { header: 'Total Value', key: 'totalValue', width: 16 },
          { header: 'Avg Value', key: 'avgValue', width: 16 },
        ];
        console.log(formatTable(result.data as unknown as Record<string, unknown>[], ANALYTICS_COLUMNS));
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });

  awards
    .command('by-supplier <name>')
    .option('--page <page>', 'Page number', '1')
    .option('--limit <limit>', 'Items per page', '20')
    .option('--json', 'Output as JSON')
    .description('List awards by supplier name')
    .action(async (name: string, options) => {
      const api = makeAwards();
      try {
        const result = await api.bySupplier(name, buildAwardParams(options));
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        console.log(formatTable(result.data as unknown as Record<string, unknown>[], AWARD_COLUMNS));
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });

  awards
    .command('by-tender <tender-id>')
    .option('--page <page>', 'Page number', '1')
    .option('--limit <limit>', 'Items per page', '20')
    .option('--json', 'Output as JSON')
    .description('List awards by tender ID')
    .action(async (tenderId: string, options) => {
      const api = makeAwards();
      try {
        const result = await api.byTender(tenderId, buildAwardParams(options));
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        console.log(formatTable(result.data as unknown as Record<string, unknown>[], AWARD_COLUMNS));
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });
}
