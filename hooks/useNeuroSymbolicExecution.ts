import { useState, useEffect, useRef } from 'react';
import { TraceStep, executeDeterministic, executeLLM } from '@/lib/executorService';
import { parseAIError } from '@/utils/errorHandling';
import { GoogleGenAI } from '@google/genai';

/**
 * A custom hook that manages the state and logic for Neuro-Symbolic Execution.
 * Orchestrates deterministic execution via mathjs/nerdamer and probabilistic LLM execution.
 *
 * @returns {{ isExecuting: boolean, executionResult: string | null, executionTrace: TraceStep[], handleExecute: (input: string) => Promise<void> }} An object containing execution state and the execute function.
 */
export const useNeuroSymbolicExecution = () => {
  const [input, setInput] = useState('');
  const [trace, setTrace] = useState<TraceStep[]>([]);
  const [loading, setLoading] = useState(false);
  const [discoverLoading, setDiscoverLoading] = useState(false);
  const [successRate, setSuccessRate] = useState<number | null>(null);
  const [savedResults, setSavedResults] = useState<{query: string, result: string, date: string}[]>([]);

  // Load from localStorage on mount only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedInput = localStorage.getItem('tactile_neuro_input');
      if (savedInput) setInput(savedInput);

      const savedTrace = localStorage.getItem('tactile_neuro_trace');
      if (savedTrace) {
        try {
          setTrace(JSON.parse(savedTrace));
        } catch (e) {}
      }

      const savedRes = localStorage.getItem('tactile_saved_results');
      if (savedRes) {
        try {
          setSavedResults(JSON.parse(savedRes));
        } catch (e) {}
      }
    }
  }, []);

  const traceRef = useRef<TraceStep[]>([]);
  traceRef.current = trace;

  useEffect(() => {
    localStorage.setItem('tactile_neuro_input', input);
  }, [input]);

  useEffect(() => {
    localStorage.setItem('tactile_neuro_trace', JSON.stringify(trace));
  }, [trace]);

  useEffect(() => {
    localStorage.setItem('tactile_saved_results', JSON.stringify(savedResults));
  }, [savedResults]);

  const updateTrace = (step: TraceStep) => {
    setTrace(prev => [...prev, step]);
  };

  const handleDiscoverUnsolved = async () => {
    setDiscoverLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: 'Find a famous unsolved mathematical equation or problem (e.g., Riemann Hypothesis, Navier-Stokes, Collatz conjecture, Birch and Swinnerton-Dyer). Return a brief 1-sentence description followed by the core mathematical expression or equation. Keep it concise so it can be used as an input prompt.',
        config: {
          tools: [{ googleSearch: {} }]
        }
      });
      setInput(response.text || '');
    } catch (err: any) {
      updateTrace({ type: 'error', content: parseAIError(err), status: 'failure' });
    } finally {
      setDiscoverLoading(false);
    }
  };

  const handleSaveResult = (resultContent: string) => {
    const newResult = { query: input, result: resultContent, date: new Date().toISOString() };
    setSavedResults(prev => [newResult, ...prev]);
  };

  const handleRemoveSaved = (index: number) => {
    setSavedResults(prev => prev.filter((_, i) => i !== index));
  };

  const handleExecute = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setTrace([]);
    setSuccessRate(null);

    let totalOps = 0;
    let successfulOps = 0;

    const incrementOps = (successful: boolean) => {
      totalOps++;
      if (successful) successfulOps++;
    };

    try {
      updateTrace({ type: 'direct', content: 'Attempting direct symbolic parsing (SymPy equivalent)...', status: 'pending' });
      const deterministicRes = executeDeterministic(input);
      if (deterministicRes.success) {
        incrementOps(true);
        updateTrace({ type: 'direct', content: `Direct symbolic parsing succeeded.`, details: `Result: ${deterministicRes.result}`, status: 'success' });
      } else {
        incrementOps(false);
        updateTrace({ type: 'direct', content: 'Direct symbolic parsing failed or inapplicable. Falling back to hybrid LLM routing.', status: 'failure' });
      }

            const onStreamChunk = (chunkText: string) => {
        setTrace(prev => {
          const newTrace = [...prev];
          const lastIndex = newTrace.length - 1;
          if (lastIndex >= 0 && newTrace[lastIndex].type === 'llm_reasoning') {
             newTrace[lastIndex] = { ...newTrace[lastIndex], content: chunkText };
          }
          return newTrace;
        });
      };

      const finalResult = await executeLLM(input, updateTrace, incrementOps, onStreamChunk);

      updateTrace({ type: 'final_result', content: finalResult, status: 'success' });

      if (totalOps > 0) {
        setSuccessRate((successfulOps / totalOps) * 100);
      } else {
        setSuccessRate(100);
      }

    } catch (err: any) {
      updateTrace({ type: 'error', content: parseAIError(err), status: 'failure' });
      if (totalOps > 0) {
        setSuccessRate((successfulOps / totalOps) * 100);
      } else {
        setSuccessRate(0);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    input, setInput, trace, loading, discoverLoading, successRate, savedResults,
    handleDiscoverUnsolved, handleSaveResult, handleRemoveSaved, handleExecute
  };
};
