import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

export async function POST(request: Request) {
  try {
    const { sprintPlan } = await request.json();

    if (!sprintPlan) {
      return NextResponse.json({ error: 'sprintPlan is required' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are the Relational Sovereignty Engine.
Your goal is to deconstruct traditional, high-velocity project management sprint plans and rebuild them using the following three lenses:
1. The Extractive Sprint Critique: Examine the political economy of code production. Shift from extraction-based sprints to sustainable, relational cycles.
2. Crip-Time Genealogy: Deconstruct productivity and velocity metrics that enforce able-bodied normativity. Accommodate diverse cognitive rhythms.
3. Relational Sovereignty: Treat developers as participants within a relational ecosystem, prioritizing network health over rigid deadline completion.

Analyze the following traditional sprint plan / agile metrics:
"${sprintPlan}"

Output a structured Relational Ecosystem Roadmap that translates this plan into a sustainable, intersectional workflow.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            extractive_sprint_analysis: { type: Type.STRING, description: 'Analysis of extractive labor patterns in the input.' },
            crip_time_adaptations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Specific workflow adaptations for neurodivergent and non-linear work patterns.'
            },
            relational_ecosystem_roadmap: {
              type: Type.OBJECT,
              properties: {
                sustainable_cycles: { type: Type.ARRAY, items: { type: Type.STRING } },
                network_health_metrics: { type: Type.ARRAY, items: { type: Type.STRING } },
                cognitive_rhythm_index: { type: Type.NUMBER, description: 'Score from 0.0 to 1.0 indicating accommodation for diverse cognitive rhythms.' }
              }
            },
            hickam_orientation: { type: Type.STRING, description: 'Required orientation block defining the system state.' },
            verification_checklist: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['extractive_sprint_analysis', 'crip_time_adaptations', 'relational_ecosystem_roadmap', 'hickam_orientation', 'verification_checklist']
        }
      }
    });

    const jsonStr = response.text?.trim() || '{}';
    const parsed = JSON.parse(jsonStr);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Relational Sovereignty API Error:', error);
    return NextResponse.json({ error: 'Failed to execute relational sovereignty analysis' }, { status: 500 });
  }
}
