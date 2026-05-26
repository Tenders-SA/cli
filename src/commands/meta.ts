import { Command } from 'commander';
import { TendersaClient, MetaResource } from '@tendersa/sdk';
import type { TendersaClientConfig } from '@tendersa/sdk';

import { getConfig } from '../config';
import { formatTable, type Column } from '../utils';

function makeMeta(): MetaResource {
  const config: TendersaClientConfig = { apiKey: getConfig().apiKey };
  return new MetaResource(new TendersaClient(config));
}

export function registerMetaCommands(program: Command): void {
  const meta = program.command('meta').description('API metadata and status');

  meta
    .command('status')
    .description('Check API status')
    .action(async () => {
      const api = makeMeta();
      try {
        const result = await api.status();
        const status = result.data;
        console.log(`API Status: ${status.healthy ? 'Healthy' : 'Unhealthy'}`);
        console.log(`Version:    ${status.version}`);
        if (status.lastSync) {
          console.log(`Last Sync:  ${JSON.stringify(status.lastSync)}`);
        }
      } catch (err) {
        console.error(err instanceof Error ? err.message : String(err));
        process.exit(1);
      }
    });

  meta
    .command('provinces')
    .description('List tender counts by province')
    .action(async () => {
      const api = makeMeta();
      try {
        const result = await api.provinces();
        const PROV_COLUMNS: Column[] = [
          { header: 'Province', key: 'name', width: 30 },
          { header: 'Tenders', key: 'tenderCount', width: 10 },
        ];
        console.log(formatTable(result.data as unknown as Record<string, unknown>[], PROV_COLUMNS));
      } catch (err) {
        console.error(err instanceof Error ? err.message : String(err));
        process.exit(1);
      }
    });

  meta
    .command('categories')
    .description('List tender counts by category')
    .action(async () => {
      const api = makeMeta();
      try {
        const result = await api.categories();
        const CAT_COLUMNS: Column[] = [
          { header: 'Category', key: 'name', width: 50 },
          { header: 'Count', key: 'count', width: 10 },
        ];
        console.log(formatTable(result.data as unknown as Record<string, unknown>[], CAT_COLUMNS));
      } catch (err) {
        console.error(err instanceof Error ? err.message : String(err));
        process.exit(1);
      }
    });

  meta
    .command('usage')
    .description('Check API usage stats')
    .action(async () => {
      const api = makeMeta();
      try {
        const result = await api.usage();
        const usage = result.data;
        console.log(`Daily:   ${usage.daily} / ${usage.limit.daily}`);
        console.log(`Monthly: ${usage.monthly} / ${usage.limit.monthly}`);
      } catch (err) {
        console.error(err instanceof Error ? err.message : String(err));
        process.exit(1);
      }
    });
}
