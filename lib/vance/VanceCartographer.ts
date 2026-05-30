export interface ASTNode {
  id: string;
  uri: string;
  name: string;
  kind: string;
  range: {
    start: { line: number; character: number };
    end: { line: number; character: number };
  };
  scopeDepth: number;
}

export interface JSONRPCRequest {
  jsonrpc: "2.0";
  id: string | number;
  method: string;
  params: any;
}

export interface JSONRPCResponse {
  jsonrpc: "2.0";
  id: string | number;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

export interface NitinolScar {
  scar_id: string;
  trigger_condition: string;
  erroneous_payload_fragment: any;
  lsp_spec_violation: string;
  dccd_intervention: string;
}

export class VanceCartographer {
  private astNodes: Map<string, ASTNode> = new Map();
  private scars: NitinolScar[] = [];

  constructor() {
    this.scars.push({
      scar_id: "SYM-0047",
      trigger_condition: "textDocument/didChange with missing 'version' field",
      erroneous_payload_fragment: { textDocument: { uri: "file:///src/auth.rs" } },
      lsp_spec_violation: "§3.16.1: VersionedTextDocumentIdentifier requires 'version: integer | null'",
      dccd_intervention: "REJECT_PRIOR_TO_EMIT"
    });
  }

  public getNodes(): ASTNode[] {
    return Array.from(this.astNodes.values());
  }

  public getScars(): NitinolScar[] {
    return this.scars;
  }

  private validateJSONRPC(payload: any): boolean {
    return payload && payload.jsonrpc === "2.0" && payload.id !== undefined;
  }

  public processRequest(request: any): JSONRPCResponse {
    if (!this.validateJSONRPC(request)) {
      this.recordScar("Malformed JSON-RPC request", request);
      return {
        jsonrpc: "2.0",
        id: request?.id || null,
        error: { code: -32600, message: "Invalid Request" }
      };
    }

    if (request.method === "textDocument/didChange") {
      return this.handleDidChange(request as JSONRPCRequest);
    } else if (request.method === "textDocument/definition") {
      return this.handleDefinition(request as JSONRPCRequest);
    }

    return {
      jsonrpc: "2.0",
      id: request.id,
      error: { code: -32601, message: "Method not found" }
    };
  }

  private handleDidChange(request: JSONRPCRequest): JSONRPCResponse {
    const params = request.params;
    if (!params || !params.textDocument || params.textDocument.version === undefined) {
      this.recordScar("Missing 'version' in textDocument/didChange", request);
      return {
        jsonrpc: "2.0",
        id: request.id,
        error: { code: -32602, message: "Invalid params: VersionedTextDocumentIdentifier requires 'version'" }
      };
    }

    // Mock incremental AST parsing
    const uri = params.textDocument.uri;
    const contentChanges = params.contentChanges || [];

    // Simplistic mock: just add a node based on the first content change for demonstration
    if (contentChanges.length > 0) {
        const text = contentChanges[0].text;
        const id = `node-${Date.now()}`;
        this.astNodes.set(id, {
            id,
            uri,
            name: text.substring(0, 20), // just an arbitrary name mock
            kind: "variable",
            range: {
                start: { line: 0, character: 0 },
                end: { line: 0, character: text.length }
            },
            scopeDepth: 0
        });
    }

    return {
      jsonrpc: "2.0",
      id: request.id,
      result: { success: true }
    };
  }

  private handleDefinition(request: JSONRPCRequest): JSONRPCResponse {
     const params = request.params;

     // Mock CFDI check: let's pretend we have high CFDI if the requested uri is 'ambiguous.ts'
     if (params?.textDocument?.uri?.includes('ambiguous')) {
         return {
            jsonrpc: "2.0",
            id: request.id,
            result: null,
            // @ts-ignore - Adding custom field for demonstration of CFDI annotation
            _vance_meta: {
                cfdi_flag: true,
                reason: "Graph ambiguity exceeds CFDI threshold.",
                candidates: []
            }
         }
     }

     return {
        jsonrpc: "2.0",
        id: request.id,
        result: {
            uri: params?.textDocument?.uri || "unknown",
            range: {
                start: { line: 0, character: 0 },
                end: { line: 0, character: 0 }
            }
        }
     }
  }

  private recordScar(reason: string, payload: any) {
    this.scars.push({
      scar_id: `SYM-${Date.now()}`,
      trigger_condition: reason,
      erroneous_payload_fragment: payload,
      lsp_spec_violation: "Validation failed during DCCD phase",
      dccd_intervention: "REJECT_PRIOR_TO_EMIT"
    });
  }
}

export const vanceCartographer = new VanceCartographer();
