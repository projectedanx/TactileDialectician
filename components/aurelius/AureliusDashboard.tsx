"use client";

import React, { useState } from 'react';
import { PhantomDimensionRouter, GeometricConstraint } from '@/lib/project_aurelius/PhantomDimensionRouter';
import { AgenticPlausibilityOracle, ValidationMetrics } from '@/lib/project_aurelius/AgenticPlausibilityOracle';
import { ProvenanceTracker, ProvenanceVector } from '@/lib/project_aurelius/ProvenanceTracker';

/**
 * The main dashboard component for Project Aurelius.
 * Provides views for the Phantom Dimension Router, Provenance Tracker, and Agentic Plausibility Oracle.
 *
 * @returns {JSX.Element} The rendered Aurelius Dashboard component.
 */
export default function AureliusDashboard() {
  const [topology, setTopology] = useState<GeometricConstraint['topology']>('Euclidean');
  const [curvature, setCurvature] = useState<number>(0);
  const [intent, setIntent] = useState<string>('Generate a dodecahedron room');
  const [metrics, setMetrics] = useState<ValidationMetrics | null>(null);

  const initialProvenance: ProvenanceVector[] = [
      { sourceDomain: 'synthetic_pbr_dataset', weight: 0.8, driftPotential: 0.1 },
      { sourceDomain: 'historical_art_archives', weight: 0.4, driftPotential: 0.6 },
      { sourceDomain: 'non_euclidean_math_texts', weight: 0.9, driftPotential: 0.2 },
  ];

  const [tracker] = useState(() => new ProvenanceTracker(initialProvenance));
  const [drift, setDrift] = useState<number>(tracker.calculateSemanticDrift());

  const handleSculpt = () => {
    const constraint: GeometricConstraint = {
        topology,
        curvature,
        manifoldDimension: 4
    };

    const config = PhantomDimensionRouter.routeConstraint(constraint, intent);
    const result = AgenticPlausibilityOracle.evaluateConfiguration(config);
    setMetrics(result);
    setDrift(tracker.calculateSemanticDrift());
  };

  return (
    <div className="p-8 bg-surface rounded-lg border border-border/50 text-foreground space-y-6">
      <h2 className="text-2xl font-bold font-serif text-primary">Project Aurelius: Causal Sculptor</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary">Topological Constraints</h3>

              <div>
                  <label className="block text-sm text-muted-foreground mb-1">Human Intent (The &quot;Why&quot;)</label>
                  <input
                    type="text"
                    value={intent}
                    onChange={(e) => setIntent(e.target.value)}
                    className="w-full bg-background border border-border rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
              </div>

              <div>
                  <label className="block text-sm text-muted-foreground mb-1">Manifold Topology</label>
                  <select
                    value={topology}
                    onChange={(e) => setTopology(e.target.value as GeometricConstraint['topology'])}
                    className="w-full bg-background border border-border rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                      <option value="Euclidean">Euclidean (Flat)</option>
                      <option value="Hyperbolic">Hyperbolic (Saddle)</option>
                      <option value="Spherical">Spherical (Closed)</option>
                      <option value="Riemannian">Riemannian (Variable)</option>
                  </select>
              </div>

              <div>
                  <label className="block text-sm text-muted-foreground mb-1">Curvature Tensor Modifier: {curvature}</label>
                  <input
                    type="range"
                    min="-2"
                    max="2"
                    step="0.1"
                    value={curvature}
                    onChange={(e) => setCurvature(parseFloat(e.target.value))}
                    className="w-full accent-primary"
                  />
              </div>

              <button
                onClick={handleSculpt}
                className="bg-primary text-primary-foreground px-4 py-2 rounded font-medium hover:opacity-90 transition-opacity"
              >
                  Initiate Reflexive Sculpting
              </button>
          </div>

          <div className="space-y-4 bg-background p-4 rounded border border-border">
              <h3 className="text-lg font-semibold text-secondary">Agentic Plausibility Oracle</h3>

              {metrics ? (
                  <div className="space-y-3">
                      <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Physical Plausibility Score:</span>
                          <span className={`font-mono ${metrics.physicalPlausibilityScore > 0.7 ? 'text-green-500' : 'text-red-500'}`}>
                              {metrics.physicalPlausibilityScore.toFixed(2)}
                          </span>
                      </div>
                      <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Geometric Adherence Score:</span>
                          <span className={`font-mono ${metrics.geometricAdherenceScore > 0.7 ? 'text-green-500' : 'text-red-500'}`}>
                              {metrics.geometricAdherenceScore.toFixed(2)}
                          </span>
                      </div>
                      <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">System Semantic Drift:</span>
                          <span className="font-mono text-yellow-500">
                              {drift.toFixed(2)}
                          </span>
                      </div>

                      {metrics.dissonanceIdentified.length > 0 && (
                          <div className="mt-4 p-3 bg-red-950/20 border border-red-500/30 rounded">
                              <h4 className="text-xs font-bold text-red-400 mb-2">Epistemic Dissonance Log:</h4>
                              <ul className="text-xs space-y-1 text-red-300 font-mono">
                                  {metrics.dissonanceIdentified.map((log, i) => (
                                      <li key={i}>{log}</li>
                                  ))}
                              </ul>
                          </div>
                      )}
                  </div>
              ) : (
                  <div className="text-sm text-muted-foreground italic h-full flex items-center justify-center">
                      Awaiting topology definition...
                  </div>
              )}
          </div>
      </div>
    </div>
  );
}
