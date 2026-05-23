'use client';

import { useState } from 'react';
import { Users, Loader2, AlertTriangle, ShieldAlert, Activity, CheckCircle2, Box, HeartPulse } from 'lucide-react';
import { parseAIError } from '@/utils/errorHandling';

interface RelationalRequest {
  sprintPlan: string;
}

export default function RelationalSovereigntyEngine() {
  const [sprintPlan, setSprintPlan] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleProcess = async () => {
    if (!sprintPlan.trim()) return;
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch('/api/relational-sovereignty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sprintPlan } as RelationalRequest),
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
          <HeartPulse className="w-8 h-8" />
          Relational Sovereignty Engine
        </h2>
        <p className="text-on-surface-muted font-mono text-sm uppercase tracking-widest">
          DRP-SCOS-PERSONA-METROLOGY // Extractive Sprint Critique & Crip-Time Lenses
        </p>
      </div>

      <div className="bg-surface border border-border rounded-none p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs font-mono text-on-surface-muted uppercase tracking-wider mb-2">
              Traditional Sprint Plan / Agile Metrics
            </label>
            <textarea
              value={sprintPlan}
              onChange={(e) => setSprintPlan(e.target.value)}
              placeholder="e.g., 'Two-week sprint cycle. Target velocity: 50 story points. All tickets must be merged by 5PM Friday to accommodate follow-the-sun offshore handover...'"
              className="w-full h-32 bg-surface-raised border border-border rounded-none px-4 py-4 text-on-surface font-mono focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>
        </div>
        <div className="flex items-end justify-end mt-4">
            <button
              onClick={handleProcess}
              disabled={loading || !sprintPlan.trim()}
              className="h-[50px] px-8 bg-primary hover:bg-primary/80 text-on-primary font-mono rounded-none flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Users className="w-5 h-5" />}
              APPLY RELATIONAL LENSES
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

          {results.hickam_orientation && (
            <div className="bg-surface border border-border p-4 rounded-none mb-6">
               <div className="text-xs font-mono text-primary uppercase tracking-wider mb-2">Hickam Orientation Block</div>
               <p className="text-sm font-sans text-on-surface-muted">{results.hickam_orientation}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-5 border rounded-none flex flex-col justify-between ${results.relational_ecosystem_roadmap?.cognitive_rhythm_index >= 0.7 ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
              <div>
                <h3 className="text-xs font-mono text-on-surface-muted uppercase tracking-wider mb-1">Cognitive Rhythm Index</h3>
                <p className={`text-2xl font-mono font-bold ${results.relational_ecosystem_roadmap?.cognitive_rhythm_index >= 0.7 ? 'text-green-400' : 'text-red-400'}`}>
                  {results.relational_ecosystem_roadmap?.cognitive_rhythm_index?.toFixed(2)}
                </p>
                <p className="text-xs font-mono text-on-surface-muted mt-2">
                  Measures accommodation for diverse temporalities and neurodivergent rhythms.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border p-6 rounded-none">
             <h3 className="text-sm font-mono text-yellow-500 uppercase tracking-wider mb-4 border-b border-border pb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Extractive Sprint Analysis
             </h3>
             <p className="text-sm font-sans text-on-surface leading-relaxed">
               {results.extractive_sprint_analysis}
             </p>
          </div>

          {results.crip_time_adaptations && (
             <div className="bg-surface border border-border p-6 rounded-none">
                <h3 className="text-sm font-mono text-primary uppercase tracking-wider mb-4 border-b border-border pb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Crip-Time Adaptations
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  {results.crip_time_adaptations.map((adaptation: string, i: number) => (
                    <li key={i} className="text-sm font-mono text-on-surface-muted">{adaptation}</li>
                  ))}
                </ul>
             </div>
          )}

          {results.relational_ecosystem_roadmap && (
            <div className="bg-surface border border-border p-6 rounded-none">
              <h3 className="text-sm font-mono text-primary uppercase tracking-wider mb-4 border-b border-border pb-2 flex items-center gap-2">
                <Box className="w-4 h-4" /> Relational Ecosystem Roadmap
              </h3>

              <div className="space-y-6">
                <div className="bg-surface-raised border border-border p-4">
                  <div className="text-xs font-mono text-primary mb-2">SUSTAINABLE CYCLES:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {results.relational_ecosystem_roadmap.sustainable_cycles?.map((cycle: string, j: number) => (
                      <li key={j} className="text-sm font-mono text-on-surface-muted">{cycle}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-surface-raised border border-border p-4">
                  <div className="text-xs font-mono text-primary mb-2">NETWORK HEALTH METRICS:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {results.relational_ecosystem_roadmap.network_health_metrics?.map((metric: string, j: number) => (
                      <li key={j} className="text-sm font-mono text-on-surface-muted">{metric}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {results.verification_checklist && (
            <div className="bg-surface-raised border border-border p-4 rounded-none mt-6">
               <div className="text-xs font-mono text-primary uppercase tracking-wider mb-2">Verification Checklist</div>
               <ul className="list-disc list-inside space-y-1">
                 {results.verification_checklist.map((item: string, i: number) => (
                   <li key={i} className="text-sm font-mono text-on-surface-muted">{item}</li>
                 ))}
               </ul>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
