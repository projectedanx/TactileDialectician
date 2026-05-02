'use client';

import { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, Activity, DatabaseZap, CheckCircle } from 'lucide-react';
import { SymbolicScar } from '@/utils/errorHandling';

// Extend SymbolicScar to handle our UI state for Golden Scar
interface UI_SymbolicScar extends SymbolicScar {
  goldenScarApplied?: boolean;
}

export default function EpistemicEscrowDashboard() {
  const [scars, setScars] = useState<UI_SymbolicScar[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // We are on client
    setIsClient(true);
    const loadedScars = localStorage.getItem('symbolic_scars');
    if (loadedScars) {
      try {
        const parsed = JSON.parse(loadedScars);
        setScars(parsed);
      } catch (e) {
        console.error("Failed to parse scars", e);
      }
    }
  }, []);

  const handleAnneal = (id: string) => {
    const remaining = scars.filter(s => s.id !== id);
    setScars(remaining);
    localStorage.setItem('symbolic_scars', JSON.stringify(remaining));
  };

  const handleHoldInTension = (id: string) => {
    const updated = scars.map(s => {
      if (s.id === id) {
        return { ...s, goldenScarApplied: true };
      }
      return s;
    });
    setScars(updated);
    localStorage.setItem('symbolic_scars', JSON.stringify(updated));
  };

  if (!isClient) return null; // Prevent hydration mismatch

  return (
    <div className="p-8 max-w-6xl mx-auto h-full overflow-y-auto">
      <div className="mb-8 border-b border-border pb-4">
        <h2 className="text-display-lg font-mono font-bold text-primary mb-2 flex items-center gap-3">
          <DatabaseZap className="w-8 h-8" />
          Epistemic Escrow
        </h2>
        <p className="text-on-surface-muted font-mono text-sm uppercase tracking-widest">
          Symbolic Scar Tissue Archive // Paraconsistent Tension Management
        </p>
      </div>

      {scars.length === 0 ? (
        <div className="bg-surface border border-border p-12 flex flex-col items-center justify-center text-center">
          <ShieldAlert className="w-12 h-12 text-on-surface-muted mb-4 opacity-50" />
          <h3 className="text-label font-mono text-primary uppercase tracking-widest">No topological drift detected</h3>
          <p className="text-sm font-mono text-on-surface-muted mt-2 max-w-md">
            The epistemic boundaries are stable. No irreconcilable contradictions or symbolic parsing faults are currently held in escrow.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {scars.map((scar) => (
            <div
              key={scar.id}
              className={`bg-surface border p-6 flex flex-col relative overflow-hidden ${
                scar.goldenScarApplied
                  ? 'border-yellow-500/50 bg-yellow-500/5'
                  : 'border-red-500/30'
              }`}
            >
              {scar.goldenScarApplied && (
                 <div className="absolute top-0 right-0 p-2 bg-yellow-500/20 border-l border-b border-yellow-500/30">
                    <span className="text-xs font-mono font-bold text-yellow-500 flex items-center gap-1">
                       <CheckCircle className="w-3 h-3"/> TENSION HELD (Φ)
                    </span>
                 </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className={`w-4 h-4 ${scar.goldenScarApplied ? 'text-yellow-500' : 'text-red-400'}`} />
                    <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">{scar.eventType}</span>
                  </div>
                  <span className="text-[10px] font-mono text-on-surface-muted">{scar.id} {/* // */} {new Date(scar.timestamp).toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-surface-raised border border-border p-3 mb-4 flex-1">
                 <p className="text-xs font-mono text-on-surface-muted break-words">
                   {typeof scar.rawError === 'object' ? JSON.stringify(scar.rawError) : String(scar.rawError)}
                 </p>
              </div>

              <div className="flex items-center justify-between mt-auto">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-on-surface-muted uppercase">MRS (Recoverability)</span>
                    <span className="text-sm font-mono text-primary font-bold">{scar.mutationRecoverabilityScore.toFixed(2)}</span>
                 </div>

                 <div className="flex gap-3">
                   {!scar.goldenScarApplied && (
                     <button
                        onClick={() => handleHoldInTension(scar.id)}
                        className="px-4 py-2 text-xs font-mono border border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10 transition-colors"
                     >
                        HOLD IN TENSION (Φ)
                     </button>
                   )}
                   <button
                      onClick={() => handleAnneal(scar.id)}
                      className="px-4 py-2 text-xs font-mono border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors"
                   >
                      ANNEAL (DEBRIDE)
                   </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
