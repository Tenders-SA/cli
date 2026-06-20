import { Command } from 'commander';
import { TendersaClient, DirectorsResource } from '@tenders-sa-org/sdk-js';
import type { TendersaClientConfig } from '@tenders-sa-org/sdk-js';

import { getConfig } from '../config';
import { type Column, type JsonOption, formatMeta, formatTable, handleError, renderJson } from '../utils';

function makeDirectors(): DirectorsResource {
  const config: TendersaClientConfig = { apiKey: getConfig().apiKey };
  return new DirectorsResource(new TendersaClient(config));
}

export function registerDirectorsCommands(program: Command): void {
  const dirs = program.command('directors').description('Director operations');

  dirs
    .command('search <query>')
    .option('--page <page>', 'Page number', '1')
    .option('--limit <limit>', 'Items per page', '20')
    .option('--json', 'Output as JSON')
    .description('Search directors')
    .action(async (query: string, options) => {
      const api = makeDirectors();
      try {
        const result = await api.search({ q: query, page: Number(options.page), limit: Number(options.limit) });
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        const DIR_COLUMNS: Column[] = [
          { header: 'ID', key: 'directorId', width: 24 },
          { header: 'Name', key: 'fullName', width: 35 },
          { header: 'Role', key: 'position', width: 20 },
        ];
        console.log(formatTable(result.data as unknown as Record<string, unknown>[], DIR_COLUMNS));
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });

  dirs
    .command('get <director-id>')
    .option('--json', 'Output as JSON')
    .description('Get director details')
    .action(async (directorId: string, options) => {
      const api = makeDirectors();
      try {
        const result = await api.get(directorId);
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        const d = result.data;
        console.log(`ID:   ${d.directorId}`);
        console.log(`Name: ${d.fullName ?? ''}`);
        console.log(`Role: ${d.position ?? ''}`);
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });

  dirs
    .command('by-organization <org-id>')
    .option('--page <page>', 'Page number', '1')
    .option('--limit <limit>', 'Items per page', '20')
    .option('--json', 'Output as JSON')
    .description('List directors by organization')
    .action(async (orgId: string, options) => {
      const api = makeDirectors();
      try {
        const result = await api.byOrganization(orgId, { page: Number(options.page), limit: Number(options.limit) });
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        const DIR_COLUMNS: Column[] = [
          { header: 'ID', key: 'directorId', width: 24 },
          { header: 'Name', key: 'fullName', width: 35 },
          { header: 'Role', key: 'position', width: 20 },
        ];
        console.log(formatTable(result.data as unknown as Record<string, unknown>[], DIR_COLUMNS));
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });
}
