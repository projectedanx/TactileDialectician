'use client';

import { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Search, Loader2, Globe, ExternalLink, Activity } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

import { parseAIError } from '@/utils/errorHandling';

/**
 * Renders the Interpretability Dashboard, an interface for grounding abstract symbols or concepts in recent literature.
 * Initiates external search queries to retrieve and summarize academic or technical context.
 *
 * @returns {JSX.Element} The rendered Interpretability Dashboard component.
 */
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
        model: 'gemini-2.5-flash',
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
        <h2 className="text-display-lg font-mono font-bold text-primary mb-2">Interpretability Dashboard</h2>
        <p className="text-on-surface-muted font-mono text-sm">Audit reasoning paths and ground symbols in recent literature via Google Search.</p>
      </div>

      <div className="bg-surface-raised border border-border rounded-none p-6 mb-8 ">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="audit-input" className="block text-xs font-mono text-on-surface-muted uppercase tracking-wider mb-2">Symbol / Concept to Audit</label>
            <input
              id="audit-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., usage of λ in machine learning vs physics"
              className="w-full bg-surface border border-border rounded-none px-4 py-4 text-on-surface font-mono focus:outline-none focus:border-primary transition-colors"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              aria-label="Symbol or Concept to Audit"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              aria-label="Ground symbol in literature"
              className="h-[50px] px-6 bg-primary hover:bg-primary/80 text-on-primary font-mono rounded-none flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> : <Globe className="w-5 h-5" aria-hidden="true" />}
              Ground
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-none mb-8 font-mono text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-surface border border-border rounded-none overflow-hidden shadow-2xl">
            <div className="bg-surface-raised px-6 py-4 border-b border-border flex items-center gap-3">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-mono text-on-surface uppercase tracking-wider">Analysis</h3>
            </div>
            <div className="p-6 prose prose-invert max-w-none prose-a:text-primary hover:prose-a:text-on-surface">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-surface-raised border border-border rounded-none overflow-hidden shadow-2xl sticky top-8">
              <div className="px-6 py-4 border-b border-border flex items-center gap-3">
                <Search className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-mono text-on-surface uppercase tracking-wider">Sources</h3>
              </div>
              <div className="p-4 flex flex-col gap-3">
                {urls.length > 0 ? (
                  urls.map((url, idx) => (
                    <a
                      key={idx}
                      href={url.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-3 p-3 rounded-none hover:bg-[#2a2a2a] transition-colors border border-transparent hover:border-border"
                    >
                      <ExternalLink className="w-4 h-4 text-on-surface-muted group-hover:text-primary mt-1 flex-shrink-0" />
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm text-on-surface group-hover:text-on-surface line-clamp-2 font-medium">{url.title}</span>
                        <span className="text-xs text-on-surface-muted truncate mt-1">{new URL(url.uri).hostname}</span>
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="text-sm text-on-surface-muted font-mono p-2">No specific sources extracted.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
