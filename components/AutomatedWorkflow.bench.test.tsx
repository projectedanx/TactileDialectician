import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AutomatedWorkflow from './AutomatedWorkflow';
import { vi, describe, it, expect } from 'vitest';
import { GoogleGenAI } from '@google/genai';

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: function() {
      return {
        models: {
          generateContent: vi.fn().mockImplementation(async ({ contents }) => {
            // simulate network delay
            await new Promise(resolve => setTimeout(resolve, 100));
            if (contents.includes('disambiguate')) {
              // RETURN MULTIPLE ITEMS to simulate a larger set
              return { text: '[{"symbol": "x", "meaning": "x1", "domain": "math"}, {"symbol": "y", "meaning": "y1", "domain": "math"}, {"symbol": "z", "meaning": "z1", "domain": "math"}]' };
            }
            if (contents.includes('Generate a FoNE-inspired semantic embedding profile for each')) {
              return { text: '[{"symbol": "x", "atomic_token_id": 1, "fone_embedding": {"operator_class": "var", "tensor_rank_effect": "0"}}]' };
            }
            if (contents.includes('Neuro-Symbolic Executor')) {
              return { text: '{"execution_path": "a -> b", "final_result": "c", "confidence": 0.99}' };
            }
            if (contents.includes('interpretability summary')) {
              return { text: '{"intuition": "it is math", "key_concepts": ["math", "x"]}' };
            }
            return { text: '{}' };
          })
        }
      }
    },
    Type: { OBJECT: 'OBJECT', ARRAY: 'ARRAY', STRING: 'STRING', INTEGER: 'INTEGER', NUMBER: 'NUMBER' }
  };
});

describe('AutomatedWorkflow benchmark', () => {
  it('measures execution time', async () => {
    const onComplete = vi.fn();
    render(<AutomatedWorkflow onComplete={onComplete} />);

    const runButton = screen.getByRole('button', { name: /Run Full Pipeline/i });

    const start = performance.now();
    fireEvent.click(runButton);

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalled();
    }, { timeout: 10000 });
    const end = performance.now();

    console.log(`Pipeline execution time: ${end - start}ms`);
  });
});
