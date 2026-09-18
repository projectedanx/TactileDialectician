'use client';

import React, { useState } from 'react';
import {
  Network,
  Cpu,
  Play,
  Copy,
  Check,
  AlertTriangle,
  Fingerprint,
  SplitSquareHorizontal,
  Loader2
} from 'lucide-react';
import { useAtomicTokenization, TokenAnalysis } from '@/hooks/useAtomicTokenization';

export default function AtomicTokenizationModule() {
  const [inputMode, setInputMode] = useState<'extract' | 'list'>('extract');
  const [input, setInput] = useState('∇·F = ρ/ε₀ + ∂E/∂t');
  const [domainContext, setDomainContext] = useState('Auto');
  const [copied, setCopied] = useState(false);

  const { results, loading, error, analyze, removeResult } = useAtomicTokenization();

  const handleAnalyze = async () => {
    await analyze(input, inputMode, domainContext);
  };

  const handleCopyPayload = () => {
    if (!translationPayload) return;
    navigator.clipboard.writeText(JSON.stringify(translationPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateTranslationPayload = () => {
    if (results.length === 0) return null;
    return {
      protocol: "FoNE_v1",
      domain_context: domainContext,
      semantic_map: results.reduce((acc, res) => {
        acc[res.symbol] = {
          id: res.atomic_token_id,
          class: res.fone_embedding.operator_class,
          topology: res.fone_embedding.latent_topological_pathway,
          vw3: res.fone_embedding.virtual_weight_3
        };
        return acc;
      }, {} as Record<string, any>)
    };
  };

  const translationPayload = generateTranslationPayload();

  const standardTokenCount = results.reduce((acc, res) => acc + res.fragmented_bytes.length, 0);
  const atomicTokenCount = results.length;
  const efficiencyGain = standardTokenCount > 0
    ? Math.round(((standardTokenCount - atomicTokenCount) / standardTokenCount) * 100)
    : 0;

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-mono text-primary flex items-center gap-2">
            <Cpu className="w-5 h-5" />
            Atomic Tokenization Engine
          </h2>
          <p className="text-sm font-mono text-on-surface-muted mt-1">
            Preventing Mathematical Aphasia via Semantic Sub-word Anchoring
          </p>
        </div>
      </div>

      <div className="bg-surface border border-border p-6 rounded-none mb-8 shadow-2xl">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-[10px] font-mono text-primary uppercase tracking-widest mb-2">
              Input Mode
            </label>
            <div className="flex border border-border rounded-none overflow-hidden">
              <button
                className={`flex-1 py-2 px-4 text-xs font-mono transition-colors ${inputMode === 'extract' ? 'bg-primary/20 text-primary border-b-2 border-primary' : 'bg-surface text-on-surface-muted hover:bg-surface-raised'}`}
                onClick={() => setInputMode('extract')}
              >
                Extract from Expression
              </button>
              <button
                className={`flex-1 py-2 px-4 text-xs font-mono transition-colors ${inputMode === 'list' ? 'bg-primary/20 text-primary border-b-2 border-primary' : 'bg-surface text-on-surface-muted hover:bg-surface-raised'}`}
                onClick={() => setInputMode('list')}
              >
                Comma-Separated List
              </button>
            </div>
          </div>
          <div className="flex-1 md:max-w-[200px]">
             <label className="block text-[10px] font-mono text-primary uppercase tracking-widest mb-2">
              Domain Context
            </label>
            <select
              className="w-full bg-[#1a1a1a] border border-border text-on-surface p-2 text-sm font-mono focus:outline-none focus:border-primary rounded-none"
              value={domainContext}
              onChange={(e) => setDomainContext(e.target.value)}
            >
              <option value="Auto">Auto-Detect</option>
              <option value="Physics">Physics</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Machine Learning">Machine Learning</option>
              <option value="Chemistry">Chemistry</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-[10px] font-mono text-primary uppercase tracking-widest mb-2">
            {inputMode === 'extract' ? 'Raw Expression' : 'Symbol List'}
          </label>
          <textarea
            className="w-full bg-[#1a1a1a] border border-border text-on-surface p-4 text-sm font-mono focus:outline-none focus:border-primary min-h-[100px] resize-y rounded-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={inputMode === 'extract' ? "e.g., ∇·F = ρ/ε₀ + ∂E/∂t" : "e.g., ∇, ε₀, ∂"}
          />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/50 rounded-none flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-error shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-mono text-error font-bold mb-1">Tokenization Engine Failure</h3>
              <p className="text-sm font-mono text-error/90 mb-2">{error.message}</p>
              {error.suggestions && error.suggestions.length > 0 && (
                <ul className="list-disc list-inside text-xs font-mono text-error/70">
                  {error.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={loading || !input.trim()}
            className="group relative flex items-center gap-2 px-6 py-3 bg-primary text-background font-mono text-sm uppercase tracking-wider hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-none overflow-hidden transition-all"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            {loading ? 'Synthesizing...' : 'Generate Profile'}
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-mono text-on-surface-muted uppercase tracking-wider mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4" /> Martensite Metric: Topological Density
          </h3>
          <div className="bg-surface-raised border border-border p-6 rounded-none relative overflow-hidden">
             <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none">
                <Network className="w-32 h-32" />
             </div>
            <div className="grid grid-cols-3 gap-6 relative z-10">
              <div className="bg-surface border border-border p-4 rounded-none flex flex-col items-center justify-center">
                <span className="text-[10px] font-mono text-on-surface-muted uppercase mb-1">Standard Tokens</span>
                <span className="text-2xl font-mono text-error">{standardTokenCount}</span>
              </div>
              <div className="bg-surface border border-border p-4 rounded-none flex flex-col items-center justify-center">
                <span className="text-[10px] font-mono text-on-surface-muted uppercase mb-1">Atomic Tokens</span>
                <span className="text-2xl font-mono text-primary">{atomicTokenCount}</span>
              </div>
              <div className="bg-surface border border-border p-4 rounded-none flex flex-col items-center justify-center">
                <span className="text-[10px] font-mono text-on-surface-muted uppercase mb-1">Efficiency Gain</span>
                <span className="text-2xl font-mono text-primary">+{efficiencyGain}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {translationPayload && (
        <div className="mb-8 bg-surface border border-border rounded-none p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-mono text-on-surface uppercase tracking-wider">Translation Proxy Payload</h3>
            </div>
            <button aria-label="Copy JSON Payload" onClick={handleCopyPayload}
              className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] border border-[#444] rounded-none text-xs font-mono text-on-surface transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Payload'}
            </button>
          </div>
          <p className="text-xs font-mono text-on-surface-muted mb-4">
            Use this structured, token-efficient payload to communicate with primary generation models, bypassing their flawed native tokenization for complex math symbols.
          </p>
          <div className="bg-surface border border-border rounded-none p-4 overflow-x-auto">
            <pre className="text-xs font-mono text-on-surface">
              {JSON.stringify(translationPayload, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-sm font-mono text-on-surface-muted uppercase tracking-wider mb-4 flex justify-between items-center">
            <span>Tokenization & Embedding Profiles</span>
            <button
               onClick={() => {}}
               className="text-[10px] text-error hover:text-error/80 uppercase tracking-widest flex items-center gap-1"
               aria-label="Clear all tokenization profiles"
            >
                [ Clear All ]
            </button>
          </h3>
          
          {results.map((res, idx) => (
            <div key={idx} className="bg-surface border border-border rounded-none overflow-hidden shadow-2xl flex flex-col lg:flex-row relative">
              
              <button
                onClick={() => removeResult(res.atomic_token_id)}
                className="absolute top-2 right-2 text-on-surface-muted hover:text-error transition-colors p-1"
                aria-label={`Remove token profile for ${res.symbol}`}
              >
                ✕
              </button>

              {/* Symbol Display */}
              <div className="lg:w-48 bg-surface p-6 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-border">
                <span className="text-6xl font-serif text-primary mb-4 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">{res.symbol}</span>
                <div className="text-xs font-mono text-on-surface-muted uppercase tracking-widest">Target Symbol</div>
              </div>

              {/* Tokenization Comparison */}
              <div className="flex-1 p-6 border-b lg:border-b-0 lg:border-r border-border flex flex-col justify-center">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <SplitSquareHorizontal className="w-4 h-4 text-error" />
                    <h4 className="text-xs font-mono text-on-surface-muted uppercase tracking-wider">Standard BPE (Fragmented)</h4>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {res.fragmented_bytes.map((byte, i) => (
                      <div key={i} className="px-4 py-2 bg-error/10 border border-error/30 text-error font-mono text-sm rounded-none">
                        {byte}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-zinc-600 font-mono mt-2">Loss of atomic semantic meaning.</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Fingerprint className="w-4 h-4 text-primary" />
                    <h4 className="text-xs font-mono text-on-surface-muted uppercase tracking-wider">Atomic Tokenization</h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-primary/10 border border-primary/50 text-on-surface font-mono text-sm rounded-none shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                      {res.symbol}
                    </div>
                    <span className="text-on-surface-muted font-mono text-sm">→</span>
                    <div className="px-4 py-2 bg-[#2a2a2a] border border-border text-on-surface font-mono text-sm rounded-none">
                      ID: {res.atomic_token_id}
                    </div>
                  </div>
                </div>
              </div>

              {/* FoNE Embedding Profile */}
              <div className="flex-1 p-6 bg-surface-raised">
                <div className="flex items-center gap-2 mb-4">
                  <Network className="w-4 h-4 text-primary" />
                  <h4 className="text-xs font-mono text-on-surface-muted uppercase tracking-wider">FoNE Semantic Embedding</h4>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[10px] font-mono text-on-surface-muted uppercase mb-1">Operator Class</div>
                      <div className="text-sm font-mono text-on-surface bg-primary/10 border border-primary/20 px-2 py-1 rounded inline-block">
                        {res.fone_embedding.operator_class}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-on-surface-muted uppercase mb-1">Tensor Rank Effect</div>
                      <div className="text-sm font-mono text-on-surface bg-primary/10 border border-primary/20 px-2 py-1 rounded inline-block">
                        {res.fone_embedding.tensor_rank_effect}
                      </div>

                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border">
                    <div className="text-[10px] font-mono text-on-surface-muted uppercase mb-2">Paraconsistent Topology (VW3)</div>

                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-16 text-[10px] font-mono text-on-surface-muted">VW3 Factor</div>
                      <div className="flex-1 h-1.5 bg-surface rounded-none overflow-hidden border border-fuchsia-500/20">
                        <div className="h-full bg-fuchsia-500 rounded-none" style={{ width: `${res.fone_embedding.virtual_weight_3 * 100}%` }} />
                      </div>
                      <div className="w-8 text-right text-[10px] font-mono text-fuchsia-400">{res.fone_embedding.virtual_weight_3.toFixed(2)}</div>
                    </div>

                    <div className="text-[10px] font-mono text-on-surface-muted leading-tight">
                      Pathway: <span className="text-fuchsia-300 bg-fuchsia-500/10 px-1 py-0.5 rounded border border-fuchsia-500/20">{res.fone_embedding.latent_topological_pathway}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border">

                    <div className="text-[10px] font-mono text-on-surface-muted uppercase mb-2">Domain Affinity Weights</div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-16 text-xs font-mono text-on-surface-muted">Physics</div>
                      <div className="flex-1 h-1.5 bg-surface rounded-none overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-none" style={{ width: `${res.fone_embedding.domain_weight_physics * 100}%` }} />
                      </div>
                      <div className="w-8 text-right text-xs font-mono text-on-surface-muted">{res.fone_embedding.domain_weight_physics.toFixed(2)}</div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-16 text-xs font-mono text-on-surface-muted">Math</div>
                      <div className="flex-1 h-1.5 bg-surface rounded-none overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-none" style={{ width: `${res.fone_embedding.domain_weight_math * 100}%` }} />
                      </div>
                      <div className="w-8 text-right text-xs font-mono text-on-surface-muted">{res.fone_embedding.domain_weight_math.toFixed(2)}</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-16 text-xs font-mono text-on-surface-muted">ML</div>
                      <div className="flex-1 h-1.5 bg-surface rounded-none overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-none" style={{ width: `${res.fone_embedding.domain_weight_ml * 100}%` }} />
                      </div>
                      <div className="w-8 text-right text-xs font-mono text-on-surface-muted">{res.fone_embedding.domain_weight_ml.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Activity(props: any) {
    return <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
}
