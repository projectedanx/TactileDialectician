'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, GitMerge, FileJson, AlertTriangle } from 'lucide-react';

export default function VanceLSPDashboard() {
  const [requestPayload, setRequestPayload] = useState('{\n  "jsonrpc": "2.0",\n  "id": 1,\n  "method": "textDocument/didChange",\n  "params": {\n    "textDocument": { "uri": "file:///src/main.ts" }\n  }\n}');
  const [response, setResponse] = useState<any>(null);
  const [scars, setScars] = useState<any[]>([]);
  const [nodes, setNodes] = useState<any[]>([]);

  const fetchState = async () => {
    try {
      const res = await fetch('/api/vance');
      const data = await res.json();
      setScars(data.scars || []);
      setNodes(data.nodes || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  const handleSendRequest = async () => {
    try {
      const parsed = JSON.parse(requestPayload);
      const res = await fetch('/api/vance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed)
      });
      const data = await res.json();
      setResponse(data);
      fetchState();
    } catch (e: any) {
      setResponse({ error: 'Invalid JSON format in request payload', details: e.message });
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-900 text-slate-200 min-h-screen">
      <div className="flex items-center gap-3 border-b border-indigo-900 pb-4">
        <GitMerge className="w-8 h-8 text-indigo-500" />
        <h1 className="text-2xl font-bold text-indigo-400">VANCE: Topological LSP Cartographer</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Request/Response Panel */}
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <FileJson className="w-5 h-5 text-emerald-400" />
            JSON-RPC 2.0 Interface
          </h2>
          <textarea
            className="w-full h-48 bg-slate-950 text-emerald-400 p-3 rounded font-mono text-sm border border-slate-700 mb-4 focus:outline-none focus:border-indigo-500"
            value={requestPayload}
            onChange={(e) => setRequestPayload(e.target.value)}
          />
          <button
            onClick={handleSendRequest}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Dispatch to DCCD Guard
          </button>

          {response && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-slate-400 mb-1">DCCD / Server Response:</h3>
              <pre className="bg-slate-950 p-3 rounded font-mono text-xs overflow-auto max-h-48 border border-slate-700">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Nitinol Failure Ledger Panel */}
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-rose-400">
            <ShieldAlert className="w-5 h-5" />
            Nitinol Failure Ledger (NFL)
          </h2>
          <div className="overflow-auto max-h-[400px] flex flex-col gap-3">
            {scars.map((scar, idx) => (
              <div key={idx} className="bg-rose-950/30 border border-rose-900/50 p-3 rounded text-sm">
                <div className="font-mono text-rose-400 mb-1">{scar.scar_id}</div>
                <div className="text-slate-300"><span className="text-slate-500">Trigger:</span> {scar.trigger_condition}</div>
                <div className="text-slate-300"><span className="text-slate-500">Violation:</span> {scar.lsp_spec_violation}</div>
                <div className="text-slate-300"><span className="text-slate-500">Action:</span> {scar.dccd_intervention}</div>
              </div>
            ))}
            {scars.length === 0 && <div className="text-slate-500 text-sm">No scars recorded.</div>}
          </div>
        </div>

        {/* AST Topology Panel */}
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-indigo-400">
            <AlertTriangle className="w-5 h-5" />
            Conflict-Free Replicated Semantic Graph (AST Nodes)
          </h2>
          <div className="overflow-auto max-h-[300px]">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-slate-400">
                <tr>
                  <th className="p-2">ID</th>
                  <th className="p-2">URI</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Kind</th>
                </tr>
              </thead>
              <tbody>
                {nodes.map((node, idx) => (
                  <tr key={idx} className="border-b border-slate-700/50">
                    <td className="p-2 font-mono text-xs">{node.id}</td>
                    <td className="p-2 text-indigo-300">{node.uri}</td>
                    <td className="p-2">{node.name}</td>
                    <td className="p-2 text-emerald-400">{node.kind}</td>
                  </tr>
                ))}
                {nodes.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-slate-500">Graph is empty. Submit didChange events.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
