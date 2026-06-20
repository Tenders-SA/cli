import { Command } from 'commander';
import { TendersaClient, CategoriesResource } from '@tenders-sa-org/sdk-js';
import type { TendersaClientConfig } from '@tenders-sa-org/sdk-js';

import { getConfig } from '../config';
import { type Column, type JsonOption, formatMeta, formatTable, handleError, renderJson } from '../utils';

function makeCategories(): CategoriesResource {
  const config: TendersaClientConfig = { apiKey: getConfig().apiKey };
  return new CategoriesResource(new TendersaClient(config));
}

export function registerCategoriesCommands(program: Command): void {
  const cats = program.command('categories').description('Category operations');

  cats
    .command('list')
    .option('--json', 'Output as JSON')
    .description('List all tender categories')
    .action(async (options) => {
      const api = makeCategories();
      try {
        const result = await api.list();
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        const CAT_COLUMNS: Column[] = [
          { header: 'Slug', key: 'categorySlug', width: 40 },
          { header: 'Name', key: 'categoryName', width: 50 },
          { header: 'Count', key: 'tenderCount', width: 10 },
        ];
        console.log(formatTable(result.data as unknown as Record<string, unknown>[], CAT_COLUMNS));
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });

  cats
    .command('get <category-id>')
    .option('--json', 'Output as JSON')
    .description('Get category details')
    .action(async (categoryId: string, options) => {
      const api = makeCategories();
      try {
        const result = await api.get(categoryId);
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        const c = result.data;
        console.log(`Slug:  ${c.slug}`);
        console.log(`Name:  ${c.name ?? ''}`);
        console.log(`Count: ${c.tenderCount}`);
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });
}
