import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

interface CliConfig {
  apiKey: string;
}

const CONFIG_DIR = join(homedir(), '.tendersa');
const CONFIG_PATH = join(CONFIG_DIR, 'config.json');

export function getConfig(): CliConfig {
  try {
    if (!existsSync(CONFIG_PATH)) {
      return { apiKey: '' };
    }
    const raw = readFileSync(CONFIG_PATH, 'utf-8');
    return JSON.parse(raw) as CliConfig;
  } catch {
    return { apiKey: '' };
  }
}

export function setConfig(apiKey: string): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
  writeFileSync(CONFIG_PATH, JSON.stringify({ apiKey }, null, 2), 'utf-8');
}
