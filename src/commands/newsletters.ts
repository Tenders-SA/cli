import { Command } from 'commander';
import { TendersaClient, NewslettersResource } from '@tenders-sa-org/sdk-js';
import type { TendersaClientConfig } from '@tenders-sa-org/sdk-js';

import { getConfig } from '../config';
import { type Column, type JsonOption, formatMeta, formatTable, handleError, renderJson } from '../utils';

function makeNewsletters(): NewslettersResource {
  const config: TendersaClientConfig = { apiKey: getConfig().apiKey };
  return new NewslettersResource(new TendersaClient(config));
}

export function registerNewslettersCommands(program: Command): void {
  const news = program.command('newsletters').description('Newsletter operations');

  news
    .command('list')
    .option('--page <page>', 'Page number', '1')
    .option('--limit <limit>', 'Items per page', '20')
    .option('--json', 'Output as JSON')
    .description('List newsletter editions')
    .action(async (options) => {
      const api = makeNewsletters();
      try {
        const result = await api.list({ page: Number(options.page), limit: Number(options.limit) });
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        const NL_COLUMNS: Column[] = [
          { header: 'ID', key: 'id', width: 24 },
          { header: 'Title', key: 'title', width: 50 },
          { header: 'Date', key: 'publishedDate', width: 14 },
        ];
        console.log(formatTable(result.data as unknown as Record<string, unknown>[], NL_COLUMNS));
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });

  news
    .command('get <edition-id>')
    .option('--json', 'Output as JSON')
    .description('Get newsletter edition details')
    .action(async (editionId: string, options) => {
      const api = makeNewsletters();
      try {
        const result = await api.get(editionId);
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        const e = result.data;
        console.log(`Title:   ${e.title ?? ''}`);
        console.log(`Date:    ${e.publishedAt ?? ''}`);
        console.log(`Edition: ${e.editionNumber ?? ''}`);
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });
}
