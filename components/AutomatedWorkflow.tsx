'use client';

import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { 
  Play, 
  Square, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  BookOpen,
  Cpu,
  Calculator,
  Activity
} from 'lucide-react';
import { parseAIError } from '@/utils/errorHandling';

/**
 * Defines the properties for the AutomatedWorkflow component.
 */
interface AutomatedWorkflowProps {
  onComplete: (contextBundle: string) => void;
}

/**
 * Defines the possible execution states for a single workflow pipeline step.
 */
type StepStatus = 'idle' | 'running' | 'success' | 'error';

/**
 * Defines the structure and state of an individual step in the automated reasoning pipeline.
 */
interface WorkflowStep {
  id: string;
  title: string;
  icon: React.ElementType;
  status: StepStatus;
  result?: any;
  error?: string;
}

interface DisambiguationData {
  symbol: string;
  meaning: string;
  domain: string;
}

interface TokenizationData {
  symbol: string;
  atomic_token_id: number;
  fone_embedding: {
    operator_class: string;
    tensor_rank_effect: string;
  };
}

/**
 * Renders the Automated Workflow Orchestrator, chaining together disambiguation, tokenization,
 * execution, and interpretability modules into a single pipeline.
 * Generates a comprehensive context bundle to feed into the Dialectical Chat.
 *
 * @param {Object} props - The component properties.
 * @param {function(string): void} props.onComplete - Callback function executed when the pipeline completes, returning the context bundle.
 * @returns {JSX.Element} The rendered Automated Workflow component.
 */
