import { Command } from 'commander';
import { TendersaClient, DocumentsResource } from '@tenders-sa-org/sdk-js';
import type { TendersaClientConfig } from '@tenders-sa-org/sdk-js';

import { getConfig } from '../config';
import { type JsonOption, formatMeta, handleError, renderJson } from '../utils';

function makeDocuments(): DocumentsResource {
  const config: TendersaClientConfig = { apiKey: getConfig().apiKey };
  return new DocumentsResource(new TendersaClient(config));
}

export function registerDocumentsCommands(program: Command): void {
  const docs = program.command('documents').description('Document operations');

  docs
    .command('get <document-id>')
    .option('--json', 'Output as JSON')
    .description('Get document details')
    .action(async (documentId: string, options) => {
      const api = makeDocuments();
      try {
        const result = await api.get(documentId);
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        const d = result.data;
        console.log(`ID:       ${d.id ?? ''}`);
        console.log(`File:     ${d.fileName ?? ''}`);
        console.log(`Size:     ${d.fileSize ?? ''}`);
        console.log(`Type:     ${d.mimeType ?? ''}`);
        if (d.downloadUrl) console.log(`Download: ${d.downloadUrl}`);
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });

  docs
    .command('url <document-id>')
    .option('--json', 'Output as JSON')
    .description('Get document download URL')
    .action(async (documentId: string, options) => {
      const api = makeDocuments();
      try {
        const result = await api.downloadUrl(documentId);
        if ((options as JsonOption).json) {
          console.log(renderJson(result.data, result.meta));
          return;
        }
        const d = result.data;
        console.log(`Download URL: ${d.downloadUrl ?? ''}`);
        console.log(`R2 Key:       ${d.r2Key ?? 'N/A'}`);
        console.log(formatMeta(result.meta));
      } catch (err) { handleError(err); }
    });
}
