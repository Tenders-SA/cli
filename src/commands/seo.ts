import { Command } from 'commander';
import { TendersaClient, SeoResource } from '@tenders-sa-org/sdk-js';
import type { TendersaClientConfig } from '@tenders-sa-org/sdk-js';

import { getConfig } from '../config';
import { type Column, type JsonOption, formatMeta, formatTable, handleError, renderJson } from '../utils';

function makeSeo(): SeoResource {
  const config: TendersaClientConfig = { apiKey: getConfig().apiKey };
  return new SeoResource(new TendersaClient(config));
}

export function registerSeoCommands(program: Command): void {
  const seo = program.command('seo').description('SEO and article operations');

  seo
    .command('category <slug>')
    .option('--json', 'Output as JSON')
    .description('Get SEO data for a category page')
    .action(async (slug: string, options) => {
      const api = makeSeo();
      try {
        const result = await api.category(slug);
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        console.log(JSON.stringify(result.data, null, 2));
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });

  seo
    .command('province <slug>')
    .option('--json', 'Output as JSON')
    .description('Get SEO data for a province page')
    .action(async (slug: string, options) => {
      const api = makeSeo();
      try {
        const result = await api.province(slug);
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        console.log(JSON.stringify(result.data, null, 2));
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });

  seo
    .command('articles')
    .option('--page <page>', 'Page number', '1')
    .option('--limit <limit>', 'Items per page', '20')
    .option('--json', 'Output as JSON')
    .description('List articles')
    .action(async (options) => {
      const api = makeSeo();
      try {
        const result = await api.listArticles({ page: Number(options.page), limit: Number(options.limit) });
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        const ART_COLUMNS: Column[] = [
          { header: 'ID', key: 'id', width: 24 },
          { header: 'Title', key: 'title', width: 50 },
          { header: 'Author', key: 'authorName', width: 20 },
        ];
        console.log(formatTable(result.data as unknown as Record<string, unknown>[], ART_COLUMNS));
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });

  seo
    .command('article <article-id>')
    .option('--json', 'Output as JSON')
    .description('Get article details')
    .action(async (articleId: string, options) => {
      const api = makeSeo();
      try {
        const result = await api.getArticle(articleId);
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        const a = result.data;
        console.log(`Title:   ${a.title ?? ''}`);
        console.log(`Slug:    ${a.slug ?? ''}`);
        console.log(`Excerpt: ${a.excerpt ?? ''}`);
        console.log(`Content: ${(a.content ?? '').slice(0, 500)}${(a.content ?? '').length > 500 ? '…' : ''}`);
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });
}
