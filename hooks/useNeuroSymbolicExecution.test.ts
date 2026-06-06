import { renderHook, act } from '@testing-library/react';
import { useNeuroSymbolicExecution } from './useNeuroSymbolicExecution';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as executorService from '@/lib/executorService';

// Mock dependencies
const mockGenerateContent = vi.fn();

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: function() {
      return {
        models: {
          generateContent: mockGenerateContent
        }
      };
    }
  };
});

vi.mock('@/lib/executorService', () => ({
  executeDeterministic: vi.fn(),
  executeLLM: vi.fn(),
}));

describe('useNeuroSymbolicExecution', () => {
  let store: Record<string, string> = {};

  beforeEach(() => {
    vi.clearAllMocks();
    store = {};

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn((key) => store[key] || null),
        setItem: vi.fn((key, value) => {
          store[key] = value.toString();
        }),
        removeItem: vi.fn((key) => {
          delete store[key];
        }),
      },
      writable: true
    });
  });

  it('initializes with default values when localStorage is empty', () => {
    const { result } = renderHook(() => useNeuroSymbolicExecution());

    expect(result.current.input).toBe('');
    expect(result.current.trace).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.discoverLoading).toBe(false);
    expect(result.current.successRate).toBeNull();
    expect(result.current.savedResults).toEqual([]);
  });

  it('loads initial state from localStorage', () => {
    store['tactile_neuro_input'] = 'test input';
    store['tactile_neuro_trace'] = JSON.stringify([{ type: 'direct', content: 'test', status: 'success' }]);
    store['tactile_saved_results'] = JSON.stringify([{ query: 'q', result: 'r', date: '2023-01-01T00:00:00.000Z' }]);

    const { result } = renderHook(() => useNeuroSymbolicExecution());

    expect(result.current.input).toBe('test input');
    expect(result.current.trace).toHaveLength(1);
    expect(result.current.savedResults).toHaveLength(1);
  });

  it('updates localStorage when input changes', () => {
    const { result } = renderHook(() => useNeuroSymbolicExecution());

    act(() => {
      result.current.setInput('new input');
    });

    expect(window.localStorage.setItem).toHaveBeenCalledWith('tactile_neuro_input', 'new input');
  });

  it('adds and removes saved results', () => {
    const { result } = renderHook(() => useNeuroSymbolicExecution());

    act(() => {
      result.current.setInput('test query');
    });

    act(() => {
      result.current.handleSaveResult('test result');
    });

    expect(result.current.savedResults).toHaveLength(1);
    expect(result.current.savedResults[0].query).toBe('test query');
    expect(result.current.savedResults[0].result).toBe('test result');

    act(() => {
      result.current.handleRemoveSaved(0);
    });

    expect(result.current.savedResults).toHaveLength(0);
  });

  it('discovers unsolved problems successfully', async () => {
    mockGenerateContent.mockResolvedValueOnce({ text: 'Riemann Hypothesis: ...' });

    const { result } = renderHook(() => useNeuroSymbolicExecution());

    await act(async () => {
      await result.current.handleDiscoverUnsolved();
    });

    expect(result.current.input).toBe('Riemann Hypothesis: ...');
    expect(result.current.discoverLoading).toBe(false);
  });

  it('handles discover unsolved problem errors gracefully', async () => {
    mockGenerateContent.mockRejectedValueOnce(new Error('API Error'));

    const { result } = renderHook(() => useNeuroSymbolicExecution());

    await act(async () => {
      await result.current.handleDiscoverUnsolved();
    });

    expect(result.current.trace).toHaveLength(1);
    expect(result.current.trace[0].type).toBe('error');
    expect(result.current.discoverLoading).toBe(false);
  });

  it('executes neuro-symbolic flow successfully with deterministic fast path', async () => {
    vi.mocked(executorService.executeDeterministic).mockReturnValue({ success: true, result: '42' });
    vi.mocked(executorService.executeLLM).mockResolvedValue('LLM confirms 42');

    const { result } = renderHook(() => useNeuroSymbolicExecution());

    act(() => {
      result.current.setInput('solve this');
    });

    await act(async () => {
      await result.current.handleExecute();
    });

    expect(executorService.executeDeterministic).toHaveBeenCalledWith('solve this');
    expect(executorService.executeLLM).toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
    expect(result.current.successRate).toBe(100);

    // We expect some trace steps to have been added
    expect(result.current.trace.length).toBeGreaterThan(0);
    expect(result.current.trace[result.current.trace.length - 1].type).toBe('final_result');
  });

  it('falls back to LLM when deterministic evaluation fails', async () => {
    vi.mocked(executorService.executeDeterministic).mockReturnValue({ success: false, error: 'fail' });
    vi.mocked(executorService.executeLLM).mockResolvedValue('LLM solved it');

    const { result } = renderHook(() => useNeuroSymbolicExecution());

    act(() => {
      result.current.setInput('hard problem');
    });

    // We have 1 failed op (deterministic) and whatever executeLLM does.
    // If executeLLM doesn't call incrementOps, totalOps = 1, successfulOps = 0 => 0% success rate
    // We will just verify it's called and trace is updated.

    await act(async () => {
      await result.current.handleExecute();
    });

    expect(executorService.executeDeterministic).toHaveBeenCalledWith('hard problem');
    expect(executorService.executeLLM).toHaveBeenCalled();
    expect(result.current.loading).toBe(false);

    const finalTrace = result.current.trace[result.current.trace.length - 1];
    expect(finalTrace.type).toBe('final_result');
    expect(finalTrace.content).toBe('LLM solved it');
  });

  it('handles execution errors gracefully', async () => {
    vi.mocked(executorService.executeDeterministic).mockReturnValue({ success: true, result: '42' });
    vi.mocked(executorService.executeLLM).mockRejectedValue(new Error('LLM failed'));

    const { result } = renderHook(() => useNeuroSymbolicExecution());

    act(() => {
      result.current.setInput('problem');
    });

    await act(async () => {
      await result.current.handleExecute();
    });

    expect(result.current.loading).toBe(false);

    const finalTrace = result.current.trace[result.current.trace.length - 1];
    expect(finalTrace.type).toBe('error');
    expect(result.current.successRate).toBe(100); // 1 success, 1 total (from deterministic)
  });

  it('does not execute if input is empty', async () => {
    const { result } = renderHook(() => useNeuroSymbolicExecution());

    await act(async () => {
      await result.current.handleExecute();
    });

    expect(executorService.executeDeterministic).not.toHaveBeenCalled();
    expect(executorService.executeLLM).not.toHaveBeenCalled();
  });
});
