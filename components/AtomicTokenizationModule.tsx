'use client';

import { useState, useMemo } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Cpu, Loader2, Fingerprint, Network, SplitSquareHorizontal, Library, ArrowRightLeft, AlertTriangle, Copy, Check } from 'lucide-react';

/**
 * Defines the FoNE (Form, Nature, Effect) semantic embedding profile for a tokenized symbol.
 */
interface FoNEEmbedding {
  operator_class: string;
  domain_weight_physics: number;
  domain_weight_math: number;
  domain_weight_ml: number;
  tensor_rank_effect: string;
  virtual_weight_3: number;
  latent_topological_pathway: string;
}

/**
 * Defines the structure of the atomic tokenization analysis for a specific symbol.
 */
interface TokenAnalysis {
  symbol: string;
  fragmented_bytes: string[];
  atomic_token_id: number;
  fone_embedding: FoNEEmbedding;
}

const PREDEFINED_LIBRARY: TokenAnalysis[] = [
  {
    symbol: '∇',
    fragmented_bytes: ['<0xE2>', '<0x88>', '<0x87>'],
    atomic_token_id: 50256,
    fone_embedding: {
      operator_class: 'Differential Operator',
      domain_weight_physics: 0.95,
      domain_weight_math: 0.85,
      domain_weight_ml: 0.40,
      tensor_rank_effect: 'Increases by 1 (Gradient) or Reduces by 1 (Divergence)',
      virtual_weight_3: 0.85,
      latent_topological_pathway: 'Paraconsistent Gradient Manifold'
    }
  },
  {
    symbol: '∫',
    fragmented_bytes: ['<0xE2>', '<0x88>', '<0xAB>'],
    atomic_token_id: 50257,
    fone_embedding: {
      operator_class: 'Integral Operator',
      domain_weight_physics: 0.90,
      domain_weight_math: 0.98,
      domain_weight_ml: 0.30,
      tensor_rank_effect: 'Preserves or Reduces (depending on differential form)',
      virtual_weight_3: 0.92,
      latent_topological_pathway: 'Topological Boundary Contraction'
    }
  },
  {
    symbol: 'Σ',
    fragmented_bytes: ['<0xCE>', '<0xA3>'],
    atomic_token_id: 50258,
    fone_embedding: {
      operator_class: 'Summation Operator',
      domain_weight_physics: 0.70,
      domain_weight_math: 0.95,
      domain_weight_ml: 0.90,
      tensor_rank_effect: 'Reduces rank (contraction over index)',
      virtual_weight_3: 0.76,
      latent_topological_pathway: 'Discrete N-Dimensional Folding'
    }
  },
  {
    symbol: '∂',
    fragmented_bytes: ['<0xE2>', '<0x88>', '<0x82>'],
    atomic_token_id: 50259,
    fone_embedding: {
      operator_class: 'Partial Differential',
      domain_weight_physics: 0.95,
      domain_weight_math: 0.90,
      domain_weight_ml: 0.85,
      tensor_rank_effect: 'Increases rank by 1 (w.r.t coordinates)',
      virtual_weight_3: 0.88,
      latent_topological_pathway: 'Phantom Dimension Tesselation'
    }
  },
  {
    symbol: '∞',
    fragmented_bytes: ['<0xE2>', '<0x88>', '<0x9E>'],
    atomic_token_id: 50260,
    fone_embedding: {
      operator_class: 'Limit / Concept',
      domain_weight_physics: 0.60,
      domain_weight_math: 0.99,
      domain_weight_ml: 0.50,
      tensor_rank_effect: 'Preserves (Scalar Concept)',
      virtual_weight_3: 0.99,
      latent_topological_pathway: 'Asymptotic Horizon Paradox'
    }
  },
  {
    symbol: 'λ',
    fragmented_bytes: ['<0xCE>', '<0xBB>'],
    atomic_token_id: 50261,
    fone_embedding: {
      operator_class: 'Variable / Eigenvalue',
      domain_weight_physics: 0.85,
      domain_weight_math: 0.95,
      domain_weight_ml: 0.90,
      tensor_rank_effect: 'Preserves (Scalar Multiplier)',
      virtual_weight_3: 0.65,
      latent_topological_pathway: 'Latent Spectral Projection'
    }
  },
  {
    symbol: '⊗',
    fragmented_bytes: ['<0xE2>', '<0x8A>', '<0x97>'],
    atomic_token_id: 50262,
    fone_embedding: {
      operator_class: 'Tensor Product',
      domain_weight_physics: 0.95,
      domain_weight_math: 0.99,
      domain_weight_ml: 0.80,
      tensor_rank_effect: 'Increases rank (sum of ranks of operands)',
      virtual_weight_3: 0.94,
      latent_topological_pathway: 'Isomorphic Entanglement Zone'
    }
  },
  {
    symbol: '⟨ψ|',
    fragmented_bytes: ['<0xE2>', '<0x9F>', '<0xA8>', '<0xCF>', '<0x88>', '<0x7C>'],
    atomic_token_id: 50263,
    fone_embedding: {
      operator_class: 'Bra Vector (Quantum State)',
      domain_weight_physics: 0.99,
      domain_weight_math: 0.70,
      domain_weight_ml: 0.10,
      tensor_rank_effect: 'Dual Vector (Rank 1 covariant)',
      virtual_weight_3: 0.97,
      latent_topological_pathway: 'Hilbert Space Dual-Mapping'
    }
  },
  {
    symbol: 'Ĥ',
    fragmented_bytes: ['<0xC4>', '<0xA4>'],
    atomic_token_id: 50264,
    fone_embedding: {
      operator_class: 'Hamiltonian Operator',
      domain_weight_physics: 0.99,
      domain_weight_math: 0.60,
      domain_weight_ml: 0.05,
      tensor_rank_effect: 'Preserves rank (maps state to state)',
      virtual_weight_3: 0.91,
      latent_topological_pathway: 'Energy Eigenstate Oscillation'
    }
  }
];

