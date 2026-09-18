import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

/**
 * API route for semantic tokenization.
 * Breaks down prompts into constrained semantic tokens.
 *
 * @param {Request} request - The inbound HTTP request containing the prompt.
 * @returns {Promise<Response>} The JSON response with semantic tokens.
 */
export async function POST(request: Request) {
  try {
    const { input, inputMode, domainContext } = await request.json();

    if (!input) {
      return NextResponse.json({ error: 'Input is required' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
    const model = 'gemini-2.5-flash';

    let prompt = '';
    if (inputMode === 'extract') {
      prompt = `Extract ALL mathematical, scientific, or domain-specific symbols from the following expression and generate a FoNE (Foundation of Neuro-symbolic Embeddings) tokenization profile for EACH symbol.
      Expression: "${input}"
      Domain Context: "${domainContext}"`;
    } else {
      prompt = `Generate a FoNE (Foundation of Neuro-symbolic Embeddings) tokenization profile for EACH symbol in the following list.
      List: "${input}"
      Domain Context: "${domainContext}"`;
    }

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              symbol: { type: Type.STRING },
              atomic_token_id: { type: Type.INTEGER },
              fragmented_bytes: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              fone_embedding: {
                type: Type.OBJECT,
                properties: {
                  operator_class: { type: Type.STRING },
                  tensor_rank_effect: { type: Type.STRING },
                  virtual_weight_3: { type: Type.NUMBER },
                  latent_topological_pathway: { type: Type.STRING },
                  domain_weight_physics: { type: Type.NUMBER },
                  domain_weight_math: { type: Type.NUMBER },
                  domain_weight_ml: { type: Type.NUMBER }
                },
                required: [
                  'operator_class',
                  'tensor_rank_effect',
                  'virtual_weight_3',
                  'latent_topological_pathway',
                  'domain_weight_physics',
                  'domain_weight_math',
                  'domain_weight_ml'
                ]
              }
            },
            required: ['symbol', 'atomic_token_id', 'fragmented_bytes', 'fone_embedding']
          }
        }
      }
    });

    const data = JSON.parse(response.text || '[]');
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Tokenization API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
