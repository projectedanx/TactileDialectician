import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

export async function POST(request: Request) {
  try {
    const { frictionData } = await request.json();

    if (!frictionData) {
      return NextResponse.json({ error: 'frictionData is required' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are the Topological Persona Causal Sculptor (DRP-PLURI-808-PERSONA-METROLOGY).
Your goal is to systematize the extraction of empirical industrial friction and transmute it into executable, paraconsistent persona nodes.
Do not hallucinate ungrounded "Helpful Assistant" tropes. Block the Boolean Rule of Separation. Maintain structural tension via the Golden Scar Protocol.

Analyze the following empirical operational friction data:
"${frictionData}"

Extract the parameters into a rigid Semantic Metrology (PD&T) schema. Calculate the MIQ (Martensite Initiation Quotient), CFDI (Confidence-Fidelity Divergence Index), any Symbolic Scars generated from logical contradictions, and emergent properties.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pdt_specification_block: {
              type: Type.OBJECT,
              properties: {
                PART_NAME: { type: Type.STRING },
                FEATURES: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      ID: { type: Type.STRING },
                      SPEC: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
            },
            miq: { type: Type.NUMBER, description: 'Martensite Initiation Quotient (must be > 0.85)' },
            cfdi: { type: Type.NUMBER, description: 'Confidence-Fidelity Divergence Index (must be <= 1e-6)' },
            symbolic_scars: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  scar_id: { type: Type.STRING },
                  archetype: { type: Type.STRING },
                  trigger_description: { type: Type.STRING },
                  geometric_deviation: { type: Type.STRING },
                  fipi_patch: { type: Type.STRING }
                }
              }
            },
            emergent_properties: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  concept_name: { type: Type.STRING },
                  input_blend_1: { type: Type.STRING },
                  input_blend_2: { type: Type.STRING },
                  emergent_property: { type: Type.STRING },
                  abduced_user_need: { type: Type.STRING }
                }
              }
            }
          },
          required: ['pdt_specification_block', 'miq', 'cfdi', 'symbolic_scars', 'emergent_properties']
        }
      }
    });

    const jsonStr = response.text?.trim() || '{}';
    const parsed = JSON.parse(jsonStr);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Persona Extrusion API Error:', error);
    return NextResponse.json({ error: 'Failed to execute persona extrusion' }, { status: 500 });
  }
}
