import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextResponse } from 'next/server';

// Mock next/server NextResponse
vi.mock('next/server', () => {
  return {
    NextResponse: {
      json: vi.fn((body: any, init?: ResponseInit) => {
        return { body, init };
      })
    }
  };
});

// Mock @google/genai
const generateContentMock = vi.fn();

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: vi.fn().mockImplementation(function() {
      return {
        models: {
          generateContent: generateContentMock
        }
      };
    }),
    Type: {
      OBJECT: 'OBJECT',
      STRING: 'STRING',
      ARRAY: 'ARRAY'
    }
  };
});

describe('POST /api/topology', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 if query is missing', async () => {
    const request = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request) as any;

    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Query is required' }, { status: 400 });
    expect(response.body).toEqual({ error: 'Query is required' });
    expect(response.init).toEqual({ status: 400 });
  });

  it('returns 200 with parsed JSON from GoogleGenAI on success', async () => {
    const request = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ query: 'test query' }),
    });

    const mockResponsePayload = {
      target_concept: 'test',
      semantic_drift: 'drift',
      connotation_vectors: 'vectors',
      semiotic_blind_spots: 'spots',
      ambiguity_zones: 'zones',
      isomorphisms_of_friction: [],
      pluriversal_knowledge_capsule: 'capsule'
    };

    generateContentMock.mockResolvedValueOnce({
      text: JSON.stringify(mockResponsePayload)
    });

    const response = await POST(request) as any;

    expect(generateContentMock).toHaveBeenCalled();
    const callArgs = generateContentMock.mock.calls[0][0];
    expect(callArgs.model).toBe('gemini-2.5-flash');
    expect(callArgs.contents).toContain('test query');

    expect(NextResponse.json).toHaveBeenCalledWith(mockResponsePayload);
    expect(response.body).toEqual(mockResponsePayload);
  });

  it('returns 500 if GoogleGenAI throws an error', async () => {
    const request = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ query: 'test query' }),
    });

    generateContentMock.mockRejectedValueOnce(new Error('API error'));

    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const response = await POST(request) as any;

    expect(consoleSpy).toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Failed to compute topology' }, { status: 500 });
    expect(response.body).toEqual({ error: 'Failed to compute topology' });
    expect(response.init).toEqual({ status: 500 });

    consoleSpy.mockRestore();
  });

  it('handles empty response text from GoogleGenAI', async () => {
    const request = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ query: 'test query' }),
    });

    // Provide a response where text might be undefined or empty
    generateContentMock.mockResolvedValueOnce({});

    const response = await POST(request) as any;

    expect(generateContentMock).toHaveBeenCalled();
    // It should parse '{}' fallback
    expect(NextResponse.json).toHaveBeenCalledWith({});
    expect(response.body).toEqual({});
  });
});
