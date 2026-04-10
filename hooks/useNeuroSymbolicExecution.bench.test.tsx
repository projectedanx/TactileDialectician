import { renderHook } from '@testing-library/react';
import { useNeuroSymbolicExecution } from './useNeuroSymbolicExecution';
import { expect, test, describe } from 'vitest';

describe('useNeuroSymbolicExecution benchmark', () => {
  test('measure initialization time', () => {
    // Mock localStorage
    const store: Record<string, string> = {
      'tactile_neuro_input': 'test input',
      'tactile_neuro_trace': JSON.stringify([{ type: 'direct', content: 'test', status: 'success' }]),
      'tactile_saved_results': JSON.stringify([{ query: 'q', result: 'r', date: 'd' }]),
    };

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value.toString(); },
        removeItem: (key: string) => { delete store[key]; },
      },
      writable: true
    });

    const start = performance.now();
    let renders = 0;
    for (let i = 0; i < 1000; i++) {
      renderHook(() => useNeuroSymbolicExecution());
      renders++;
    }
    const end = performance.now();

    console.log(`Render time for 1000 iterations: ${end - start}ms`);
    expect(renders).toBe(1000);
  });
});
