import { useState } from 'react';
import { parseAIError } from '@/utils/errorHandling';

export interface TokenAnalysis {
  symbol: string;
  atomic_token_id: number;
  fragmented_bytes: string[];
  fone_embedding: {
    operator_class: string;
    tensor_rank_effect: string;
    virtual_weight_3: number;
    latent_topological_pathway: string;
    domain_weight_physics: number;
    domain_weight_math: number;
    domain_weight_ml: number;
  };
}


/**
 * Custom hook for managing the Atomic Tokenization Module state and operations.
 * Interfaces with the /api/tokenization route to fetch tokens.
 *
 * @returns {Object} An object containing the tokenization state and functions.
 * @returns {string} return.input - The current user input.
 * @returns {function} return.setInput - Setter for user input.
 * @returns {string} return.domainContext - The currently selected domain context.
 * @returns {function} return.setDomainContext - Setter for domain context.
 * @returns {TokenAnalysis[]} return.tokens - The array of analyzed tokens.
 * @returns {boolean} return.isAnalyzing - Loading state flag.
 * @returns {string | null} return.error - Error message if analysis fails.
 * @returns {function} return.handleAnalyze - Function to trigger analysis.
 */
export function useAtomicTokenization() {
  const removeResult = (id: number) => {
    setResults(prev => prev.filter(r => r.atomic_token_id !== id));
  };

  const [results, setResults] = useState<TokenAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{message: string, suggestions: string[]} | null>(null);

  const analyze = async (input: string, inputMode: 'extract' | 'list', domainContext: string) => {
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await fetch('/api/tokenization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input, inputMode, domainContext }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch tokenization profile.');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error("Tokenization Error:", err);
      const parsedError = parseAIError(err as Error) as any;
      let errMessage = parsedError.message || '';
      if (typeof parsedError === 'string') errMessage = parsedError;

      setError({
        message: errMessage,
        suggestions: parsedError.suggestions || []
      });
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, analyze, removeResult };
}
