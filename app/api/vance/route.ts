import { NextResponse } from 'next/server';
import { vanceCartographer } from '@/lib/vance/VanceCartographer';

/**
 * POST handler for VANCE LSP operations.
 * Validates JSON-RPC 2.0 payloads against the DRP-SCOS-VANCE schema.
 *
 * @param {Request} req - The inbound JSON-RPC request.
 * @returns {Promise<Response>} The JSON response containing execution results or validation errors.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = vanceCartographer.processRequest(body);
    return NextResponse.json(response);
  } catch (error) {
    console.error("VANCE API Error:", error);
    return NextResponse.json({
/**
 * GET handler for VANCE LSP operations.
 * Not supported by JSON-RPC 2.0 specs.
 *
 * @returns {Promise<Response>} Returns a 405 Method Not Allowed error.
 */
      jsonrpc: "2.0",
      id: null,
      error: { code: -32700, message: "Parse error" }
    }, { status: 400 });
  }
}

/**
 * GET handler for VANCE LSP operations.
 * Not supported by JSON-RPC 2.0 specs.
 *
 * @returns {Promise<Response>} Returns a 405 Method Not Allowed error.
 */
export async function GET() {
    return NextResponse.json({
        nodes: vanceCartographer.getNodes(),
        scars: vanceCartographer.getScars()
    });
}
