import { Command } from 'commander';
import { TendersaClient, CompaniesResource } from '@tenders-sa-org/sdk-js';
import type { TendersaClientConfig, CompanySearchParams } from '@tenders-sa-org/sdk-js';

import { getConfig } from '../config';
import { type Column, type JsonOption, formatMeta, formatTable, handleError, renderJson } from '../utils';

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
    .option('--json', 'Output as JSON')
    .description('Get company profile (by exact name)')
    .action(async (name: string, options) => {
      const api = makeCompanies();
      try {
        const result = await api.get(name);
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        const profile = result.data.profile;
        console.log(`Name:             ${profile.name}`);
        console.log(`Registration:     ${profile.registrationNumber ?? 'N/A'}`);
        console.log(`B-BBEE Level:     ${profile.beeLevel ?? 'N/A'}`);
        console.log(`Enterprise Type:  ${profile.enterpriseType ?? 'N/A'}`);
        console.log(`Total Awards:     ${profile.totalAwards}`);
        console.log(`Total Value:      R ${(profile.totalValue ?? 0).toLocaleString()}`);
        console.log(`Compliance Score: ${profile.complianceScore ?? 'N/A'}`);
        if (profile.directors?.length) {
          console.log(`Directors:        ${profile.directors.map((d) => d.name).join(', ')}`);
        }
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });

  companies
    .command('search <query>')
    .option('--enterprise-type <type>', 'Filter by enterprise type')
    .option('--bee-level <level>', 'Filter by B-BBEE level')
    .option('--province <province>', 'Filter by province')
    .option('--category <category>', 'Filter by category')
    .option('--page <page>', 'Page number', '1')
    .option('--limit <limit>', 'Items per page', '20')
    .option('--json', 'Output as JSON')
    .description('Search companies')
    .action(async (query: string, options) => {
      const api = makeCompanies();
      try {
        const params: CompanySearchParams = {
          q: query,
          page: Number(options.page),
          limit: Number(options.limit),
        };
        if (options.enterpriseType) params.enterpriseType = options.enterpriseType as string;
        if (options.beeLevel) params.beeLevel = options.beeLevel as string;
        if (options.province) params.province = options.province as string;
        if (options.category) params.category = options.category as string;
        const result = await api.search(params);
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        if (result.data.length === 0) {
          console.log('No companies found');
          return;
        }
        console.log(formatTable(result.data as unknown as Record<string, unknown>[], COMPANY_COLUMNS));
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });

  companies
    .command('top')
    .option('--limit <limit>', 'Items per page', '20')
    .option('--json', 'Output as JSON')
    .description('List top companies by award value')
    .action(async (options) => {
      const api = makeCompanies();
      try {
        const result = await api.top({ limit: Number(options.limit) });
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        console.log(formatTable(result.data as unknown as Record<string, unknown>[], COMPANY_COLUMNS));
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });

  companies
    .command('by-registration <reg-number>')
    .option('--json', 'Output as JSON')
    .description('Get company profile by registration number')
    .action(async (regNumber: string, options) => {
      const api = makeCompanies();
      try {
        const result = await api.byRegistration(regNumber);
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        const profile = result.data.profile;
        console.log(`Name:             ${profile.name}`);
        console.log(`Registration:     ${profile.registrationNumber ?? 'N/A'}`);
        console.log(`B-BBEE Level:     ${profile.beeLevel ?? 'N/A'}`);
        console.log(`Enterprise Type:  ${profile.enterpriseType ?? 'N/A'}`);
        console.log(`Total Awards:     ${profile.totalAwards}`);
        console.log(`Total Value:      R ${(profile.totalValue ?? 0).toLocaleString()}`);
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });

  companies
    .command('awards <company-name>')
    .option('--page <page>', 'Page number', '1')
    .option('--limit <limit>', 'Items per page', '20')
    .option('--json', 'Output as JSON')
    .description('List awards for a company')
    .action(async (name: string, options) => {
      const api = makeCompanies();
      try {
        const result = await api.awards(name, { page: Number(options.page), limit: Number(options.limit) });
        const AWARD_COLUMNS: Column[] = [
          { header: 'ID', key: 'awardId', width: 24 },
          { header: 'Title', key: 'title', width: 45 },
          { header: 'Amount', key: 'amount', width: 14 },
          { header: 'Date', key: 'awardDate', width: 14 },
        ];
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        console.log(formatTable(result.data as unknown as Record<string, unknown>[], AWARD_COLUMNS));
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });

  companies
    .command('directors <company-name>')
    .option('--json', 'Output as JSON')
    .description('List directors for a company')
    .action(async (name: string, options) => {
      const api = makeCompanies();
      try {
        const result = await api.directors(name);
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        const DIR_COLUMNS: Column[] = [
          { header: 'Name', key: 'name', width: 35 },
          { header: 'Role', key: 'role', width: 25 },
        ];
        console.log(formatTable(result.data as unknown as Record<string, unknown>[], DIR_COLUMNS));
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });
}
