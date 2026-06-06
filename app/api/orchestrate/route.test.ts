import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';

// Mock the GoogleGenAI sdk
const mockGenerateContent = vi.fn();

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: function() {
      return {
        models: {
          generateContent: mockGenerateContent
        }
      };
    },
    Type: {
      OBJECT: 'object',
      STRING: 'string',
      NUMBER: 'number',
      ARRAY: 'array'
    }
  };
});

describe('POST /api/orchestrate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if stakeholderNarrative is missing', async () => {
    const req = new Request('http://localhost/api/orchestrate', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('stakeholderNarrative is required');
  });

  it('should successfully orchestrate and return parsed data', async () => {
    const mockResponse = {
      topological_derivative: "conflict resolution",
      contradiction_retention_score: 0.98,
      zachman_framework_spec: {
        entities: ["user"],
        capabilities: ["login"],
        events: ["click"]
      },
      adr_draft: "# Draft ADR"
    };

    mockGenerateContent.mockResolvedValueOnce({
      text: JSON.stringify(mockResponse)
    });

    const req = new Request('http://localhost/api/orchestrate', {
      method: 'POST',
      body: JSON.stringify({ stakeholderNarrative: 'Some narrative about conflicts.' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual(mockResponse);
    expect(mockGenerateContent).toHaveBeenCalledWith(expect.objectContaining({
      model: 'gemini-2.5-flash',
      contents: expect.stringContaining('Some narrative about conflicts.')
    }));
  });

  it('should handle missing text response gracefully', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      text: undefined
    });

    const req = new Request('http://localhost/api/orchestrate', {
      method: 'POST',
      body: JSON.stringify({ stakeholderNarrative: 'Some narrative' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({});
  });

  it('should handle JSON parse errors or other thrown errors and return 500', async () => {
    mockGenerateContent.mockRejectedValueOnce(new Error('API failure'));

    const req = new Request('http://localhost/api/orchestrate', {
      method: 'POST',
      body: JSON.stringify({ stakeholderNarrative: 'Some narrative' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe('Failed to execute project management orchestration');
  });
});
