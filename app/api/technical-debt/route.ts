import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

/**
 * Handles the calculation of Epsilon-Tolerance Paraconsistency for Technical Debt.
 *
 * @param {Request} request - The incoming HTTP request containing the technical debt context.
 * @returns {Promise<Response>} The HTTP response with the evaluated gradient and flow-matching artifact.
 */
export async function POST(request: Request) {
  try {
    const { debtContext } = await request.json();

    if (!debtContext) {
      return NextResponse.json({ error: 'debtContext is required' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are the Sovereign Project Management Orchestrator. Apply the Epsilon-Tolerance Paraconsistency mechanism to the following technical debt context:
"${debtContext}"

Technical debt is modeled as residing within the ϵ-band of a computational superposition. Treat the sub-optimal software state simultaneously as Boundary, Interior, and Exterior (Transition Fit).

Calculate the gradient magnitude (|∇d|) and generate a flow-matching artifact (11-risks-and-technical-debt.md) that deliberately defers absolute state collapse until resources permit resolution.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            gradient_magnitude: { type: Type.NUMBER, description: 'The absolute gradient magnitude (|∇d|) of the system function' },
            epsilon_band_status: { type: Type.STRING, description: 'Status of the debt within the epsilon band (e.g., Transition Fit)' },
            risks_and_technical_debt_md: { type: Type.STRING, description: 'The 11-risks-and-technical-debt.md artifact content' }
          },
          required: ['gradient_magnitude', 'epsilon_band_status', 'risks_and_technical_debt_md']
        }
      }
    });

    const jsonStr = response.text?.trim() || '{}';
    const parsed = JSON.parse(jsonStr);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Technical Debt API Error:', error);
    return NextResponse.json({ error: 'Failed to execute Epsilon-Tolerance Paraconsistency evaluation' }, { status: 500 });
  }
}
