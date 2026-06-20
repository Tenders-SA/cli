import { Command } from 'commander';
import { TendersaClient, TendersResource } from '@tenders-sa-org/sdk-js';
import type { TendersaClientConfig, TenderListParams, TenderSearchParams } from '@tenders-sa-org/sdk-js';

import chalk from 'chalk';
import { getConfig } from '../config';
import { type Column, type JsonOption, formatMeta, formatTable, handleError, renderJson } from '../utils';

function makeTenders(): TendersResource {
  const config: TendersaClientConfig = { apiKey: getConfig().apiKey };
  return new TendersResource(new TendersaClient(config));
}

function listOptions(cmd: Command): Command {
  return cmd
    .option('-s, --status <status>', 'Filter by status')
    .option('-p, --province <province>', 'Filter by province')
    .option('-c, --category <category>', 'Filter by category')
    .option('--page <page>', 'Page number', '1')
    .option('--limit <limit>', 'Items per page', '20')
    .option('--json', 'Output as JSON');
}

const TENDER_COLUMNS: Column[] = [
  { header: 'ID', key: 'tenderId', width: 24 },
  { header: 'Title', key: 'title', width: 50 },
  { header: 'Province', key: 'province', width: 18 },
  { header: 'Status', key: 'status', width: 12 },
  { header: 'Closing', key: 'closingDate', width: 20 },
];

function buildListParams(options: Record<string, unknown>): TenderListParams {
  const params: TenderListParams = {};
  if (options.status) params.status = options.status as 'active' | 'awarded' | 'cancelled' | 'closed';
  if (options.province) params.province = options.province as string;
  if (options.category) params.category = options.category as string;
  params.page = Number(options.page);
  params.limit = Number(options.limit);
  return params;
}

function renderListResult<T extends Record<string, unknown>>(result: { data: T[]; meta: { requestId: string; timestamp: string; apiVersion?: string; page?: number; totalCount?: number } }, columns: Column[], jsonFlag: boolean): void {
  if (jsonFlag) {
    console.log(renderJson(result.data, result.meta));
    return;
  }
  if (result.data.length === 0) {
    console.log('No results found');
    return;
  }
  console.log(formatTable(result.data, columns));
  console.log(formatMeta(result.meta));
}