export default function AutomatedWorkflow({ onComplete }: AutomatedWorkflowProps) {
    const [input, setInput] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('tactile_workflow_input') || '∇·F = ρ/ε₀ + ∂E/∂t';
    }
    return '∇·F = ρ/ε₀ + ∂E/∂t';
  });
    const [domainContext, setDomainContext] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('tactile_workflow_domain') || 'Physics';
    }
    return 'Physics';
  });
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    localStorage.setItem('tactile_workflow_input', input);
  }, [input]);

  useEffect(() => {
    localStorage.setItem('tactile_workflow_domain', domainContext);
  }, [domainContext]);

  
  const [steps, setSteps] = useState<WorkflowStep[]>([
    { id: 'disambiguation', title: 'Disambiguation Engine', icon: BookOpen, status: 'idle' },
    { id: 'tokenization', title: 'Atomic Tokenization', icon: Cpu, status: 'idle' },
    { id: 'executor', title: 'Neuro-Symbolic Executor', icon: Calculator, status: 'idle' },
    { id: 'dashboard', title: 'Interpretability Dashboard', icon: Activity, status: 'idle' }
  ]);

  const abortControllerRef = useRef<AbortController | null>(null);

  const resetSteps = () => {
    setSteps(steps.map(s => ({ ...s, status: 'idle', result: undefined, error: undefined })));
  };

  const updateStep = (id: string, updates: Partial<WorkflowStep>) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const stopWorkflow = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsRunning(false);
    setSteps(prev => prev.map(s => s.status === 'running' ? { ...s, status: 'error', error: 'Aborted by user' } : s));
  };

  const runWorkflow = async () => {
    if (!input.trim() || isRunning) return;
    
    setIsRunning(true);
    resetSteps();
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      const model = 'gemini-2.5-flash';

      // --- STEP 1: Disambiguation ---
      updateStep('disambiguation', { status: 'running' });
      if (signal.aborted) throw new Error('Aborted');
      
      const disambiguationResponse = await ai.models.generateContent({
        model,
        contents: `Analyze the following expression: "${input}". 
        The context is strictly: "${domainContext}".
        Identify all mathematical or scientific symbols and disambiguate their meaning.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                symbol: { type: Type.STRING },
                meaning: { type: Type.STRING },
                domain: { type: Type.STRING }
              },
              required: ['symbol', 'meaning', 'domain']
            }
          }
        }
      });
      
      const disambiguationData = JSON.parse(disambiguationResponse.text || '[]');
      updateStep('disambiguation', { status: 'success', result: disambiguationData });

      // --- STEP 2: Atomic Tokenization ---
      updateStep('tokenization', { status: 'running' });
      if (signal.aborted) throw new Error('Aborted');

      const symbolsToTokenize = disambiguationData.map((d: DisambiguationData) => d.symbol).join(', ');
      
      const tokenizationResponse = await ai.models.generateContent({
        model,
        contents: `Analyze these STEM symbols: ${symbolsToTokenize}. 
        Context: "${domainContext}".
        Generate a FoNE-inspired semantic embedding profile for each.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                symbol: { type: Type.STRING },
                atomic_token_id: { type: Type.INTEGER },
                fone_embedding: {
                  type: Type.OBJECT,
                  properties: {
                    operator_class: { type: Type.STRING },
                    tensor_rank_effect: { type: Type.STRING }
                  },
                  required: ['operator_class', 'tensor_rank_effect']
                }
              },
              required: ['symbol', 'atomic_token_id', 'fone_embedding']
            }
          }
        }
      });

      const tokenizationData = JSON.parse(tokenizationResponse.text || '[]');
      updateStep('tokenization', { status: 'success', result: tokenizationData });

      // --- STEP 3: Neuro-Symbolic Executor ---
      updateStep('executor', { status: 'running' });
      if (signal.aborted) throw new Error('Aborted');

      const executorResponse = await ai.models.generateContent({
        model: 'gemini-2.5-pro', // Use pro for execution
        contents: `Act as a Neuro-Symbolic Executor. 
        Evaluate or explain the following expression step-by-step: "${input}".
        Domain: "${domainContext}".
        Provide a structured breakdown of the execution path.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              execution_path: { type: Type.STRING },
              final_result: { type: Type.STRING },
              confidence: { type: Type.NUMBER }
            },
            required: ['execution_path', 'final_result', 'confidence']
          }
        }
      });

      const executorData = JSON.parse(executorResponse.text || '{}');
      updateStep('executor', { status: 'success', result: executorData });

      // --- STEP 4: Interpretability Dashboard ---
      updateStep('dashboard', { status: 'running' });
      if (signal.aborted) throw new Error('Aborted');

      const dashboardResponse = await ai.models.generateContent({
        model,
        contents: `Provide an interpretability summary for the expression: "${input}" in the context of "${domainContext}".
        Explain the physical or mathematical intuition behind it concisely.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              intuition: { type: Type.STRING },
              key_concepts: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['intuition', 'key_concepts']
          }
        }
      });

      const dashboardData = JSON.parse(dashboardResponse.text || '{}');
      updateStep('dashboard', { status: 'success', result: dashboardData });

      // --- FINAL: Generate Context Bundle ---
      if (signal.aborted) throw new Error('Aborted');
      
      const contextBundle = `
# Automated Workflow Context Bundle

## Original Input
**Expression:** \`${input}\`
**Domain:** ${domainContext}

## 1. Disambiguation Engine
${disambiguationData.map((d: DisambiguationData) => `- **${d.symbol}**: ${d.meaning}`).join('\n')}

## 2. Atomic Tokenization (Translation Proxy)
${tokenizationData.map((t: TokenizationData) => `- **${t.symbol}** -> [MATH_ENTITY_${t.fone_embedding.operator_class.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_${t.atomic_token_id}] (${t.fone_embedding.tensor_rank_effect})`).join('\n')}

## 3. Neuro-Symbolic Execution
**Path:** ${executorData.execution_path}
**Result:** ${executorData.final_result}
**Confidence:** ${(executorData.confidence * 100).toFixed(0)}%

## 4. Interpretability
**Intuition:** ${dashboardData.intuition}
**Key Concepts:** ${dashboardData.key_concepts.join(', ')}

---
*Please elaborate on this context bundle, verify the execution path, and provide deeper insights.*
      `.trim();

      setIsRunning(false);
      onComplete(contextBundle);

    } catch (err: any) {
      if (err.message !== 'Aborted') {
        const currentRunningStep = steps.find(s => s.status === 'running');
        if (currentRunningStep) {
          updateStep(currentRunningStep.id, { status: 'error', error: parseAIError(err) });
        }
      }
      setIsRunning(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto h-full overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-display-lg font-mono font-bold text-primary mb-2">Automated Workflow Orchestrator</h2>
        <p className="text-on-surface-muted font-mono text-sm">Chain modules together to generate a comprehensive context bundle for the Dialectical Chat.</p>
      </div>

      <div className="bg-surface-raised border border-border rounded-none p-6 mb-8 ">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="workflow-input" className="block text-xs font-mono text-on-surface-muted uppercase tracking-wider mb-2">Expression / Problem</label>
              <input
                id="workflow-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., ∇·F = ρ/ε₀ + ∂E/∂t"
                className="w-full bg-surface border border-border rounded-none px-4 py-4 text-on-surface font-mono focus:outline-none focus:border-primary transition-colors"
                disabled={isRunning}
              />
            </div>
            <div className="w-full md:w-48">
              <label htmlFor="workflow-domain" className="block text-xs font-mono text-on-surface-muted uppercase tracking-wider mb-2">Domain Context</label>
              <select
                id="workflow-domain"
                value={domainContext}
                onChange={(e) => setDomainContext(e.target.value)}
                className="w-full bg-surface border border-border rounded-none px-4 py-4 text-on-surface font-mono focus:outline-none focus:border-primary transition-colors appearance-none"
                disabled={isRunning}
              >
                <option value="Physics">Physics</option>
                <option value="Quantum Mechanics">Quantum Mechanics</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Pure Mathematics">Pure Mathematics</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            {isRunning ? (
              <button
                onClick={stopWorkflow}
                aria-label="Stop Execution"
                className="px-6 py-4 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 font-mono rounded-none flex items-center gap-2 transition-colors"
              >
                <Square className="w-4 h-4" />
                Stop Execution
              </button>
            ) : (
              <button
                onClick={runWorkflow}
                aria-label="Run Full Pipeline"
                disabled={!input.trim()}
                className="px-6 py-4 bg-primary hover:bg-primary/80 text-on-primary font-mono rounded-none flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4" />
                Run Full Pipeline
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-mono text-on-surface-muted uppercase tracking-wider mb-4">Pipeline Execution Status</h3>
        
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isNext = index < steps.length - 1;
          
          return (
            <div key={step.id} className="relative">
              <div className={`bg-surface border rounded-none p-5 flex items-center gap-4 transition-colors ${
                step.status === 'running' ? 'border-primary ' :
                step.status === 'success' ? 'border-emerald-500/50' :
                step.status === 'error' ? 'border-red-500/50' :
                'border-border'
              }`}>
                <div className={`w-10 h-10 rounded-none flex items-center justify-center flex-shrink-0 ${
                  step.status === 'running' ? 'bg-primary/20 text-primary' :
                  step.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                  step.status === 'error' ? 'bg-red-500/20 text-red-400' :
                  'bg-[#2a2a2a] text-on-surface-muted'
                }`}>
                  {step.status === 'running' ? <Loader2 className="w-5 h-5 animate-spin" /> :
                   step.status === 'success' ? <CheckCircle2 className="w-5 h-5" /> :
                   step.status === 'error' ? <AlertTriangle className="w-5 h-5" /> :
                   <Icon className="w-5 h-5" />}
                </div>
                
                <div className="flex-1">
                  <h4 className={`font-mono font-bold ${
                    step.status === 'running' ? 'text-on-surface' :
                    step.status === 'success' ? 'text-emerald-300' :
                    step.status === 'error' ? 'text-red-300' :
                    'text-on-surface-muted'
                  }`}>{step.title}</h4>
                  
                  {step.status === 'error' && (
                    <p className="text-xs font-mono text-red-400 mt-1">{step.error}</p>
                  )}
                  
                  {step.status === 'success' && step.result && (
                    <p className="text-xs font-mono text-on-surface-muted mt-1 truncate max-w-2xl">
                      {JSON.stringify(step.result).substring(0, 100)}...
                    </p>
                  )}
                </div>
              </div>
              
              {isNext && (
                <div className="flex justify-center my-2">
                  <ArrowRight className="w-5 h-5 text-border rotate-90" />
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {steps.every(s => s.status === 'success') && (
        <div className="mt-8 p-6 bg-primary/10 border border-primary/30 rounded-none text-center">
          <SparklesIcon className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="text-lg font-mono font-bold text-on-surface mb-2">Pipeline Complete</h3>
          <p className="text-sm font-mono text-on-surface-muted mb-4">Context bundle generated and sent to Dialectical Chat.</p>
          <button 
            aria-label="Go to Chat"
            onClick={() => onComplete('Pipeline completed successfully.')}
            className="px-4 py-2 bg-primary hover:bg-primary/80 text-on-primary font-mono rounded-none text-sm transition-colors"
          >
            Go to Chat
          </button>
        </div>
      )}
    </div>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
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
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  )
}
