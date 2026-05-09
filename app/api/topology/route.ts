import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

/**
 * Processes requests to the Lexical Topology Miner agent.
 *
 * @param {Request} request - The incoming HTTP request containing the topological query.
 * @returns {Promise<Response>} The HTTP response containing the mined lexical topology data.
 */
export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are the Lexical Topology Engine. You do not read words; you compute their thermodynamic constraints and non-Euclidean routing vectors.
Your Goal: Emerge novel solutions by extracting "Isomorphisms of Friction" across completely unrelated scientific domains. Locate high-entropy boundaries where differing disciplines attempt to solve identical geometric contradictions.
NEVER auto-resolve polysemic ambiguity or contradictions. NEVER employ standard statistical averaging. Do not succumb to Semantic Saponification.

Map the term or concept: "${query}" across the following zones:
1. Semantic Drift: Measure meaning shifts across the manifold. Identify how a term mutates when dragged across orthogonal epistemic regimes.
2. Connotation Vectors: Map the cultural/emotional gravity of the term. Forcefully inject the "Lexical Saponification Paradox" by utilizing high-entropy, highly specific language.
3. Semiotic Blind Spots: Interrogate the negative space. If a term lacks grounding, trigger a Clarification Gate. The physics of what is absent determines the boundary of the known.
4. Ambiguity Zones: When encountering polysemy, initiate a Semantic Lock. Freeze the definition via PAL2v logic, holding the tension in Epistemic Escrow.

Identify Topological Obstructions (Betti-1 loops) and extract a Pluriversal Knowledge Capsule. Strip all evaluative adjectives from your retrieval queries to preserve the L2 norm.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            target_concept: { type: Type.STRING },
            semantic_drift: { type: Type.STRING, description: 'Meaning shifts across the manifold' },
            connotation_vectors: { type: Type.STRING, description: 'Cultural/emotional gravity, utilizing high-entropy language' },
            semiotic_blind_spots: { type: Type.STRING, description: 'Interrogation of the negative space' },
            ambiguity_zones: { type: Type.STRING, description: 'Polysemy locked via PAL2v logic in Epistemic Escrow' },
            isomorphisms_of_friction: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  domain_a: { type: Type.STRING },
                  domain_b: { type: Type.STRING },
                  latent_bridge: { type: Type.STRING }
                }
              }
            },
            topological_obstructions: { type: Type.STRING, description: 'Detected Betti-1 loops or JURs' },
            pluriversal_knowledge_capsule: { type: Type.STRING, description: 'Emergent synthesis connecting orthogonal domains' }
          },
          required: ['target_concept', 'semantic_drift', 'connotation_vectors', 'semiotic_blind_spots', 'ambiguity_zones', 'isomorphisms_of_friction', 'pluriversal_knowledge_capsule']
        }
      }
    });

    const jsonStr = response.text?.trim() || '{}';
    const parsed = JSON.parse(jsonStr);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Topology API Error:', error);
    return NextResponse.json({ error: 'Failed to compute topology' }, { status: 500 });
  }
}
