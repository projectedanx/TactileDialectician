import { describe, it, expect, vi } from 'vitest';
import { analyzeTokens } from './tokenizationService';
import { GoogleGenAI } from '@google/genai';

describe('analyzeTokens', () => {
  const mockResponseText = JSON.stringify([{
    symbol: '∇',
    fragmented_bytes: ['<0xE2>'],
    atomic_token_id: 1,
    fone_embedding: {
      operator_class: 'Diff',
      domain_weight_physics: 0.9,
      domain_weight_math: 0.9,
      domain_weight_ml: 0.9,
      tensor_rank_effect: 'None',
      virtual_weight_3: 0.9,
      latent_topological_pathway: 'Path'
    }
  }]);

  const mockAI = {
    models: {
      generateContent: vi.fn().mockResolvedValue({
        text: mockResponseText
      })
    }
  } as unknown as GoogleGenAI;

  it('should parse list mode correctly and return expected analysis', async () => {
    const result = await analyzeTokens('∇, ∫', 'list', 'Math', mockAI);
    expect(mockAI.models.generateContent).toHaveBeenCalled();
    // Validate symbols passed to prompt
    const callArg = (mockAI.models.generateContent as any).mock.calls[0][0];
    expect(callArg.contents).toContain('∇, ∫');
    expect(result).toHaveLength(1);
    expect(result[0].symbol).toBe('∇');
  });

  it('should extract symbols correctly in extract mode', async () => {
    const mockAI = {
      models: {
        generateContent: vi.fn().mockResolvedValue({
          text: mockResponseText
        })
      }
    } as unknown as GoogleGenAI;

    const result = await analyzeTokens('The gradient is ∇f', 'extract', 'Math', mockAI);
    expect(mockAI.models.generateContent).toHaveBeenCalled();
    const callArg = (mockAI.models.generateContent as any).mock.calls[0][0];
    expect(callArg.contents).toContain('∇');
    expect(result).toHaveLength(1);
  });

  it('should throw an error in list mode when no symbols are found', async () => {
    await expect(analyzeTokens('   ', 'list', 'Math', mockAI)).rejects.toThrow('Please enter at least one symbol.');
  });

  it('should throw an error in extract mode when no symbols are found', async () => {
    await expect(analyzeTokens('The gradient is grad f', 'extract', 'Math', mockAI)).rejects.toThrow('No complex STEM symbols');
  });

  it('should handle missing or empty LLM response text by returning an empty array', async () => {
    const emptyMockAI = {
      models: {
        generateContent: vi.fn().mockResolvedValue({
          text: '' // Or null/undefined if we could mock that, but empty string tests the fallback logic
        })
      }
    } as unknown as GoogleGenAI;
    const result = await analyzeTokens('∇', 'extract', 'Math', emptyMockAI);
    expect(result).toEqual([]);
  });

  it('should handle undefined text in response safely', async () => {
    const undefinedMockAI = {
      models: {
        generateContent: vi.fn().mockResolvedValue({})
      }
    } as unknown as GoogleGenAI;
    const result = await analyzeTokens('∇', 'extract', 'Math', undefinedMockAI);
    expect(result).toEqual([]);
  });
});
