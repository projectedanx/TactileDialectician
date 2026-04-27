'use client';

import { useState } from 'react';
import { Network, Loader2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { parseAIError } from '@/utils/errorHandling';

interface MiningRequest {
  query: string;
}

/**
 * The Lexical Topology Engine (DRP-LEX-MINE-2026).
 * Computes thermodynamic constraints and non-Euclidean routing vectors of target concepts.
 */
export default function LexicalTopologyMiner() {
  const [query, setQuery] = useState('');


  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMineTopology = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch('/api/topology', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query } as MiningRequest),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const parsed = await response.json();
      setResults(parsed);

    } catch (err: any) {
      setError(parseAIError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto h-full overflow-y-auto">
      <div className="mb-8 border-b border-border pb-4">
        <h2 className="text-display-lg font-mono font-bold text-primary mb-2 flex items-center gap-3">
          <Network className="w-8 h-8" />
          Lexical Topology Miner
        </h2>
        <p className="text-on-surface-muted font-mono text-sm uppercase tracking-widest">
          DRP-LEX-MINE-2026 // Semiotic Metrology
        </p>
      </div>

      <div className="bg-surface border border-border rounded-none p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs font-mono text-on-surface-muted uppercase tracking-wider mb-2">
              Target Concept / Lexical Manifold
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Autocatalysis, Entropy, Attention..."
              className="w-full bg-surface-raised border border-border rounded-none px-4 py-4 text-on-surface font-mono focus:outline-none focus:border-primary transition-colors"
              onKeyDown={(e) => e.key === 'Enter' && handleMineTopology()}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleMineTopology}
              disabled={loading || !query.trim()}
              className="h-[50px] px-8 bg-primary hover:bg-primary/80 text-on-primary font-mono rounded-none flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Network className="w-5 h-5" />}
              COMPUTE TOPOLOGY
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-none mb-8 flex items-center gap-3 font-mono text-sm">
          <ShieldAlert className="w-5 h-5" />
          {error}
        </div>
      )}

      {results && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface border border-border p-5 rounded-none">
              <h3 className="text-xs font-mono text-primary uppercase tracking-wider mb-3">Semantic Drift</h3>
              <p className="text-sm font-sans text-on-surface leading-relaxed">{results.semantic_drift}</p>
            </div>
            <div className="bg-surface border border-border p-5 rounded-none">
              <h3 className="text-xs font-mono text-primary uppercase tracking-wider mb-3">Connotation Vectors</h3>
              <p className="text-sm font-sans text-on-surface leading-relaxed">{results.connotation_vectors}</p>
            </div>
            <div className="bg-surface border border-border p-5 rounded-none">
              <h3 className="text-xs font-mono text-primary uppercase tracking-wider mb-3">Semiotic Blind Spots</h3>
              <p className="text-sm font-sans text-on-surface leading-relaxed">{results.semiotic_blind_spots}</p>
            </div>
            <div className="bg-surface border border-border p-5 rounded-none">
              <h3 className="text-xs font-mono text-yellow-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Ambiguity Zones (Epistemic Escrow)
              </h3>
              <p className="text-sm font-sans text-on-surface leading-relaxed">{results.ambiguity_zones}</p>
            </div>
          </div>

          <div className="bg-surface border border-border p-6 rounded-none">
            <h3 className="text-sm font-mono text-primary uppercase tracking-wider mb-4 border-b border-border pb-2">
              Isomorphisms of Friction
            </h3>
            <div className="space-y-4">
              { }
              {results.isomorphisms_of_friction?.map((iso: any, i: number) => (
                <div key={i} className="flex flex-col md:flex-row gap-4 p-4 bg-surface-raised border border-border">
                  <div className="flex-1 font-mono text-xs text-on-surface-muted">
                    <span className="text-primary">DOMAIN A:</span> {iso.domain_a}
                  </div>
                  <div className="flex-[2] font-sans text-sm text-on-surface text-center">
                    <span className="font-bold text-yellow-500 mx-2">↔</span>
                    {iso.latent_bridge}
                    <span className="font-bold text-yellow-500 mx-2">↔</span>
                  </div>
                  <div className="flex-1 font-mono text-xs text-on-surface-muted text-right">
                    <span className="text-primary">DOMAIN B:</span> {iso.domain_b}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0D1B2A] border border-primary/50 p-6 rounded-none">
            <h3 className="text-sm font-mono text-primary uppercase tracking-wider mb-3">
              Pluriversal Knowledge Capsule
            </h3>
            <p className="text-base font-sans text-zinc-100 leading-relaxed">
              {results.pluriversal_knowledge_capsule}
            </p>
          </div>

          {results.topological_obstructions && (
             <div className="bg-red-950/30 border border-red-500/50 p-5 rounded-none">
                <h3 className="text-xs font-mono text-red-400 uppercase tracking-wider mb-2">Topological Obstructions Detected</h3>
                <p className="text-sm font-sans text-on-surface">{results.topological_obstructions}</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
}