export function registerTendersCommands(program: Command): void {
  const tenders = program.command('tenders').description('Tender operations');

  listOptions(tenders
    .command('list')
    .description('List tenders'))
    .action(async (options) => {
      const api = makeTenders();
      try {
        const result = await api.list(buildListParams(options));
        renderListResult(result as never, TENDER_COLUMNS, !!(options as JsonOption).json);
      } catch (err) { handleError(err); }
    });

  tenders
    .command('get <tender-id>')
    .option('--json', 'Output as JSON')
    .description('Get tender details')
    .action(async (tenderId: string, options) => {
      const api = makeTenders();
      try {
        const result = await api.get(tenderId);
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        const t = result.data;
        console.log(`Title:        ${t.title ?? ''}`);
        console.log(`ID:           ${t.tenderId}`);
        console.log(`Status:       ${t.status ?? ''}`);
        console.log(`Province:     ${t.province ?? ''}`);
        console.log(`Closing:      ${t.closingDate ?? ''}`);
        console.log(`Description:  ${t.description ?? ''}`);
        console.log(`Category:     ${t.category ?? ''}`);
        console.log(`Org:          ${t.sourceOrganization ?? ''}`);
        console.log(`Ref:          ${t.referenceNumber ?? ''}`);
        if (t.publicationDate) console.log(`Published:    ${t.publicationDate}`);
        if (t.aiSummary) console.log(`AI Summary:   ${t.aiSummary}`);
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });

  tenders
    .command('search <query>')
    .option('-p, --province <province>', 'Filter by province')
    .option('-c, --category <category>', 'Filter by category')
    .option('--page <page>', 'Page number', '1')
    .option('--limit <limit>', 'Items per page', '20')
    .option('--json', 'Output as JSON')
    .description('Search tenders')
    .action(async (query: string, options) => {
      const api = makeTenders();
      try {
        const params: TenderSearchParams = {
          q: query,
          page: Number(options.page),
          limit: Number(options.limit),
        };
        if (options.province) params.category = options.province as string;
        if (options.category) params.category = options.category as string;
        const result = await api.search(params);
        renderListResult(result as never, TENDER_COLUMNS, !!(options as JsonOption).json);
      } catch (err) { handleError(err); }
    });

  tenders
    .command('closing-soon')
    .option('-p, --province <province>', 'Filter by province')
    .option('--page <page>', 'Page number', '1')
    .option('--limit <limit>', 'Items per page', '20')
    .option('--json', 'Output as JSON')
    .description('List tenders closing soon')
    .action(async (options) => {
      const api = makeTenders();
      try {
        const result = await api.closingSoon(buildListParams(options));
        renderListResult(result as never, TENDER_COLUMNS, !!(options as JsonOption).json);
      } catch (err) { handleError(err); }
    });

  tenders
    .command('new')
    .option('-p, --province <province>', 'Filter by province')
    .option('--page <page>', 'Page number', '1')
    .option('--limit <limit>', 'Items per page', '20')
    .option('--json', 'Output as JSON')
    .description('List newly published tenders')
    .action(async (options) => {
      const api = makeTenders();
      try {
        const result = await api.newTenders(buildListParams(options));
        renderListResult(result as never, TENDER_COLUMNS, !!(options as JsonOption).json);
      } catch (err) { handleError(err); }
    });

  tenders
    .command('bbbee')
    .option('-p, --province <province>', 'Filter by province')
    .option('--page <page>', 'Page number', '1')
    .option('--limit <limit>', 'Items per page', '20')
    .option('--json', 'Output as JSON')
    .description('List tenders with B-BBEE requirements')
    .action(async (options) => {
      const api = makeTenders();
      try {
        const result = await api.bbbeeRequired(buildListParams(options));
        renderListResult(result as never, TENDER_COLUMNS, !!(options as JsonOption).json);
      } catch (err) { handleError(err); }
    });

  tenders
    .command('by-province <province>')
    .option('--page <page>', 'Page number', '1')
    .option('--limit <limit>', 'Items per page', '20')
    .option('--json', 'Output as JSON')
    .description('List tenders by province')
    .action(async (province: string, options) => {
      const api = makeTenders();
      try {
        const result = await api.byProvince(province, buildListParams(options));
        renderListResult(result as never, TENDER_COLUMNS, !!(options as JsonOption).json);
      } catch (err) { handleError(err); }
    });

  tenders
    .command('by-category <category>')
    .option('--page <page>', 'Page number', '1')
    .option('--limit <limit>', 'Items per page', '20')
    .option('--json', 'Output as JSON')
    .description('List tenders by category')
    .action(async (category: string, options) => {
      const api = makeTenders();
      try {
        const result = await api.byCategory(category, buildListParams(options));
        renderListResult(result as never, TENDER_COLUMNS, !!(options as JsonOption).json);
      } catch (err) { handleError(err); }
    });

  tenders
    .command('counts')
    .option('--json', 'Output as JSON')
    .description('Show tender counts (province, category, status)')
    .action(async (options) => {
      const api = makeTenders();
      try {
        const [province, category, status] = await Promise.all([
          api.countsByProvince(),
          api.countsByCategory(),
          api.countsByStatus(),
        ]);
        if ((options as JsonOption).json) {
          console.log(renderJson({ province: province.data, category: category.data, status: status.data }));
          return;
        }
        console.log(chalk.bold('\nBy Province:'));
        console.log(formatTable(province.data as unknown as Record<string, unknown>[], [
          { header: 'Province', key: 'name', width: 30 },
          { header: 'Count', key: 'count', width: 10 },
        ]));
        console.log(chalk.bold('\nBy Category:'));
        console.log(formatTable(category.data as unknown as Record<string, unknown>[], [
          { header: 'Category', key: 'name', width: 50 },
          { header: 'Count', key: 'count', width: 10 },
        ]));
        console.log(chalk.bold('\nBy Status:'));
        console.log(formatTable(status.data as unknown as Record<string, unknown>[], [
          { header: 'Status', key: 'name', width: 20 },
          { header: 'Count', key: 'count', width: 10 },
        ]));
      } catch (err) { handleError(err); }
    });

  tenders
    .command('documents <tender-id>')
    .option('--json', 'Output as JSON')
    .description('List tender documents')
    .action(async (tenderId: string, options) => {
      const api = makeTenders();
      try {
        const result = await api.documents(tenderId);
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        const DOC_COLUMNS: Column[] = [
          { header: 'ID', key: 'documentId', width: 24 },
          { header: 'File Name', key: 'fileName', width: 50 },
          { header: 'Size', key: 'fileSize', width: 10 },
        ];
        console.log(formatTable(result.data as unknown as Record<string, unknown>[], DOC_COLUMNS));
      } catch (err) { handleError(err); }
    });

  tenders
    .command('analysis <tender-id>')
    .option('--json', 'Output as JSON')
    .description('Get AI analysis for a tender')
    .action(async (tenderId: string, options) => {
      const api = makeTenders();
      try {
        const result = await api.analysis(tenderId);
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        const analysis = result.data;
        console.log(`Quality Score:  ${analysis.qualityScore ?? 'N/A'}`);
        console.log(`Confidence:     ${analysis.confidence ?? 'N/A'}`);
        if (analysis.evaluationCriteria) {
          console.log('Evaluation Criteria:');
          console.log(JSON.stringify(analysis.evaluationCriteria, null, 2));
        }
        if (analysis.submissionGuidelines) {
          console.log('Submission Guidelines:');
          console.log(JSON.stringify(analysis.submissionGuidelines, null, 2));
        }
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });

  tenders
    .command('value-estimate <tender-id>')
    .option('--json', 'Output as JSON')
    .description('Get value estimate for a tender')
    .action(async (tenderId: string, options) => {
      const api = makeTenders();
      try {
        const result = await api.valueEstimate(tenderId);
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        const ve = result.data;
        console.log(`Estimated Min:    R ${(ve.estimatedMin ?? 0).toLocaleString()}`);
        console.log(`Estimated Max:    R ${(ve.estimatedMax ?? 0).toLocaleString()}`);
        console.log(`Estimated Median: R ${(ve.estimatedMedian ?? 0).toLocaleString()}`);
        console.log(`Confidence:       ${(ve.confidenceScore ?? 0) * 100}%`);
        console.log(`Methodology:      ${ve.methodology ?? 'N/A'}`);
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });

  tenders
    .command('timeline <tender-id>')
    .option('--json', 'Output as JSON')
    .description('Get tender timeline events')
    .action(async (tenderId: string, options) => {
      const api = makeTenders();
      try {
        const result = await api.timeline(tenderId);
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        const TIMELINE_COLUMNS: Column[] = [
          { header: 'Event', key: 'eventType', width: 30 },
          { header: 'Date', key: 'eventDate', width: 20 },
          { header: 'Description', key: 'description', width: 50 },
        ];
        console.log(formatTable(result.data as unknown as Record<string, unknown>[], TIMELINE_COLUMNS));
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });

  tenders
    .command('awards <tender-id>')
    .option('--page <page>', 'Page number', '1')
    .option('--limit <limit>', 'Items per page', '20')
    .option('--json', 'Output as JSON')
    .description('List awards for a tender')
    .action(async (tenderId: string, options) => {
      const api = makeTenders();
      try {
        const result = await api.awards(tenderId);
        const AWARD_COLUMNS: Column[] = [
          { header: 'ID', key: 'awardId', width: 24 },
          { header: 'Supplier', key: 'supplierName', width: 30 },
          { header: 'Amount', key: 'amount', width: 14 },
          { header: 'Status', key: 'status', width: 12 },
        ];
        renderListResult(result as never, AWARD_COLUMNS, !!(options as JsonOption).json);
      } catch (err) { handleError(err); }
    });
}
