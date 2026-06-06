import { describe, it, expect, beforeEach } from 'vitest';
import { VanceCartographer } from './VanceCartographer';

describe('VanceCartographer', () => {
  let cartographer: VanceCartographer;

  beforeEach(() => {
    cartographer = new VanceCartographer();
  });

  it('should initialize with scars from the constructor', () => {
    const scars = cartographer.getScars();
    expect(scars.length).toBeGreaterThan(0);
    expect(scars[0].scar_id).toBe('SYM-0047');
  });

  describe('processRequest', () => {
    it('should return an Invalid Request error and record a scar for missing jsonrpc', () => {
      const request = { id: 1, method: 'someMethod' };
      const initialScarsCount = cartographer.getScars().length;

      const response = cartographer.processRequest(request);

      expect(response).toEqual({
        jsonrpc: '2.0',
        id: 1,
        error: { code: -32600, message: 'Invalid Request' }
      });
      expect(cartographer.getScars().length).toBe(initialScarsCount + 1);
      expect(cartographer.getScars()[initialScarsCount].trigger_condition).toBe('Malformed JSON-RPC request');
    });

    it('should return a Method not found error for unknown method', () => {
      const request = { jsonrpc: '2.0', id: 2, method: 'unknown/method', params: {} };

      const response = cartographer.processRequest(request);

      expect(response).toEqual({
        jsonrpc: '2.0',
        id: 2,
        error: { code: -32601, message: 'Method not found' }
      });
    });

    describe('textDocument/didChange', () => {
      it('should return Invalid params error and record a scar if version is missing', () => {
        const request = {
          jsonrpc: '2.0',
          id: 3,
          method: 'textDocument/didChange',
          params: { textDocument: { uri: 'file:///test.ts' } }
        };
        const initialScarsCount = cartographer.getScars().length;

        const response = cartographer.processRequest(request);

        expect(response).toEqual({
          jsonrpc: '2.0',
          id: 3,
          error: { code: -32602, message: "Invalid params: VersionedTextDocumentIdentifier requires 'version'" }
        });
        expect(cartographer.getScars().length).toBe(initialScarsCount + 1);
        expect(cartographer.getScars()[initialScarsCount].trigger_condition).toBe("Missing 'version' in textDocument/didChange");
      });

      it('should add an AST node and return success on valid changes', () => {
        const request = {
          jsonrpc: '2.0',
          id: 4,
          method: 'textDocument/didChange',
          params: {
            textDocument: { uri: 'file:///test.ts', version: 1 },
            contentChanges: [{ text: 'const a = 1;' }]
          }
        };

        const response = cartographer.processRequest(request);

        expect(response).toEqual({
          jsonrpc: '2.0',
          id: 4,
          result: { success: true }
        });

        const nodes = cartographer.getNodes();
        expect(nodes.length).toBe(1);
        expect(nodes[0].uri).toBe('file:///test.ts');
        expect(nodes[0].name).toBe('const a = 1;');
      });
    });

    describe('textDocument/definition', () => {
      it('should return null result with CFDI annotation metadata for ambiguous URI', () => {
        const request = {
          jsonrpc: '2.0',
          id: 5,
          method: 'textDocument/definition',
          params: {
            textDocument: { uri: 'file:///ambiguous.ts' }
          }
        };

        const response = cartographer.processRequest(request);

        expect(response).toEqual({
          jsonrpc: '2.0',
          id: 5,
          result: null,
          _vance_meta: {
            cfdi_flag: true,
            reason: "Graph ambiguity exceeds CFDI threshold.",
            candidates: []
          }
        });
      });

      it('should return a dummy definition range for standard URI', () => {
        const request = {
          jsonrpc: '2.0',
          id: 6,
          method: 'textDocument/definition',
          params: {
            textDocument: { uri: 'file:///standard.ts' }
          }
        };

        const response = cartographer.processRequest(request);

        expect(response).toEqual({
          jsonrpc: '2.0',
          id: 6,
          result: {
            uri: 'file:///standard.ts',
            range: {
              start: { line: 0, character: 0 },
              end: { line: 0, character: 0 }
            }
          }
        });
      });
    });
  });
});
