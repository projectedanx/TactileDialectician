'use client';

import { useState, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Cpu, Loader2, Fingerprint, Network, SplitSquareHorizontal, Library, ArrowRightLeft, AlertTriangle, Copy, Check } from 'lucide-react';
import { parseAIError } from '../utils/errorHandling';
import { type TokenAnalysis, PREDEFINED_LIBRARY, analyzeTokens } from '../lib/tokenizationService';

/**
 * Renders the Atomic Tokenization Module.
 * This component acts as a translation proxy that intercepts fragmented BPE tokens for complex STEM symbols
 * and replaces them with atomic semantic embeddings (FoNE framework) to preserve structural integrity before LLM processing.
 *
 * @returns {JSX.Element} The rendered Atomic Tokenization Module component.
 */
export default function AtomicTokenizationModule() {
  const [inputMode, setInputMode] = useState<'extract' | 'list'>('extract');
  const [input, setInput] = useState('∇·F = ρ/ε₀ + ∂E/∂t');
  const [domainContext, setDomainContext] = useState('Auto');
  const [results, setResults] = useState<TokenAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{message: string, suggestions: string[]} | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      const parsed = await analyzeTokens(input, inputMode, domainContext, ai);
      setResults(parsed);
    } catch (err: any) {
      if (err.message === 'Please enter at least one symbol.' || err.message === 'No complex STEM symbols (e.g., ∇, ∂, Σ, ∫, ∞, μ) detected in the input.') {
        setError({
          message: err.message,
          suggestions: [
            'Ensure you are using standard Unicode math symbols.',
            'If your symbols are standard text (e.g., "x", "y"), the regex might ignore them. Switch to "Explicit Symbol List" mode to force analysis.'
          ]
        });
        setLoading(false);
        return;
      }

      const baseMessage = parseAIError(err);
      const suggestions: string[] = [];
      
      if (baseMessage.includes('Rate limit') || baseMessage.includes('quota')) {
        suggestions.push('Wait a few moments before trying again.');
        suggestions.push('Check your Gemini API usage quota in Google Cloud Console.');
      } else if (baseMessage.includes('Authentication')) {
        suggestions.push('Verify your NEXT_PUBLIC_GEMINI_API_KEY environment variable.');
        suggestions.push('Ensure the API key has access to the Gemini API.');
      } else if (baseMessage.includes('format')) {
        suggestions.push('The model struggled to parse the specific symbols provided.');
        suggestions.push('Try analyzing fewer symbols at once.');
        suggestions.push('Ensure the symbols are standard Unicode math characters.');
      } else if (baseMessage.includes('Network')) {
        suggestions.push('Check your internet connection.');
        suggestions.push('Verify that no firewalls or ad-blockers are blocking the API request.');
      } else {
        suggestions.push('Try simplifying your input equation.');
        suggestions.push('Switch to "Explicit Symbol List" mode to test individual characters.');
      }
      
      setError({ message: baseMessage, suggestions });
    } finally {
      setLoading(false);
    }
  };

  const resultsMap = useMemo(() => {
    return results.reduce((map, r) => map.set(r.symbol, r), new Map<string, TokenAnalysis>());
  }, [results]);

  const sequenceTokens = useMemo(() => {
    if (results.length === 0 || inputMode !== 'extract') return [];
    
    const tokens: { text: string; isSymbol: boolean; bytes?: string[] }[] = [];
    let currentWord = '';
    
    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      const symbolAnalysis = resultsMap.get(char);
      
      if (symbolAnalysis) {
        if (currentWord) {
          tokens.push({ text: currentWord, isSymbol: false });
          currentWord = '';
        }
        tokens.push({ 
          text: char, 
          isSymbol: true, 
          bytes: symbolAnalysis.fragmented_bytes 
        });
      } else if (char === ' ') {
        if (currentWord) {
          tokens.push({ text: currentWord, isSymbol: false });
          currentWord = '';
        }
        tokens.push({ text: ' ', isSymbol: false });
      } else {
        currentWord += char;
      }
    }
    if (currentWord) {
      tokens.push({ text: currentWord, isSymbol: false });
    }
    return tokens;
  }, [input, results.length, resultsMap, inputMode]);

  const standardTokenCount = sequenceTokens.reduce((acc, t) => acc + (t.isSymbol && t.bytes ? t.bytes.length : (t.text.trim() ? 1 : 0)), 0);
  const atomicTokenCount = sequenceTokens.reduce((acc, t) => acc + (t.text.trim() || t.isSymbol ? 1 : 0), 0);
  const efficiencyGain = standardTokenCount > 0 ? Math.round((1 - (atomicTokenCount / standardTokenCount)) * 100) : 0;

  const translationPayload = useMemo(() => {
    if (results.length === 0 || inputMode !== 'extract' || sequenceTokens.length === 0) return null;

    let translatedEquation = '';
    const semanticMap: Record<string, any> = {};

    sequenceTokens.forEach(token => {
      if (token.isSymbol) {
        const symbolAnalysis = resultsMap.get(token.text);
        if (symbolAnalysis) {
          const identifier = `MATH_ENTITY_${symbolAnalysis.fone_embedding.operator_class.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_${symbolAnalysis.atomic_token_id}`;
          translatedEquation += `[${identifier}]`;
          if (!semanticMap[identifier]) {
            semanticMap[identifier] = {
              symbol: symbolAnalysis.symbol,
              operator_class: symbolAnalysis.fone_embedding.operator_class,
              tensor_rank_effect: symbolAnalysis.fone_embedding.tensor_rank_effect,
              virtual_weight_3: symbolAnalysis.fone_embedding.virtual_weight_3,
              latent_topological_pathway: symbolAnalysis.fone_embedding.latent_topological_pathway,
              domain_weights: {
                physics: symbolAnalysis.fone_embedding.domain_weight_physics,
                math: symbolAnalysis.fone_embedding.domain_weight_math,
                ml: symbolAnalysis.fone_embedding.domain_weight_ml
              }
            };
          }
        } else {
          translatedEquation += token.text;
        }
      } else {
        translatedEquation += token.text;
      }
    });

    return {
      original_equation: input,
      translated_equation: translatedEquation,
      semantic_map: semanticMap
    };
  }, [input, results.length, inputMode, sequenceTokens, resultsMap]);

  const handleCopyPayload = () => {
    if (translationPayload) {
      navigator.clipboard.writeText(JSON.stringify(translationPayload, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto h-full overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-display-lg font-mono font-bold text-primary mb-2">Atomic Tokenization Module</h2>
        <p className="text-on-surface-muted font-mono text-sm">Mitigate BPE fragmentation and inject FoNE-inspired semantic embeddings for STEM symbols.</p>
      </div>

      <div className="bg-surface-raised border border-border rounded-none p-6 mb-8 ">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <button onClick={() => { setInputMode('extract'); setInput('∇·F = ρ/ε₀ + ∂E/∂t'); }}
              aria-label="Switch to Auto-Extract from Equation mode"
              className={`text-xs font-mono uppercase tracking-wider px-4 py-2 rounded-none transition-colors ${inputMode === 'extract' ? 'bg-primary/10 text-primary border border-primary/30' : 'text-on-surface-muted hover:text-on-surface'}`}
            >
              Auto-Extract from Equation
            </button>
            <button onClick={() => { setInputMode('list'); setInput('∇, ∂, Σ, ∫, ∞, λ, ⊗, ⟨ψ|, Ĥ'); }}
              aria-label="Switch to Explicit Symbol List mode"
              className={`text-xs font-mono uppercase tracking-wider px-4 py-2 rounded-none transition-colors ${inputMode === 'list' ? 'bg-primary/10 text-primary border border-primary/30' : 'text-on-surface-muted hover:text-on-surface'}`}
            >
              Explicit Symbol List
            </button>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="symbol-input" className="block text-xs font-mono text-on-surface-muted uppercase tracking-wider mb-2">
                {inputMode === 'extract' ? 'Raw Sequence Input' : 'Comma-Separated Symbols'}
              </label>
              <input
                id="symbol-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={inputMode === 'extract' ? "e.g., ∇·F, ∂y/∂x, Σ(x_i - μ)²" : "e.g., ∇, ∂, Σ, ∫, ∞, λ"}
                className="w-full bg-surface border border-border rounded-none px-4 py-4 text-on-surface font-mono focus:outline-none focus:border-primary transition-colors"
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                aria-label={inputMode === 'extract' ? 'Raw Sequence Input' : 'Comma-Separated Symbols'}
              />
            </div>
            <div className="w-full md:w-48">
              <label htmlFor="domain-context" className="block text-xs font-mono text-on-surface-muted uppercase tracking-wider mb-2">Domain Context</label>
              <select
                id="domain-context"
                value={domainContext}
                onChange={(e) => setDomainContext(e.target.value)}
                className="w-full bg-surface border border-border rounded-none px-4 py-4 text-on-surface font-mono focus:outline-none focus:border-primary transition-colors appearance-none"
                aria-label="Select Domain Context"
              >
                <option value="Auto">Auto-Detect</option>
                <option value="Physics">Physics</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Statistics">Statistics</option>
                <option value="Pure Mathematics">Pure Mathematics</option>
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={handleAnalyze}
                disabled={loading || !input.trim()}
                aria-label="Tokenize Input"
                className="h-[50px] px-6 bg-primary hover:bg-primary/80 text-on-primary font-mono rounded-none flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> : <Cpu className="w-5 h-5" aria-hidden="true" />}
                Tokenize
              </button>
            </div>
          </div>
          
          <div className="mt-2 pt-4 border-t border-border">
            <div className="flex items-center gap-2 mb-3">
              <Library className="w-4 h-4 text-on-surface-muted" aria-hidden="true" />
              <span className="text-xs font-mono text-on-surface-muted uppercase tracking-wider">Quick-Start Library</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_LIBRARY.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setResults(prev => {
                      const filtered = prev.filter(r => r.symbol !== item.symbol);
                      return [item, ...filtered];
                    });
                  }}
                  aria-label={`Load analysis for ${item.symbol}`}
                  className="w-12 h-12 bg-surface hover:bg-primary/80/10 border border-border hover:border-primary/30 rounded-none flex items-center justify-center text-lg font-serif text-on-surface hover:text-primary transition-colors shadow-sm"
                  title={`Load analysis for ${item.symbol}`}
                >
                  {item.symbol}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/20 p-4 rounded-none mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-error font-mono text-sm font-bold mb-1">Analysis Failed</h4>
              <p className="text-error/90 font-mono text-sm mb-3">{error.message}</p>
              {error.suggestions && error.suggestions.length > 0 && (
                <div className="bg-error/30 rounded p-3 border border-error/10">
                  <p className="text-xs font-mono text-error/80 uppercase tracking-wider mb-2">Suggested Actions:</p>
                  <ul className="list-disc list-inside text-error/80 font-mono text-xs space-y-1">
                    {error.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {results.length > 0 && inputMode === 'extract' && sequenceTokens.length > 0 && (
        <div className="mb-8 bg-surface border border-border rounded-none p-6 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <ArrowRightLeft className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-mono text-on-surface uppercase tracking-wider">Sequence Tokenization Comparison</h3>
          </div>
          
          <div className="space-y-8">
            {/* Standard BPE */}
            <div>
              <h4 className="text-xs font-mono text-on-surface-muted uppercase tracking-wider mb-3">Standard BPE (Simulated)</h4>
              <div className="flex flex-wrap gap-2">
                {sequenceTokens.map((token, idx) => {
                  if (token.isSymbol && token.bytes) {
                    return token.bytes.map((byte, bIdx) => (
                      <div key={`std-${idx}-${bIdx}`} className="px-2 py-2 bg-error/10 border border-error/30 text-error font-mono text-xs rounded-none">
                        {byte}
                      </div>
                    ));
                  } else if (token.text.trim()) {
                    return (
                      <div key={`std-${idx}`} className="px-2 py-2 bg-[#2a2a2a] border border-border text-on-surface font-mono text-xs rounded-none">
                        {token.text}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>

            {/* Atomic Tokenization */}
            <div>
              <h4 className="text-xs font-mono text-on-surface-muted uppercase tracking-wider mb-3">Atomic Tokenization</h4>
              <div className="flex flex-wrap gap-2">
                {sequenceTokens.map((token, idx) => {
                  if (token.isSymbol) {
                    return (
                      <div key={`atm-${idx}`} className="px-4 py-2 bg-primary/10 border border-primary/50 text-on-surface font-mono text-xs rounded-none shadow-[0_0_8px_rgba(34,211,238,0.15)]">
                        {token.text}
                      </div>
                    );
                  } else if (token.text.trim()) {
                    return (
                      <div key={`atm-${idx}`} className="px-2 py-2 bg-[#2a2a2a] border border-border text-on-surface font-mono text-xs rounded-none">
                        {token.text}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
            
            {/* Metrics */}
            <div className="pt-6 border-t border-border grid grid-cols-3 gap-4">
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
          <h3 className="text-sm font-mono text-on-surface-muted uppercase tracking-wider mb-4">Tokenization & Embedding Profiles</h3>
          
          {results.map((res, idx) => (
            <div key={idx} className="bg-surface border border-border rounded-none overflow-hidden shadow-2xl flex flex-col lg:flex-row">
              
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