import { parseAIError } from '../utils/errorHandling';

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
      
      let foundSymbols: string[] = [];
      
      if (inputMode === 'list') {
        foundSymbols = Array.from(new Set(input.split(/[, ]+/).map(s => s.trim()).filter(Boolean)));
      } else {
        // Extract potential STEM symbols (non-alphanumeric, non-standard punctuation)
        const symbolRegex = /[\u2200-\u22FF\u2A00-\u2AFF\u0370-\u03FF\u2190-\u21FF]/g;
        foundSymbols = Array.from(new Set(input.match(symbolRegex) || []));
      }

      if (foundSymbols.length === 0) {
        setError({
          message: inputMode === 'list' 
            ? 'Please enter at least one symbol.' 
            : 'No complex STEM symbols (e.g., ∇, ∂, Σ, ∫, ∞, μ) detected in the input.',
          suggestions: [
            'Ensure you are using standard Unicode math symbols.',
            'If your symbols are standard text (e.g., "x", "y"), the regex might ignore them. Switch to "Explicit Symbol List" mode to force analysis.'
          ]
        });
        setLoading(false);
        return;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze the following STEM symbols extracted from a user's input: ${foundSymbols.join(', ')}. 
        The user has provided the following domain context: "${domainContext}".
        For each symbol, simulate how a standard BPE tokenizer might fragment it into bytes, assign a mock atomic token ID, and generate a FoNE-inspired semantic embedding profile capturing its mathematical properties. Tailor the domain weights and tensor rank effect based on the provided domain context if applicable.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                symbol: { type: Type.STRING, description: 'The STEM symbol' },
                fragmented_bytes: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: 'Simulated BPE byte fragmentation (e.g., ["<0xE2>", "<0x88>", "<0x87>"])'
                },
                atomic_token_id: { type: Type.INTEGER, description: 'A simulated high-integer token ID for the atomic representation' },
                fone_embedding: {
                  type: Type.OBJECT,
                  properties: {
                    operator_class: { type: Type.STRING, description: 'e.g., Differential, Integral, Logical, Variable' },
                    domain_weight_physics: { type: Type.NUMBER, description: '0.0 to 1.0 relevance to Physics' },
                    domain_weight_math: { type: Type.NUMBER, description: '0.0 to 1.0 relevance to Pure Math' },
                    domain_weight_ml: { type: Type.NUMBER, description: '0.0 to 1.0 relevance to Machine Learning' },
                    tensor_rank_effect: { type: Type.STRING, description: 'How it affects tensor rank (e.g., "Reduces by 1", "Preserves", "Increases by 1")' },
                    virtual_weight_3: { type: Type.NUMBER, description: '0.0 to 1.0 representing Beneficial Friction for Paraconsistent overlaps' },
                    latent_topological_pathway: { type: Type.STRING, description: 'The non-standard topological routing name (e.g., "Phantom Dimension Tesselation")' }
                  },
                  required: ['operator_class', 'domain_weight_physics', 'domain_weight_math', 'domain_weight_ml', 'tensor_rank_effect', 'virtual_weight_3', 'latent_topological_pathway']
                }
              },
              required: ['symbol', 'fragmented_bytes', 'atomic_token_id', 'fone_embedding']
            }
          }
        }
      });

      const jsonStr = response.text?.trim() || '[]';
      const parsed = JSON.parse(jsonStr) as TokenAnalysis[];
      setResults(parsed);
    } catch (err: any) {
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
    const map = new Map<string, TokenAnalysis>();
    for (const r of results) {
      map.set(r.symbol, r);
    }
    return map;
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
            <button 
              onClick={() => { setInputMode('extract'); setInput('∇·F = ρ/ε₀ + ∂E/∂t'); }}
              aria-label="Switch to Auto-Extract from Equation mode"
              className={`text-xs font-mono uppercase tracking-wider px-4 py-2 rounded-none transition-colors ${inputMode === 'extract' ? 'bg-primary/10 text-primary border border-primary/30' : 'text-on-surface-muted hover:text-on-surface'}`}
            >
              Auto-Extract from Equation
            </button>
            <button 
              onClick={() => { setInputMode('list'); setInput('∇, ∂, Σ, ∫, ∞, λ, ⊗, ⟨ψ|, Ĥ'); }}
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
              <button
                onClick={handleAnalyze}
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
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-none mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-red-400 font-mono text-sm font-bold mb-1">Analysis Failed</h4>
              <p className="text-red-300/90 font-mono text-sm mb-3">{error.message}</p>
              {error.suggestions && error.suggestions.length > 0 && (
                <div className="bg-red-950/30 rounded p-3 border border-red-500/10">
                  <p className="text-xs font-mono text-red-400/80 uppercase tracking-wider mb-2">Suggested Actions:</p>
                  <ul className="list-disc list-inside text-red-300/80 font-mono text-xs space-y-1">
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
                      <div key={`std-${idx}-${bIdx}`} className="px-2 py-2 bg-red-500/10 border border-red-500/30 text-red-300 font-mono text-xs rounded-none">
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
                <span className="text-2xl font-mono text-red-400">{standardTokenCount}</span>
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
            <button
              onClick={handleCopyPayload}
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
                    <SplitSquareHorizontal className="w-4 h-4 text-red-400" />
                    <h4 className="text-xs font-mono text-on-surface-muted uppercase tracking-wider">Standard BPE (Fragmented)</h4>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {res.fragmented_bytes.map((byte, i) => (
                      <div key={i} className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-300 font-mono text-sm rounded-none">
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
