import { Command } from 'commander';

import { registerTendersCommands } from './commands/tenders';
import { registerAwardsCommands } from './commands/awards';
import { registerCompaniesCommands } from './commands/companies';
import { registerMetaCommands } from './commands/meta';
import { getConfig, setConfig } from './config';

const program = new Command();

program
  .name('tendersa')
  .description('Tenders-SA Developer API CLI — South African public procurement data')
  .version('0.1.0-alpha.0');

program.hook('preAction', (thisCommand) => {
  const cmd = thisCommand.args[0];
  if (cmd && cmd !== 'help' && cmd !== 'config') {
    const config = getConfig();
    if (!config.apiKey) {
      console.error('Error: No API key configured. Run: tendersa config set <key>');
      process.exit(1);
    }
  }
});

registerTendersCommands(program);
registerAwardsCommands(program);
registerCompaniesCommands(program);
registerMetaCommands(program);

program
  .command('config')
  .argument('<action>', 'get or set')
  .argument('[value]', 'API key value')
  .description('Manage CLI configuration')
  .action((action: string, value?: string) => {
    if (action === 'set' && value) {
      setConfig(value);
      console.log('API key configured successfully');
    } else if (action === 'get') {
      const config = getConfig();
      if (config.apiKey) {
        console.log(`Current API key: ${config.apiKey.slice(0, 8)}...${config.apiKey.slice(-4)}`);
      } else {
        console.log('No API key configured');
      }
    } else if (action === 'set' && !value) {
      console.error('Usage: tendersa config set <api-key>');
      process.exit(1);
    } else {
      console.error('Usage: tendersa config <get|set> [value]');
      process.exit(1);
    }
  });

program.parse(process.argv);
