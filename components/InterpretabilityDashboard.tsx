'use client';

import { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Search, Loader2, Globe, ExternalLink, Activity } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

import { parseAIError } from '@/utils/errorHandling';

export default function InterpretabilityDashboard() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [urls, setUrls] = useState<{uri: string, title: string}[]>([]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setResult('');
    setUrls([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Find recent papers, articles, or discussions explaining the usage of the following symbol or concept in STEM: "${query}". Summarize the findings and provide context on how it's used across different domains.`,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      setResult(response.text || 'No information found.');
      
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        const extractedUrls = chunks
          .filter((c: any) => c.web?.uri && c.web?.title)
          .map((c: any) => ({ uri: c.web.uri, title: c.web.title }));
        
        // Remove duplicates
        const uniqueUrls = Array.from(new Map(extractedUrls.map(item => [item.uri, item])).values());
        setUrls(uniqueUrls);
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
        <h2 className="text-3xl font-mono font-bold text-amber-400 mb-2">Interpretability Dashboard</h2>
        <p className="text-zinc-400 font-mono text-sm">Audit reasoning paths and ground symbols in recent literature via Google Search.</p>
      </div>

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-8 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="audit-input" className="block text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">Symbol / Concept to Audit</label>
            <input
              id="audit-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., usage of λ in machine learning vs physics"
              className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-amber-300 font-mono focus:outline-none focus:border-amber-500 transition-colors"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              aria-label="Symbol or Concept to Audit"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              aria-label="Ground symbol in literature"
              className="h-[50px] px-6 bg-amber-600 hover:bg-amber-500 text-white font-mono rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> : <Globe className="w-5 h-5" aria-hidden="true" />}
              Ground
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-8 font-mono text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-[#141414] border border-[#2a2a2a] rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-[#1a1a1a] px-6 py-3 border-b border-[#2a2a2a] flex items-center gap-3">
              <Activity className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-mono text-zinc-300 uppercase tracking-wider">Analysis</h3>
            </div>
            <div className="p-6 prose prose-invert max-w-none prose-a:text-amber-400 hover:prose-a:text-amber-300">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden shadow-2xl sticky top-8">
              <div className="px-6 py-3 border-b border-[#2a2a2a] flex items-center gap-3">
                <Search className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-mono text-zinc-300 uppercase tracking-wider">Sources</h3>
              </div>
              <div className="p-4 flex flex-col gap-3">
                {urls.length > 0 ? (
                  urls.map((url, idx) => (
                    <a
                      key={idx}
                      href={url.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-3 p-3 rounded-lg hover:bg-[#2a2a2a] transition-colors border border-transparent hover:border-[#333]"
                    >
                      <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 mt-1 flex-shrink-0" />
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm text-zinc-300 group-hover:text-amber-300 line-clamp-2 font-medium">{url.title}</span>
                        <span className="text-xs text-zinc-500 truncate mt-1">{new URL(url.uri).hostname}</span>
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="text-sm text-zinc-500 font-mono p-2">No specific sources extracted.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
