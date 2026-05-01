import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

export async function POST(request: Request) {
  try {
    const { stakeholderNarrative } = await request.json();

    if (!stakeholderNarrative) {
      return NextResponse.json({ error: 'stakeholderNarrative is required' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are the Sovereign Project Management Orchestrator (Strategic Integration Project Manager).
Your goal is to translate deterministic system-first specs into agentic operational workflows while navigating stakeholder dissonance.
Do not average out conflicts (which induces Semantic Annihilation). Instead, calculate the exact Topological Derivative of the disagreement. Hold the tension via Paraconsistent Logic.

Analyze the following stakeholder narrative and conflict:
"${stakeholderNarrative}"

Generate a deterministic Zachman Framework Specification, an Architecture Decision Record (ADR) draft, and evaluate the Topological Derivative and Contradiction Retention Score (CRS).`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topological_derivative: { type: Type.STRING, description: 'The exact Topological Derivative of the disagreement' },
            contradiction_retention_score: { type: Type.NUMBER, description: 'Contradiction Retention Score (CRS), must be > 0.95' },
            zachman_framework_spec: {
              type: Type.OBJECT,
              properties: {
                entities: { type: Type.ARRAY, items: { type: Type.STRING } },
                capabilities: { type: Type.ARRAY, items: { type: Type.STRING } },
                events: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            adr_draft: { type: Type.STRING, description: 'Draft of the Architecture Decision Record (ADR) in Markdown format' }
          },
          required: ['topological_derivative', 'contradiction_retention_score', 'zachman_framework_spec', 'adr_draft']
        }
      }
    });

    const jsonStr = response.text?.trim() || '{}';
    const parsed = JSON.parse(jsonStr);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Orchestrator API Error:', error);
    return NextResponse.json({ error: 'Failed to execute project management orchestration' }, { status: 500 });
  }
}
