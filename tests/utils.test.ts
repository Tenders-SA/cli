import { describe, it, expect } from 'vitest';
import { formatTable, formatMeta, formatError } from '../src/utils';

describe('formatTable', () => {
  it('renders a simple table', () => {
    const rows = [
      { id: 't1', name: 'Road works', value: 100 },
      { id: 't2', name: 'Bridge', value: 500 },
    ];
    const columns = [
      { header: 'ID', key: 'id', width: 6 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Value', key: 'value', width: 8 },
    ];
    const output = formatTable(rows, columns);
    expect(output).toContain('ID');
    expect(output).toContain('Name');
    expect(output).toContain('t1');
    expect(output).toContain('Road works');
  });
});

describe('formatMeta', () => {
  it('formats with request id and version', () => {
    const out = formatMeta({ requestId: 'req_1', timestamp: '', apiVersion: 'v1' });
    expect(out).toContain('req_1');
    expect(out).toContain('v1');
  });

  it('formats with page info', () => {
    const out = formatMeta({ requestId: 'req_1', timestamp: '', apiVersion: 'v1', page: 1, totalCount: 50 });
    expect(out).toContain('total: 50');
  });
});

describe('formatError', () => {
  it('formats Error instances', () => {
    expect(formatError(new Error('boom'))).toContain('boom');
  });

  it('formats plain strings', () => {
    expect(formatError('oops')).toContain('oops');
  });
});
