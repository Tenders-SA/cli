import { Command } from 'commander';
import { TendersaClient, CompaniesResource, type CompanySearchParams } from '@tendersa/sdk';
import type { TendersaClientConfig } from '@tendersa/sdk';

import { getConfig } from '../config';
import { type Column, formatMeta, formatTable } from '../utils';

function makeCompanies(): CompaniesResource {
  const config: TendersaClientConfig = { apiKey: getConfig().apiKey };
  return new CompaniesResource(new TendersaClient(config));
}

const COMPANY_COLUMNS: Column[] = [
  { header: 'Name', key: 'name', width: 40 },
  { header: 'Awards', key: 'totalAwards', width: 8 },
  { header: 'Total Value', key: 'totalValue', width: 16 },
  { header: 'B-BBEE', key: 'beeLevel', width: 8 },
  { header: 'Type', key: 'enterpriseType', width: 20 },
];

export function registerCompaniesCommands(program: Command): void {
  const companies = program.command('companies').description('Company operations');

  companies
    .command('get <company-name>')
    .description('Get company profile (by exact name)')
    .action(async (name: string) => {
      const api = makeCompanies();
      try {
        const result = await api.get(name);
        const profile = result.data.profile;
        console.log(`Name:             ${profile.name}`);
        console.log(`Registration:     ${profile.registrationNumber ?? 'N/A'}`);
        console.log(`B-BBEE Level:     ${profile.beeLevel ?? 'N/A'}`);
        console.log(`Enterprise Type:  ${profile.enterpriseType ?? 'N/A'}`);
        console.log(`Total Awards:     ${profile.totalAwards}`);
        console.log(`Total Value:      R ${profile.totalValue.toLocaleString()}`);
        console.log(`Compliance Score: ${profile.complianceScore ?? 'N/A'}`);
        if (profile.directors?.length) {
          console.log(`Directors:        ${profile.directors.map((d) => d.name).join(', ')}`);
        }
      } catch (err) {
        console.error(err instanceof Error ? err.message : String(err));
        process.exit(1);
      }
    });

  companies
    .command('search <query>')
    .description('Search companies')
    .action(async (query: string) => {
      const api = makeCompanies();
      try {
        const params: CompanySearchParams = { q: query };
        const result = await api.search(params);
        if (result.data.length === 0) {
          console.log('No companies found');
          return;
        }
        console.log(formatTable(result.data as unknown as Record<string, unknown>[], COMPANY_COLUMNS));
        console.log(formatMeta(result.meta));
      } catch (err) {
        console.error(err instanceof Error ? err.message : String(err));
        process.exit(1);
      }
    });
}
