import { GoogleGenAI, ThinkingLevel, Type, FunctionDeclaration } from '@google/genai';
import * as math from 'mathjs';
import nerdamer from 'nerdamer';
import 'nerdamer/Algebra.js';
import 'nerdamer/Calculus.js';
import 'nerdamer/Solve.js';

export interface TraceStep {
  type: 'direct' | 'llm_reasoning' | 'tool_call' | 'final_result' | 'error';
  content: string;
  status?: 'success' | 'failure' | 'pending';
  details?: string;
}

export const executeDeterministic = (input: string): { success: boolean, result?: string, error?: string } => {
  try {
    const directResult = nerdamer(input).evaluate().text();
    if (directResult && directResult !== input) {
      return { success: true, result: directResult };
    }
    return { success: false, error: "No simplification found" };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
};

export const executeLLM = async (
  input: string,
  updateTrace: (step: TraceStep) => void,
  incrementOps: (successful: boolean) => void
): Promise<string> => {
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

  while (response.functionCalls && response.functionCalls.length > 0 && iterations < maxIterations) {
    iterations++;
    history.push(response.candidates?.[0]?.content);

    const functionResponses = response.functionCalls.map(call => {
      let resultStr = '';
      let isSuccess = false;
      try {
        if (call.name === 'symbolic_compute') {
          const expr = (call.args as { expression: string }).expression;
          resultStr = nerdamer(expr).evaluate().text();
          isSuccess = true;
        } else if (call.name === 'numeric_compute') {
          const expr = (call.args as { expression: string }).expression;
          resultStr = math.evaluate(expr).toString();
          isSuccess = true;
        } else {
          resultStr = `Unknown function: ${call.name}`;
        }
      } catch (e: any) {
        resultStr = `Error: ${e.message}`;
      }

      incrementOps(isSuccess);

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
  const parts = response.candidates?.[0]?.content?.parts || [];
  const textParts = parts.filter((p: any) => p.text).map((p: any) => p.text);

  if (textParts.length > 0) {
    finalResult = textParts.join('\n');
  } else {
    finalResult = response.text || 'No result returned.';
  }

  return finalResult;
};
