import { describe, it, expect, vi, beforeEach } from 'vitest';
import { executeLLM, executeDeterministic } from './executorService';
import { GoogleGenAI } from '@google/genai';

vi.mock('@google/genai', () => {
  const mockGenerateContentStream = vi.fn();
  return {
    GoogleGenAI: vi.fn().mockImplementation(() => ({
      models: {
        generateContentStream: mockGenerateContentStream
      }
    })),
    ThinkingLevel: { HIGH: 'HIGH' },
    Type: { OBJECT: 'OBJECT', STRING: 'STRING' }
  };
});

describe('executorService', () => {
  let mockGenerateContentStream: any;
  let updateTrace: any;
  let incrementOps: any;

  beforeEach(() => {
    vi.clearAllMocks();
    const ai = new GoogleGenAI({ apiKey: 'test' });
    mockGenerateContentStream = ai.models.generateContentStream;
    updateTrace = vi.fn();
    incrementOps = vi.fn();
  });

  describe('executeLLM', () => {
    it('returns text result without function calls', async () => {
      mockGenerateContentStream.mockImplementationOnce(() => Promise.resolve([
        { text: 'The final answer is 42', candidates: [{ content: { parts: [{ text: 'The final answer is 42' }] } }] }
      ]));

      const result = await executeLLM('what is 6 * 7?', updateTrace, incrementOps);

      expect(result).toBe('The final answer is 42');
      expect(updateTrace).toHaveBeenCalledWith(expect.objectContaining({
        type: 'llm_reasoning',
        status: 'pending'
      }));
      expect(incrementOps).not.toHaveBeenCalled();
    });

    it('handles numeric_compute tool calls', async () => {
      mockGenerateContentStream
        .mockImplementationOnce(() => Promise.resolve([
          { functionCalls: [{ name: 'numeric_compute', args: { expression: '6 * 7' } }], candidates: [{ content: { parts: [{ text: 'Thinking...' }] } }] }
        ]))
        .mockImplementationOnce(() => Promise.resolve([
          { text: 'The answer is 42', candidates: [{ content: { parts: [{ text: 'The answer is 42' }] } }] }
        ]));

      const result = await executeLLM('6 * 7', updateTrace, incrementOps);

      expect(result).toBe('The answer is 42');
      expect(incrementOps).toHaveBeenCalledWith(true);
      expect(updateTrace).toHaveBeenCalledWith(expect.objectContaining({
        type: 'tool_call',
        details: 'Result: 42'
      }));
    });

    it('handles symbolic_compute tool calls', async () => {
      mockGenerateContentStream
        .mockImplementationOnce(() => Promise.resolve([
          { functionCalls: [{ name: 'symbolic_compute', args: { expression: 'diff(x^2, x)' } }], candidates: [{ content: { parts: [{ text: 'Thinking...' }] } }] }
        ]))
        .mockImplementationOnce(() => Promise.resolve([
          { text: 'The derivative is 2*x', candidates: [{ content: { parts: [{ text: 'The derivative is 2*x' }] } }] }
        ]));

      const result = await executeLLM('derivative of x^2', updateTrace, incrementOps);

      expect(result).toBe('The derivative is 2*x');
      expect(incrementOps).toHaveBeenCalledWith(true);
      expect(updateTrace).toHaveBeenCalledWith(expect.objectContaining({
        type: 'tool_call',
        details: 'Result: 2*x'
      }));
    });

    it('handles unknown tool calls gracefully', async () => {
      mockGenerateContentStream
        .mockImplementationOnce(() => Promise.resolve([
          { functionCalls: [{ name: 'unknown_tool', args: {} }], candidates: [{ content: { parts: [{ text: 'Thinking...' }] } }] }
        ]))
        .mockImplementationOnce(() => Promise.resolve([
          { text: 'Done', candidates: [{ content: { parts: [{ text: 'Done' }] } }] }
        ]));

      const result = await executeLLM('do something unknown', updateTrace, incrementOps);

      expect(result).toBe('Done');
      expect(incrementOps).toHaveBeenCalledWith(false);
      expect(updateTrace).toHaveBeenCalledWith(expect.objectContaining({
        type: 'tool_call',
        status: 'failure',
        details: 'Result: Unknown function: unknown_tool'
      }));
    });

    it('handles tool call exceptions gracefully', async () => {
      mockGenerateContentStream
        .mockImplementationOnce(() => Promise.resolve([
          { functionCalls: [{ name: 'numeric_compute', args: { expression: 'invalid_syntax(' } }], candidates: [{ content: { parts: [{ text: 'Thinking...' }] } }] }
        ]))
        .mockImplementationOnce(() => Promise.resolve([
          { text: 'Fixed', candidates: [{ content: { parts: [{ text: 'Fixed' }] } }] }
        ]));

      const result = await executeLLM('invalid syntax', updateTrace, incrementOps);

      expect(result).toBe('Fixed');
      expect(incrementOps).toHaveBeenCalledWith(false);
      expect(updateTrace).toHaveBeenCalledWith(expect.objectContaining({
        type: 'tool_call',
        status: 'failure'
      }));
    });

    it('limits tool call iterations to maxIterations', async () => {
      mockGenerateContentStream.mockImplementation(() => Promise.resolve([
        { text: 'Looping fallback', functionCalls: [{ name: 'numeric_compute', args: { expression: '1+1' } }], candidates: [{ content: { parts: [{ text: 'Looping...' }] } }] }
      ]));

      const result = await executeLLM('loop forever', updateTrace, incrementOps);

      expect(mockGenerateContentStream).toHaveBeenCalledTimes(6); // 1 initial + 5 iterations
      expect(incrementOps).toHaveBeenCalledTimes(5);
      expect(result).toBe('Looping...');
    });
  });

  describe('executeDeterministic', () => {
    it('evaluates successful nerdamer expression', () => {
      const result = executeDeterministic('x + x');
      expect(result).toEqual({ success: true, result: '2*x' });
    });

    it('returns error when no simplification is found', () => {
      const result = executeDeterministic('x');
      expect(result).toEqual({ success: false, error: 'No simplification found' });
    });

    it('returns error on exception', () => {
      const result = executeDeterministic('invalid_syntax(');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('evaluates complex mathematical expressions correctly', () => {
      const result = executeDeterministic('diff(x^2, x)');
      expect(result).toEqual({ success: true, result: '2*x' });
    });

    it('evaluates numeric simplifications correctly', () => {
      const result = executeDeterministic('2 + 2 * 3');
      expect(result).toEqual({ success: true, result: '8' });
    });

    it('returns evaluated value even when empty string input parses to 0', () => {
      const result = executeDeterministic('');
      expect(result).toEqual({ success: true, result: '0' });
    });

    it('returns error when input contains only whitespace', () => {
      const result = executeDeterministic('   ');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('does not catch unsupported functions natively and may evaluate them as variables', () => {
      const result = executeDeterministic('unsupportedFunc(x)');
      expect(result).toEqual({ success: true, result: 'unsupportedFunc*x' });
    });
  });
});
