import { Command } from 'commander';
import { TendersaClient, ProvincesResource } from '@tenders-sa-org/sdk-js';
import type { TendersaClientConfig } from '@tenders-sa-org/sdk-js';

import { getConfig } from '../config';
import { type Column, type JsonOption, formatMeta, formatTable, handleError, renderJson } from '../utils';

function makeProvinces(): ProvincesResource {
  const config: TendersaClientConfig = { apiKey: getConfig().apiKey };
  return new ProvincesResource(new TendersaClient(config));
}

export function registerProvincesCommands(program: Command): void {
  const prov = program.command('provinces').description('Province operations');

  prov
    .command('list')
    .option('--json', 'Output as JSON')
    .description('List all provinces with tender counts')
    .action(async (options) => {
      const api = makeProvinces();
      try {
        const result = await api.list();
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        const PROV_COLUMNS: Column[] = [
          { header: 'Slug', key: 'provinceSlug', width: 25 },
          { header: 'Name', key: 'provinceName', width: 30 },
          { header: 'Tenders', key: 'tenderCount', width: 10 },
        ];
        console.log(formatTable(result.data as unknown as Record<string, unknown>[], PROV_COLUMNS));
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });

  prov
    .command('get <province-slug>')
    .option('--json', 'Output as JSON')
    .description('Get province details')
    .action(async (slug: string, options) => {
      const api = makeProvinces();
      try {
        const result = await api.get(slug);
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        console.log(JSON.stringify(result.data, null, 2));
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });

  prov
    .command('health <province-slug>')
    .option('--json', 'Output as JSON')
    .description('Get health scores for a province')
    .action(async (slug: string, options) => {
      const api = makeProvinces();
      try {
        const result = await api.healthScores(slug);
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        const HEALTH_COLUMNS: Column[] = [
          { header: 'Category', key: 'category', width: 30 },
          { header: 'Score', key: 'score', width: 10 },
        ];
        console.log(formatTable(result.data as unknown as Record<string, unknown>[], HEALTH_COLUMNS));
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });
}
