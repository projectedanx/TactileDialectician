'use client';

import { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Search, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';

/**
 * Defines the structure of a disambiguated symbol result returned by the LLM.
 */
interface DisambiguationResult {
  symbol: string;
  meaning: string;
  domain: string;
  confidence: number;
  explanation: string;
}

import { parseAIError } from '@/utils/errorHandling';

/**
 * Renders the Disambiguation Engine, which classifies and resolves polysemous STEM symbols based on epistemic domains.
 * It sends user input to an LLM, requesting strict domain-bound interpretations of mathematical entities.
 *
 * @returns {JSX.Element} The rendered Disambiguation Engine component.
 */
export default function DisambiguationEngine() {
  const [input, setInput] = useState('');
  const [context, setContext] = useState('Auto');
  const [results, setResults] = useState<DisambiguationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Keep track of historical domains to improve Auto-Detect
  const [historicalDomains, setHistoricalDomains] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tactile_historical_domains');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const handleDisambiguate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      
      let promptContext = context;
      if (context === 'Auto' && historicalDomains.length > 0) {
        promptContext = `Auto (Hint: User recently asked about ${historicalDomains.slice(-3).join(', ')})`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze the following expression or symbol: "${input}". 
        
The user has explicitly forced the domain context to: "${promptContext}".
If the context is NOT "Auto", you MUST strictly lock your interpretation to this specific epistemic world. For example, if the context is "Machine Learning", 'W_i' must be interpreted as a weight, whereas in "Physics" it might be work. Do not provide general meanings outside of this forced domain.
If the context is "Auto", infer the most likely domain, taking into account the user's recent history if provided.

Identify all mathematical or scientific symbols and disambiguate their meaning strictly within the requested context.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                symbol: { type: Type.STRING, description: 'The symbol extracted' },
                meaning: { type: Type.STRING, description: 'The disambiguated meaning' },
                domain: { type: Type.STRING, description: 'The inferred domain (e.g., Physics, Statistics, ML)' },
                confidence: { type: Type.NUMBER, description: 'Confidence score from 0 to 1' },
                explanation: { type: Type.STRING, description: 'Brief explanation of why this meaning was chosen' }
              },
              required: ['symbol', 'meaning', 'domain', 'confidence', 'explanation']
            }
          }
        }
      });

      const jsonStr = response.text?.trim() || '[]';
      const parsed = JSON.parse(jsonStr) as DisambiguationResult[];
      setResults(parsed);
      
      // Update historical domains if a domain was confidently detected
      if (parsed.length > 0) {
        const topDomain = parsed.reduce((prev, current) => (prev.confidence > current.confidence) ? prev : current).domain;
        if (topDomain) {
          setHistoricalDomains(prev => {
            const updated = [...prev, topDomain].slice(-5); // Keep last 5
            localStorage.setItem('tactile_historical_domains', JSON.stringify(updated));
            return updated;
          });
        }
      }
    } catch (err: any) {
      setError(parseAIError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto h-full overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-mono font-bold text-emerald-400 mb-2">Symbol Disambiguation Engine</h2>
        <p className="text-zinc-400 font-mono text-sm">Multi-lens classifier for resolving polysemy across STEM domains.</p>
      </div>

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-8 shadow-lg">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="disambiguate-input" className="block text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">Expression / Symbol</label>
              <input
                id="disambiguate-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., V_i, W_i, ∇·F, λ, μ"
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-emerald-300 font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                onKeyDown={(e) => e.key === 'Enter' && handleDisambiguate()}
                aria-label="Expression or Symbol to Disambiguate"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleDisambiguate}
                disabled={loading || !input.trim()}
                aria-label="Analyze Symbol"
                className="h-[50px] px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-mono rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> : <Search className="w-5 h-5" aria-hidden="true" />}
                Analyze
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-mono text-zinc-500 uppercase tracking-wider mb-3">Epistemic Domain Toggles</label>
            <div className="flex flex-wrap gap-2">
              {['Auto', 'Quantum Mechanics', 'Fluid Dynamics', 'Pure Mathematics', 'Machine Learning', 'Physics', 'Statistics'].map(domain => (
                <button
                  key={domain}
                  onClick={() => setContext(domain)}
                  className={`px-4 py-2 text-xs font-mono rounded-md border transition-colors ${
                    context === domain 
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' 
                      : 'bg-[#0a0a0a] border-[#333] text-zinc-400 hover:border-[#555] hover:text-zinc-300'
                  }`}
                >
                  {domain}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-8 flex items-center gap-3 font-mono text-sm">
          <AlertTriangle className="w-5 h-5" />
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-wider mb-4">Disambiguation Results</h3>
          <div className="grid grid-cols-1 gap-4">
            {results.map((res, idx) => (
              <div key={idx} className="bg-[#141414] border border-[#2a2a2a] rounded-lg p-5 flex flex-col md:flex-row gap-6 relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/20 group-hover:bg-emerald-500 transition-colors" />
                
                <div className="flex-shrink-0 flex flex-col items-center justify-center w-24 h-24 bg-[#0a0a0a] rounded-lg border border-[#333]">
                  <span className="text-4xl font-serif italic text-emerald-400">{res.symbol}</span>
                </div>
                
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-xl font-bold text-zinc-100">{res.meaning}</h4>
                    <span className="px-2 py-1 bg-[#2a2a2a] text-zinc-300 text-xs font-mono rounded-md border border-[#333]">
                      {res.domain}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed">{res.explanation}</p>
                </div>
                
                <div className="flex-shrink-0 flex flex-col items-end justify-center">
                  <div className="text-xs font-mono text-zinc-500 mb-1">CONFIDENCE</div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-[#0a0a0a] rounded-full overflow-hidden border border-[#333]">
                      <div 
                        className={`h-full rounded-full ${res.confidence > 0.8 ? 'bg-emerald-500' : res.confidence > 0.5 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${res.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-mono text-zinc-300">{(res.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
