import { NextResponse } from 'next/server';
import { vanceCartographer } from '@/lib/vance/VanceCartographer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = vanceCartographer.processRequest(body);
    return NextResponse.json(response);
  } catch (error) {
    console.error("VANCE API Error:", error);
    return NextResponse.json({
      jsonrpc: "2.0",
      id: null,
      error: { code: -32700, message: "Parse error" }
    }, { status: 400 });
  }
}

export async function GET() {
    return NextResponse.json({
        nodes: vanceCartographer.getNodes(),
        scars: vanceCartographer.getScars()
    });
}
