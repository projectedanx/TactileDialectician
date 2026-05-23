'use client';

import { useState } from 'react';
import { Shield, Users, Activity, Settings, Database, AlertTriangle } from 'lucide-react';

/**
 * Renders the Admin Dashboard, an exclusive administrative interface for multi-user instances.
 * Provides capabilities for agent instance management, audit logging, and security oversight.
 *
 * @returns {JSX.Element} The rendered Admin Dashboard component.
 */
export default function AdminDashboard() {
  const [activeView, setActiveView] = useState<'agents' | 'users' | 'metrics' | 'security'>('agents');

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-display-lg font-mono font-bold text-primary mb-2 flex items-center gap-3">
          <Shield className="w-8 h-8" aria-hidden="true" />
          Sovereign Administrative Console
        </h2>
        <p className="text-on-surface-muted font-mono text-sm">
          Multi-User Instance Governance and Architectural Enforcement.
        </p>
      </div>

      <div className="flex gap-4 mb-8 border-b border-border pb-4">
        <button
          onClick={() => setActiveView('agents')}
          className={`flex items-center gap-2 px-4 py-2 font-mono text-sm transition-colors ${
            activeView === 'agents' ? 'text-primary bg-primary/10 border border-primary' : 'text-on-surface-muted hover:text-on-surface'
          }`}
        >
          <Database className="w-4 h-4" aria-hidden="true" />
          Agent Registry
        </button>
        <button
          onClick={() => setActiveView('users')}
          className={`flex items-center gap-2 px-4 py-2 font-mono text-sm transition-colors ${
            activeView === 'users' ? 'text-primary bg-primary/10 border border-primary' : 'text-on-surface-muted hover:text-on-surface'
          }`}
        >
          <Users className="w-4 h-4" aria-hidden="true" />
          Tenant Isolation
        </button>
        <button
          onClick={() => setActiveView('metrics')}
          className={`flex items-center gap-2 px-4 py-2 font-mono text-sm transition-colors ${
            activeView === 'metrics' ? 'text-primary bg-primary/10 border border-primary' : 'text-on-surface-muted hover:text-on-surface'
          }`}
        >
          <Activity className="w-4 h-4" aria-hidden="true" />
          Thermodynamic Metrics
        </button>
        <button
          onClick={() => setActiveView('security')}
          className={`flex items-center gap-2 px-4 py-2 font-mono text-sm transition-colors ${
            activeView === 'security' ? 'text-primary bg-primary/10 border border-primary' : 'text-on-surface-muted hover:text-on-surface'
          }`}
        >
          <AlertTriangle className="w-4 h-4" aria-hidden="true" />
          Epistemic Escrow Audit
        </button>
      </div>

      <div className="flex-1 bg-surface-raised border border-border p-6 overflow-y-auto">
        {activeView === 'agents' && (
          <div className="space-y-6">
            <h3 className="text-lg font-mono font-bold text-on-surface border-b border-border pb-2">Active Agent Instances</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-border p-4 bg-surface">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-mono font-bold text-primary">nextjs-frontend-rag-agent</h4>
                  <span className="px-2 py-1 text-xs font-mono bg-green-500/10 text-green-400 border border-green-500/20">v3.0.0</span>
                </div>
                <div className="space-y-2 text-sm font-mono text-on-surface-muted">
                  <p><span className="text-on-surface">Role:</span> Reflector + ToolUser</p>
                  <p><span className="text-on-surface">Status:</span> Nominal</p>
                  <p><span className="text-on-surface">Vector DB:</span> Firestore</p>
                  <p><span className="text-on-surface">Retrieval F1:</span> 0.92</p>
                </div>
              </div>
              <div className="border border-border p-4 bg-surface">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-mono font-bold text-primary">KIRA-7</h4>
                  <span className="px-2 py-1 text-xs font-mono bg-green-500/10 text-green-400 border border-green-500/20">v1.0.0</span>
                </div>
                <div className="space-y-2 text-sm font-mono text-on-surface-muted">
                  <p><span className="text-on-surface">Role:</span> Kinetic Integration & Routing Agent</p>
                  <p><span className="text-on-surface">Status:</span> Nominal</p>
                  <p><span className="text-on-surface">Perimeter Integrity:</span> 100%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'users' && (
          <div className="space-y-6">
             <h3 className="text-lg font-mono font-bold text-on-surface border-b border-border pb-2">Tenant Access Policies</h3>
             <table className="w-full text-left font-mono text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border text-on-surface-muted">
                    <th className="py-2 font-normal">Tenant ID</th>
                    <th className="py-2 font-normal">Role</th>
                    <th className="py-2 font-normal">Collections</th>
                    <th className="py-2 font-normal">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-3 text-on-surface">us-east-1a-prod-01</td>
                    <td className="py-3 text-on-surface">System Admin</td>
                    <td className="py-3 text-on-surface">*, support_docs</td>
                    <td className="py-3 text-green-400">Active</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 text-on-surface">tenant-b-sandbox</td>
                    <td className="py-3 text-on-surface">ReadOnly User</td>
                    <td className="py-3 text-on-surface">knowledge_base</td>
                    <td className="py-3 text-green-400">Active</td>
                  </tr>
                </tbody>
             </table>
          </div>
        )}

        {activeView === 'metrics' && (
          <div className="space-y-6">
             <h3 className="text-lg font-mono font-bold text-on-surface border-b border-border pb-2">Thermodynamic Telemetry</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-border bg-surface flex flex-col items-center justify-center">
                   <span className="text-xs font-mono text-on-surface-muted uppercase tracking-wider mb-2">p99 Latency</span>
                   <span className="text-3xl font-mono text-primary">342ms</span>
                </div>
                <div className="p-4 border border-border bg-surface flex flex-col items-center justify-center">
                   <span className="text-xs font-mono text-on-surface-muted uppercase tracking-wider mb-2">Hallucination Rate</span>
                   <span className="text-3xl font-mono text-green-400">0.02%</span>
                </div>
                <div className="p-4 border border-border bg-surface flex flex-col items-center justify-center">
                   <span className="text-xs font-mono text-on-surface-muted uppercase tracking-wider mb-2">Firestore Cost/Query</span>
                   <span className="text-3xl font-mono text-on-surface">$0.00014</span>
                </div>
             </div>
          </div>
        )}

        {activeView === 'security' && (
          <div className="space-y-6">
             <h3 className="text-lg font-mono font-bold text-on-surface border-b border-border pb-2">Audit Logs & Escrow Interventions</h3>
             <div className="space-y-4">
                <div className="p-4 bg-red-500/10 border border-red-500/20">
                   <div className="flex items-center gap-2 mb-2">
                     <AlertTriangle className="w-4 h-4 text-red-400" />
                     <span className="font-mono text-sm text-red-400 font-bold">Unmapped Claim Flagged (ID: a7b9-22f1)</span>
                   </div>
                   <p className="text-xs font-mono text-on-surface">Agent <span className="text-primary">nextjs-frontend-rag-agent</span> attempted to return a factual claim not present in the vector store context. Response blocked and quarantined.</p>
                </div>
                <div className="p-4 bg-surface border border-border">
                   <div className="flex items-center gap-2 mb-2">
                     <Shield className="w-4 h-4 text-on-surface-muted" />
                     <span className="font-mono text-sm text-on-surface font-bold">Schema Validation Passed (ID: c11d-88e2)</span>
                   </div>
                   <p className="text-xs font-mono text-on-surface-muted">All inbound requests correctly validated against DRP-SCOS-KIRA schema definitions.</p>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
