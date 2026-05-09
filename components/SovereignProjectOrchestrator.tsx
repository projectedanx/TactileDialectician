'use client';

import { useState } from 'react';
import { Loader2, AlertTriangle, ShieldAlert, CheckCircle2, Box, FileText, ClipboardList } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { parseAIError, logSymbolicScar } from '../utils/errorHandling';
import { ContradictionPayload } from '../types/escrow';

interface OrchestrationRequest {
  stakeholderNarrative: string;
}

/**
 * A component representing the Sovereign Project Management Orchestrator.
 * Navigates stakeholder dissonance by calculating Topological Derivatives.
 *
 * @returns {JSX.Element} The rendered project orchestrator component.
 */
export default function SovereignProjectOrchestrator() {
  const [stakeholderNarrative, setStakeholderNarrative] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const handleSendToEscrow = () => {
    if (!results) return;
    const payload: ContradictionPayload = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      source: 'SovereignProjectOrchestrator',
      narrative: stakeholderNarrative,
      crs: results.contradiction_retention_score,
      derivative: results.topological_derivative,
      status: 'pending',
      dominantWeight: 1.618,
      subordinateWeight: 1.000
    };
    logSymbolicScar('FAILED_NLI_CONTRADICTION', payload, 0.4);
    // Ideally, we'd use a global state or event to update the Escrow Dashboard,
    // but for now, logging it is the primary deterministic action.
    alert('Contradiction sent to Epistemic Escrow. Check the Escrow Dashboard.');
  };

  const sanitizeSchema = {
    ...defaultSchema,
    tagNames: [...(defaultSchema.tagNames || []), 'math', 'mi', 'mn', 'mo', 'ms', 'mspace', 'mtext', 'menclose', 'merror', 'mfenced', 'mfrac', 'mglyph', 'mi', 'mlabeledtr', 'mmultiscripts', 'mn', 'mo', 'mover', 'mpadded', 'mphantom', 'mroot', 'mrow', 'ms', 'mspace', 'msqrt', 'mstyle', 'msub', 'msubsup', 'msup', 'mtable', 'mtd', 'mtext', 'mtr', 'munder', 'munderover', 'semantics', 'annotation', 'annotation-xml'],
    attributes: {
      ...defaultSchema.attributes,
      div: [...(defaultSchema.attributes?.div || []), 'className'],
      span: [...(defaultSchema.attributes?.span || []), 'className'],
      math: ['xmlns', 'display'],
      annotation: ['encoding'],
    },
  };

  const handleOrchestrate = async () => {
    if (!stakeholderNarrative.trim()) return;
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch('/api/orchestrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stakeholderNarrative } as OrchestrationRequest),
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
          <ClipboardList className="w-8 h-8" />
          Sovereign Project Management Orchestrator
        </h2>
        <p className="text-on-surface-muted font-mono text-sm uppercase tracking-widest">
          Strategic Integration Project Manager // DRP-2026
        </p>
      </div>

      <div className="bg-surface border border-border rounded-none p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs font-mono text-on-surface-muted uppercase tracking-wider mb-2">
              Stakeholder Narrative / Conflict
            </label>
            <textarea
              value={stakeholderNarrative}
              onChange={(e) => setStakeholderNarrative(e.target.value)}
              placeholder="e.g., 'Stakeholder A demands continuous deployment (Extractive Sprint), but Stakeholder B insists on quarterly releases to accommodate neurodivergent temporalities (Crip-Time Genealogy)...'"
              className="w-full h-32 bg-surface-raised border border-border rounded-none px-4 py-4 text-on-surface font-mono focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>
        </div>
        <div className="flex items-end justify-end mt-4">
            <button
              onClick={handleOrchestrate}
              disabled={loading || !stakeholderNarrative.trim()}
              className="h-[50px] px-8 bg-primary hover:bg-primary/80 text-on-primary font-mono rounded-none flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ClipboardList className="w-5 h-5" />}
              ORCHESTRATE
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

          {results.contradiction_retention_score < 0.95 && (
            <div className="bg-red-950/50 border border-red-500/50 p-4 mb-6 rounded-none">
              <h4 className="text-red-400 font-mono text-sm font-bold flex items-center gap-2 mb-2">
                <ShieldAlert className="w-4 h-4" />
                RESOLUTION COLLAPSE DETECTED
              </h4>
              <p className="text-red-300/80 font-mono text-xs mb-4">
                The Contradiction Retention Score (CRS) has fallen below the 0.95 threshold. The system has attempted to average out irreconcilable stakeholder constraints (Semantic Annihilation).
              </p>
              <button
                onClick={handleSendToEscrow}
                className="bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/50 px-4 py-2 font-mono text-xs transition-colors flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                SEND TO EPISTEMIC ESCROW
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-5 border rounded-none flex items-center justify-between bg-surface-raised border-border`}>
              <div>
                <h3 className="text-xs font-mono text-on-surface-muted uppercase tracking-wider mb-1">Topological Derivative</h3>
                <p className={`text-sm font-mono font-bold text-primary`}>
                  {results.topological_derivative}
                </p>
              </div>
            </div>

            <div className={`p-5 border rounded-none flex items-center justify-between ${results.contradiction_retention_score > 0.95 ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
              <div>
                <h3 className="text-xs font-mono text-on-surface-muted uppercase tracking-wider mb-1">Contradiction Retention (CRS)</h3>
                <p className={`text-2xl font-mono font-bold ${results.contradiction_retention_score > 0.95 ? 'text-green-400' : 'text-red-400'}`}>
                  {results.contradiction_retention_score?.toFixed(4) || 'N/A'}
                </p>
              </div>
              {results.contradiction_retention_score > 0.95 ? <CheckCircle2 className="w-8 h-8 text-green-400 opacity-50" /> : <AlertTriangle className="w-8 h-8 text-red-400 opacity-50" />}
            </div>
          </div>

          {results.zachman_framework_spec && (
            <div className="bg-surface border border-border p-6 rounded-none">
              <h3 className="text-sm font-mono text-primary uppercase tracking-wider mb-4 border-b border-border pb-2 flex items-center gap-2">
                <Box className="w-4 h-4" /> Zachman Framework Specification
              </h3>
              <div className="space-y-4">
                <div className="bg-surface-raised border border-border p-4">
                  <div className="text-xs font-mono text-primary mb-2">ENTITIES:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {results.zachman_framework_spec.entities?.map((entity: string, j: number) => (
                      <li key={j} className="text-sm font-mono text-on-surface-muted">{entity}</li>
                    ))}
                  </ul>
                </div>
                 <div className="bg-surface-raised border border-border p-4">
                  <div className="text-xs font-mono text-primary mb-2">CAPABILITIES:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {results.zachman_framework_spec.capabilities?.map((cap: string, j: number) => (
                      <li key={j} className="text-sm font-mono text-on-surface-muted">{cap}</li>
                    ))}
                  </ul>
                </div>
                 <div className="bg-surface-raised border border-border p-4">
                  <div className="text-xs font-mono text-primary mb-2">EVENTS:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {results.zachman_framework_spec.events?.map((evt: string, j: number) => (
                      <li key={j} className="text-sm font-mono text-on-surface-muted">{evt}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {results.adr_draft && (
            <div className="bg-surface border border-border p-6 rounded-none">
              <h3 className="text-sm font-mono text-yellow-500 uppercase tracking-wider mb-4 border-b border-border pb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Architecture Decision Record (ADR)
              </h3>
              <div className="prose prose-invert max-w-none text-sm font-sans text-on-surface-muted leading-relaxed">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex, [rehypeSanitize, sanitizeSchema]]}
                  >
                    {results.adr_draft}
                  </ReactMarkdown>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
