import { Command } from 'commander';
import { TendersaClient, ServicesResource } from '@tenders-sa-org/sdk-js';
import type { TendersaClientConfig } from '@tenders-sa-org/sdk-js';

import { getConfig } from '../config';
import { type Column, type JsonOption, formatMeta, formatTable, handleError, renderJson } from '../utils';

function makeServices(): ServicesResource {
  const config: TendersaClientConfig = { apiKey: getConfig().apiKey };
  return new ServicesResource(new TendersaClient(config));
}

export function registerServicesCommands(program: Command): void {
  const svc = program.command('services').description('Service type operations');

  svc
    .command('list')
    .option('--json', 'Output as JSON')
    .description('List all service types')
    .action(async (options) => {
      const api = makeServices();
      try {
        const result = await api.list();
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        const SVC_COLUMNS: Column[] = [
          { header: 'Slug', key: 'slug', width: 40 },
          { header: 'Name', key: 'name', width: 50 },
        ];
        console.log(formatTable(result.data as unknown as Record<string, unknown>[], SVC_COLUMNS));
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });

  svc
    .command('get <service-slug>')
    .option('--json', 'Output as JSON')
    .description('Get service type details')
    .action(async (slug: string, options) => {
      const api = makeServices();
      try {
        const result = await api.get(slug);
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        const s = result.data;
        console.log(`Slug: ${s.slug}`);
        console.log(`Name: ${s.name ?? ''}`);
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });
}
