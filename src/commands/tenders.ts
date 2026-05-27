import { Command } from 'commander';
import { TendersaClient, TendersResource, type TenderListParams } from '@tenders-sa-org/sdk-js';
import type { TendersaClientConfig } from '@tenders-sa-org/sdk-js';

import { getConfig } from '../config';
import { type Column, formatMeta, formatTable } from '../utils';

function makeTenders(): TendersResource {
  const config: TendersaClientConfig = { apiKey: getConfig().apiKey };
  return new TendersResource(new TendersaClient(config));
}

const TENDER_COLUMNS: Column[] = [
  { header: 'ID', key: 'tenderId', width: 24 },
  { header: 'Title', key: 'title', width: 50 },
  { header: 'Province', key: 'province', width: 18 },
  { header: 'Status', key: 'status', width: 12 },
  { header: 'Closing', key: 'closingDate', width: 20 },
];

export function registerTendersCommands(program: Command): void {
  const tenders = program.command('tenders').description('Tender operations');

  tenders
    .command('list')
    .option('-s, --status <status>', 'Filter by status')
    .option('-p, --province <province>', 'Filter by province')
    .option('-c, --category <category>', 'Filter by category')
    .option('--page <page>', 'Page number', '1')
    .option('--limit <limit>', 'Items per page', '20')
    .description('List tenders')
    .action(async (options) => {
      const api = makeTenders();
      try {
        const params: TenderListParams = {};
        if (options.status) params.status = options.status;
        if (options.province) params.province = options.province;
        if (options.category) params.category = options.category;
        params.page = Number(options.page);
        params.limit = Number(options.limit);

        const result = await api.list(params);
        if (result.data.length === 0) {
          console.log('No tenders found');
          return;
        }
        console.log(formatTable(result.data as unknown as Record<string, unknown>[], TENDER_COLUMNS));
        console.log(formatMeta(result.meta));
      } catch (err) {
        console.error(err instanceof Error ? err.message : String(err));
        process.exit(1);
      }
    });

  tenders
    .command('get <tender-id>')
    .description('Get tender details')
    .action(async (tenderId: string) => {
      const api = makeTenders();
      try {
        const result = await api.get(tenderId);
        const t = result.data;
        console.log(`Title:        ${t.title ?? ''}`);
        console.log(`ID:           ${t.tenderId}`);
        console.log(`Status:       ${t.status ?? ''}`);
        console.log(`Province:     ${t.province ?? ''}`);
        console.log(`Closing:      ${t.closingDate ?? ''}`);
        console.log(`Description:  ${t.description ?? ''}`);
        if (t.aiSummary) console.log(`AI Summary:   ${t.aiSummary}`);
      } catch (err) {
        console.error(err instanceof Error ? err.message : String(err));
        process.exit(1);
      }
    });

  tenders
    .command('search <query>')
    .option('-p, --province <province>', 'Filter by province')
    .description('Search tenders')
    .action(async (query: string, options) => {
      const api = makeTenders();
      try {
        const params: Record<string, string | number> = { q: query };
        if (options.province) params.province = options.province;

        const result = await api.search(params as never);
        if (result.data.length === 0) {
          console.log('No matching tenders found');
          return;
        }
        console.log(formatTable(result.data as unknown as Record<string, unknown>[], TENDER_COLUMNS));
        console.log(formatMeta(result.meta));
      } catch (err) {
        console.error(err instanceof Error ? err.message : String(err));
        process.exit(1);
      }
    });

  tenders
    .command('documents <tender-id>')
    .description('List tender documents')
    .action(async (tenderId: string) => {
      const api = makeTenders();
      try {
        const docs = await api.documents(tenderId);
        const DOC_COLUMNS: Column[] = [
          { header: 'ID', key: 'documentId', width: 24 },
          { header: 'File Name', key: 'fileName', width: 50 },
          { header: 'Size', key: 'fileSize', width: 10 },
        ];
        console.log(formatTable(docs.data as unknown as Record<string, unknown>[], DOC_COLUMNS));
      } catch (err) {
        console.error(err instanceof Error ? err.message : String(err));
        process.exit(1);
      }
    });

  tenders
    .command('analysis <tender-id>')
    .description('Get AI analysis for a tender')
    .action(async (tenderId: string) => {
      const api = makeTenders();
      try {
        const result = await api.analysis(tenderId);
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
      } catch (err) {
        console.error(err instanceof Error ? err.message : String(err));
        process.exit(1);
      }
    });

  tenders
    .command('value-estimate <tender-id>')
    .description('Get value estimate for a tender')
    .action(async (tenderId: string) => {
      const api = makeTenders();
      try {
        const result = await api.valueEstimate(tenderId);
        const ve = result.data;
        console.log(`Estimated Min:    R ${(ve.estimatedMin ?? 0).toLocaleString()}`);
        console.log(`Estimated Max:    R ${(ve.estimatedMax ?? 0).toLocaleString()}`);
        console.log(`Estimated Median: R ${(ve.estimatedMedian ?? 0).toLocaleString()}`);
        console.log(`Confidence:       ${(ve.confidenceScore ?? 0) * 100}%`);
        console.log(`Methodology:      ${ve.methodology ?? 'N/A'}`);
      } catch (err) {
        console.error(err instanceof Error ? err.message : String(err));
        process.exit(1);
      }
    });
}
