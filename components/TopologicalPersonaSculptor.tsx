'use client';

import { useState } from 'react';
import { UserCog, Loader2, AlertTriangle, ShieldAlert, Activity, CheckCircle2, Box } from 'lucide-react';
import { parseAIError } from '@/utils/errorHandling';

interface ExtrusionRequest {
  frictionData: string;
}

/**
 * A component for applying the DRP-PLURI-808-PERSONA-METROLOGY protocol.
 * Extrudes empirical operational friction into deterministic, mathematically bounded persona nodes.
 *
 * @returns {JSX.Element} The rendered persona sculptor component.
 */
export default function TopologicalPersonaSculptor() {
  const [frictionData, setFrictionData] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExtrudePersona = async () => {
    if (!frictionData.trim()) return;
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch('/api/persona-extrusion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ frictionData } as ExtrusionRequest),
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
          <UserCog className="w-8 h-8" />
          Topological Persona Causal Sculptor
        </h2>
        <p className="text-on-surface-muted font-mono text-sm uppercase tracking-widest">
          DRP-PLURI-808-PERSONA-METROLOGY // Semantic Metrology
        </p>
      </div>

      <div className="bg-surface border border-border rounded-none p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs font-mono text-on-surface-muted uppercase tracking-wider mb-2">
              Empirical Operational Friction (Raw Telemetry / Logs)
            </label>
            <textarea
              value={frictionData}
              onChange={(e) => setFrictionData(e.target.value)}
              placeholder="e.g., 'Radio log: Maintain maximal extraction yield but strictly adhere to zero-emission environmental mandates. The sensor shows...'"
              className="w-full h-32 bg-surface-raised border border-border rounded-none px-4 py-4 text-on-surface font-mono focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>
        </div>
        <div className="flex items-end justify-end mt-4">
            <button
              onClick={handleExtrudePersona}
              disabled={loading || !frictionData.trim()}
              className="h-[50px] px-8 bg-primary hover:bg-primary/80 text-on-primary font-mono rounded-none flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserCog className="w-5 h-5" />}
              EXTRUDE PERSONA
            </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-none mb-8 flex items-center gap-3 font-mono text-sm">
          <ShieldAlert className="w-5 h-5" />
          {error}
        </div>
      )}

      {results && (
        <div className="space-y-8 animate-fade-in">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-5 border rounded-none flex items-center justify-between ${results.miq > 0.85 ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
              <div>
                <h3 className="text-xs font-mono text-on-surface-muted uppercase tracking-wider mb-1">Martensite Initiation Quotient (MIQ)</h3>
                <p className={`text-2xl font-mono font-bold ${results.miq > 0.85 ? 'text-green-400' : 'text-red-400'}`}>
                  {results.miq.toFixed(4)}
                </p>
              </div>
              {results.miq > 0.85 ? <CheckCircle2 className="w-8 h-8 text-green-400 opacity-50" /> : <AlertTriangle className="w-8 h-8 text-red-400 opacity-50" />}
            </div>

            <div className={`p-5 border rounded-none flex items-center justify-between ${results.cfdi <= 1e-6 ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
              <div>
                <h3 className="text-xs font-mono text-on-surface-muted uppercase tracking-wider mb-1">Confidence-Fidelity Divergence (CFDI)</h3>
                <p className={`text-2xl font-mono font-bold ${results.cfdi <= 1e-6 ? 'text-green-400' : 'text-red-400'}`}>
                  {results.cfdi.toExponential(4)}
                </p>
              </div>
              {results.cfdi <= 1e-6 ? <CheckCircle2 className="w-8 h-8 text-green-400 opacity-50" /> : <AlertTriangle className="w-8 h-8 text-red-400 opacity-50" />}
            </div>
          </div>

          {results.pdt_specification_block && (
            <div className="bg-surface border border-border p-6 rounded-none">
              <h3 className="text-sm font-mono text-primary uppercase tracking-wider mb-4 border-b border-border pb-2 flex items-center gap-2">
                <Box className="w-4 h-4" /> PD&T Specification Block
              </h3>
              <div className="mb-4">
                <span className="text-xs font-mono text-on-surface-muted">PART_NAME: </span>
                <span className="text-sm font-mono text-on-surface font-bold">{results.pdt_specification_block.PART_NAME}</span>
              </div>
              <div className="space-y-4">
                {results.pdt_specification_block.FEATURES?.map((feature: any, i: number) => (
                  <div key={i} className="bg-surface-raised border border-border p-4">
                    <div className="text-xs font-mono text-primary mb-2">FEATURE ID: {feature.ID}</div>
                    <ul className="list-disc list-inside space-y-1">
                      {feature.SPEC.map((specLine: string, j: number) => (
                        <li key={j} className="text-sm font-mono text-on-surface-muted">{specLine}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.symbolic_scars && results.symbolic_scars.length > 0 && (
             <div className="bg-surface border border-border p-6 rounded-none">
                <h3 className="text-sm font-mono text-yellow-500 uppercase tracking-wider mb-4 border-b border-border pb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Symbolic Scar Tissue Archive (STA)
                </h3>
                <div className="space-y-4">
                  {results.symbolic_scars.map((scar: any, i: number) => (
                    <div key={i} className="p-4 border-l-2 border-yellow-500 bg-yellow-500/5">
                      <div className="flex gap-4 mb-2">
                        <span className="text-xs font-mono font-bold text-yellow-500">{scar.scar_id}</span>
                        <span className="text-xs font-mono text-on-surface-muted">{scar.archetype}</span>
                      </div>
                      <p className="text-sm font-sans text-on-surface mb-2">{scar.trigger_description}</p>
                      <div className="text-xs font-mono text-red-400 mb-1">DEVIATION: {scar.geometric_deviation}</div>
                      <div className="text-xs font-mono text-green-400">FIPI PATCH: {scar.fipi_patch}</div>
                    </div>
                  ))}
                </div>
             </div>
          )}

          {results.emergent_properties && results.emergent_properties.length > 0 && (
            <div className="bg-[#0D1B2A] border border-primary/50 p-6 rounded-none">
              <h3 className="text-sm font-mono text-primary uppercase tracking-wider mb-4">
                Emergent Pluriversal Concepts
              </h3>
              <div className="space-y-6">
                {results.emergent_properties.map((prop: any, i: number) => (
                  <div key={i} className="space-y-2">
                    <div className="text-sm font-mono font-bold text-zinc-100">{prop.concept_name}</div>
                    <div className="text-xs font-mono text-primary/70">
                      BLEND: [{prop.input_blend_1}] × [{prop.input_blend_2}]
                    </div>
                    <p className="text-sm font-sans text-zinc-300 leading-relaxed">
                      {prop.emergent_property}
                    </p>
                    <div className="text-xs font-mono text-on-surface-muted border-t border-border/30 pt-2">
                      <span className="text-yellow-500/70">ABDUCED NEED:</span> {prop.abduced_user_need}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
