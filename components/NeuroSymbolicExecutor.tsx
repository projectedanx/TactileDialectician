'use client';

import { useState, useEffect } from 'react';
import { GoogleGenAI, ThinkingLevel, Type, FunctionDeclaration } from '@google/genai';
import { Calculator, Play, Loader2, BrainCircuit, CheckCircle2, XCircle, Activity, Wrench, Globe, Save, Bookmark, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import * as math from 'mathjs';
import nerdamer from 'nerdamer';
// @ts-ignore
import 'nerdamer/Algebra.js';
// @ts-ignore
import 'nerdamer/Calculus.js';
// @ts-ignore
import 'nerdamer/Solve.js';

import { parseAIError } from '@/utils/errorHandling';

/**
 * Defines the structure of an execution trace step within the neuro-symbolic pipeline.
 */
interface TraceStep {
  type: 'direct' | 'llm_reasoning' | 'tool_call' | 'final_result' | 'error';
  content: string;
  status?: 'success' | 'failure' | 'pending';
  details?: string;
}

/**
 * Renders the Neuro-Symbolic Executor.
 * A hybrid routing engine that attempts deterministic symbolic computation via `nerdamer` or `mathjs`
 * before falling back to high-reasoning LLM tool-calling for complex problem solving.
 *
 * @returns {JSX.Element} The rendered Neuro-Symbolic Executor component.
 */
export default function NeuroSymbolicExecutor() {
  const [input, setInput] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('tactile_neuro_input') || '';
    }
    return '';
  });
  const [trace, setTrace] = useState<TraceStep[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tactile_neuro_trace');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return [];
  });
  const [loading, setLoading] = useState(false);
  const [discoverLoading, setDiscoverLoading] = useState(false);
  const [successRate, setSuccessRate] = useState<number | null>(null);
  const [savedResults, setSavedResults] = useState<{query: string, result: string, date: string}[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tactile_saved_results');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('tactile_neuro_input', input);
  }, [input]);

  useEffect(() => {
    localStorage.setItem('tactile_neuro_trace', JSON.stringify(trace));
  }, [trace]);

  useEffect(() => {
    localStorage.setItem('tactile_saved_results', JSON.stringify(savedResults));
  }, [savedResults]);

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
      setTrace([{ type: 'error', content: parseAIError(err), status: 'failure' }]);
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

    let currentTrace: TraceStep[] = [];
    const updateTrace = (step: TraceStep) => {
      currentTrace = [...currentTrace, step];
      setTrace(currentTrace);
    };

    let totalOps = 0;
    let successfulOps = 0;

    try {
      // Step 1: Direct Symbolic Attempt
      updateTrace({ type: 'direct', content: 'Attempting direct symbolic parsing (SymPy equivalent)...', status: 'pending' });
      let directSuccess = false;
      try {
        // Attempt to evaluate directly
        const directResult = nerdamer(input).evaluate().text();
        if (directResult && directResult !== input) {
          directSuccess = true;
          totalOps++;
          successfulOps++;
          updateTrace({ type: 'direct', content: `Direct symbolic parsing succeeded.`, details: `Result: ${directResult}`, status: 'success' });
        } else {
          throw new Error("No simplification found");
        }
      } catch (e) {
        totalOps++;
        updateTrace({ type: 'direct', content: 'Direct symbolic parsing failed or inapplicable. Falling back to hybrid LLM routing.', status: 'failure' });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      
      const symbolicComputeTool: FunctionDeclaration = {
        name: 'symbolic_compute',
        description: 'Evaluates a mathematical expression symbolically using nerdamer.js. You are interfacing with a strict JavaScript mathematical parser, NOT a raw Python/SymPy environment. Complex numbers use "i". Do not use Python methods like .evalf() or sympy namespaces. Use exact accepted syntax for nerdamer (e.g., "diff(x^2, x)", "integrate(x, x)", "solve(x^2-4, x)").',
        parameters: {
          type: Type.OBJECT,
          properties: {
            expression: { type: Type.STRING, description: 'The expression to evaluate, e.g., "diff(x^2, x)", "integrate(x, x)", "solve(x^2-4, x)"' }
          },
          required: ['expression']
        }
      };

      const numericComputeTool: FunctionDeclaration = {
        name: 'numeric_compute',
        description: 'Evaluates a mathematical expression numerically using math.js. You are interfacing with math.js, NOT Python. Use standard math.js syntax (e.g., "2.5 * 4.1", "sin(pi/4)").',
        parameters: {
          type: Type.OBJECT,
          properties: {
            expression: { type: Type.STRING, description: 'The expression to evaluate, e.g., "2.5 * 4.1", "sin(pi/4)"' }
          },
          required: ['expression']
        }
      };

      let history: any[] = [
        { role: 'user', parts: [{ text: `Solve or evaluate the following: ${input}. You have access to symbolic (nerdamer.js) and numeric (math.js) computation tools. 
        
CRITICAL EPISTEMIC CONSTRAINTS & SEMANTIC AUDIT:
1. You are interfacing with strict JavaScript mathematical parsers (nerdamer and math.js), NOT a raw Python/SymPy environment. 
2. Do not use Python methods like .evalf() or sympy namespaces (e.g., sympy.zeta).
3. Complex numbers use 'i' (e.g., '2 + 3i').
4. SEMANTIC AUDIT: If a tool returns a result that just echoes your input function (e.g., input 'zeta(-2)' returns '-2*zeta' or 'zeta(-2)'), it means the parser DOES NOT SUPPORT that function and treated it as an arbitrary algebraic variable. You MUST recognize this as a failure. Do not accept it as a success.
5. If a function like the Riemann zeta is unsupported by the parser, you must rely on your internal knowledge to explain the theoretical result or break the problem down into supported operations.` }] }
      ];

      updateTrace({ type: 'llm_reasoning', content: 'Engaging LLM attention mechanisms to probe structure and intent...', status: 'pending' });

      let response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: history,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
          tools: [{ functionDeclarations: [symbolicComputeTool, numericComputeTool] }]
        }
      });

      let maxIterations = 5;
      let iterations = 0;

      // Handle function calls with a loop
      while (response.functionCalls && response.functionCalls.length > 0 && iterations < maxIterations) {
        iterations++;
        history.push(response.candidates?.[0]?.content);

        const functionResponses = response.functionCalls.map(call => {
          totalOps++;
          let resultStr = '';
          let isSuccess = false;
          try {
            if (call.name === 'symbolic_compute') {
              const expr = (call.args as any).expression;
              resultStr = nerdamer(expr).evaluate().text();
              isSuccess = true;
            } else if (call.name === 'numeric_compute') {
              const expr = (call.args as any).expression;
              resultStr = math.evaluate(expr).toString();
              isSuccess = true;
            } else {
              resultStr = `Unknown function: ${call.name}`;
            }
          } catch (e: any) {
            resultStr = `Error: ${e.message}`;
          }

          if (isSuccess) successfulOps++;

          updateTrace({ 
            type: 'tool_call', 
            content: `Called ${call.name} with args: ${JSON.stringify(call.args)}`, 
            details: `Result: ${resultStr}`,
            status: isSuccess ? 'success' : 'failure' 
          });

          return {
            functionResponse: {
              name: call.name,
              response: { result: resultStr }
            }
          };
        });

        history.push({ role: 'user', parts: functionResponses });

        // Get next response
        updateTrace({ type: 'llm_reasoning', content: `Synthesizing result from tool outputs (Iteration ${iterations})...`, status: 'pending' });
        response = await ai.models.generateContent({
          model: 'gemini-3.1-pro-preview',
          contents: history,
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
            tools: [{ functionDeclarations: [symbolicComputeTool, numericComputeTool] }]
          }
        });
      }

      let finalResult = '';
      try {
        const parts = response.candidates?.[0]?.content?.parts || [];
        const textParts = parts.filter((p: any) => p.text).map((p: any) => p.text);
        
        if (textParts.length > 0) {
          finalResult = textParts.join('\n');
        } else {
          finalResult = response.text || 'No result returned.';
        }
        
        // Clean up the warning string if it somehow still gets included
        if (finalResult.includes('there are non-text parts functionCall')) {
          finalResult = finalResult.replace(/there are non-text parts functionCall.*from model\./gi, '').trim();
          if (!finalResult) {
            finalResult = 'The model returned a function call without any accompanying text.';
          }
        }
      } catch (e: any) {
        finalResult = 'Error extracting text from response.';
      }

      updateTrace({ type: 'final_result', content: finalResult, status: 'success' });

      // Calculate success rate
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

  return (
    <div className="p-8 max-w-5xl mx-auto h-full overflow-y-auto">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-mono font-bold text-violet-400 mb-2">Neuro-Symbolic Executor</h2>
          <p className="text-zinc-400 font-mono text-sm">Hybrid procedural grounding for complex mathematical operations.</p>
        </div>
        {successRate !== null && (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-2 rounded-lg flex flex-col items-end shadow-lg">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Procedural Success Rate</span>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-violet-400" />
              <span className={`text-xl font-mono font-bold ${successRate >= 80 ? 'text-emerald-400' : successRate >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                {successRate.toFixed(0)}%
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-8 shadow-lg">
        <div className="flex flex-col gap-4">
          <div className="flex-1">
            <label htmlFor="neuro-input" className="block text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">Mathematical Problem / Expression</label>
            <textarea
              id="neuro-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., integrate(x^2, x) or Calculate the derivative of sin(x)*e^x"
              className="w-full h-32 bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-violet-300 font-mono focus:outline-none focus:border-violet-500 transition-colors resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleExecute();
                }
              }}
              aria-label="Mathematical Problem or Expression"
            />
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs text-zinc-600 font-mono">Press Cmd/Ctrl + Enter to execute</span>
                <button
                  onClick={handleDiscoverUnsolved}
                  disabled={discoverLoading || loading}
                  className="text-xs font-mono text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors disabled:opacity-50"
                  aria-label="Discover Unsolved Problem"
                >
                  {discoverLoading ? <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" /> : <Globe className="w-3 h-3" aria-hidden="true" />}
                  Find Unsolved Problem
                </button>
              </div>
              <button
                onClick={handleExecute}
                disabled={loading || !input.trim()}
                aria-label="Execute Neuro-Symbolic Computation"
                className="px-6 py-2 bg-violet-600 hover:bg-violet-500 text-white font-mono rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <Play className="w-4 h-4" aria-hidden="true" />}
                Execute
              </button>
            </div>
          </div>
        </div>
      </div>

      {trace.length > 0 && (
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl overflow-hidden shadow-2xl">
          <div className="bg-[#1a1a1a] px-6 py-3 border-b border-[#2a2a2a] flex items-center gap-3">
            <BrainCircuit className="w-5 h-5 text-violet-400" />
            <h3 className="text-sm font-mono text-zinc-300 uppercase tracking-wider">Execution Trace</h3>
          </div>
          
          <div className="p-6 space-y-6">
            {trace.map((step, idx) => (
              <div key={idx} className={`flex gap-4 ${step.type === 'final_result' ? 'mt-8 pt-6 border-t border-[#2a2a2a]' : ''}`}>
                <div className="flex-shrink-0 mt-1">
                  {step.type === 'direct' && <Calculator className="w-5 h-5 text-zinc-500" />}
                  {step.type === 'llm_reasoning' && <BrainCircuit className="w-5 h-5 text-violet-400" />}
                  {step.type === 'tool_call' && <Wrench className="w-5 h-5 text-amber-400" />}
                  {step.type === 'final_result' && <CheckCircle2 className="w-6 h-6 text-emerald-400" />}
                  {step.type === 'error' && <XCircle className="w-5 h-5 text-red-400" />}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                      {step.type.replace('_', ' ')}
                    </span>
                    {step.status === 'success' && <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono rounded border border-emerald-500/20">SUCCESS</span>}
                    {step.status === 'failure' && <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-[10px] font-mono rounded border border-red-500/20">FAILED</span>}
                    {step.status === 'pending' && <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-mono rounded border border-blue-500/20 animate-pulse">PENDING</span>}
                  </div>
                  
                  {step.type === 'final_result' ? (
                    <div className="mt-4">
                      <div className="prose prose-invert max-w-none prose-pre:bg-[#0a0a0a] prose-pre:border prose-pre:border-[#333]">
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                          {step.content}
                        </ReactMarkdown>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => handleSaveResult(step.content)}
                          className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] text-violet-300 text-xs font-mono rounded-lg flex items-center gap-2 transition-colors border border-[#444]"
                          aria-label="Save Final Result"
                        >
                          <Save className="w-4 h-4" aria-hidden="true" />
                          Save Result
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-zinc-300 font-mono leading-relaxed">
                      {step.content}
                    </div>
                  )}
                  
                  {step.details && (
                    <div className="mt-2 p-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-xs font-mono text-zinc-400 overflow-x-auto">
                      {step.details}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {loading && trace[trace.length - 1]?.type !== 'error' && trace[trace.length - 1]?.type !== 'final_result' && (
              <div className="flex gap-4 items-center pl-1">
                <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                <span className="text-sm font-mono text-zinc-500">Processing...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {savedResults.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Bookmark className="w-5 h-5 text-violet-400" aria-hidden="true" />
            <h3 className="text-lg font-mono font-bold text-zinc-200">Saved Results</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {savedResults.map((saved, idx) => (
              <div key={idx} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 shadow-sm relative group">
                <button 
                  onClick={() => handleRemoveSaved(idx)}
                  className="absolute top-4 right-4 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove saved result"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>
                <div className="mb-2">
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Query</span>
                  <p className="text-sm font-mono text-zinc-300 mt-1 line-clamp-2">{saved.query}</p>
                </div>
                <div>
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Result</span>
                  <div className="text-sm text-zinc-200 mt-1 prose prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                      {saved.result}
                    </ReactMarkdown>
                  </div>
                </div>
                <div className="mt-3 text-[10px] font-mono text-zinc-600">
                  {new Date(saved.date).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
