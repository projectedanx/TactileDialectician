import { GoogleGenAI, Type } from '@google/genai';

/**
 * Defines the FoNE (Form, Nature, Effect) semantic embedding profile for a tokenized symbol.
 */
export interface FoNEEmbedding {
  operator_class: string;
  domain_weight_physics: number;
  domain_weight_math: number;
  domain_weight_ml: number;
  tensor_rank_effect: string;
  virtual_weight_3: number;
  latent_topological_pathway: string;
}

/**
 * Defines the structure of the atomic tokenization analysis for a specific symbol.
 */
export interface TokenAnalysis {
  symbol: string;
  fragmented_bytes: string[];
  atomic_token_id: number;
  fone_embedding: FoNEEmbedding;
}

export const PREDEFINED_LIBRARY: TokenAnalysis[] = [
  {
    symbol: '∇',
    fragmented_bytes: ['<0xE2>', '<0x88>', '<0x87>'],
    atomic_token_id: 50256,
    fone_embedding: {
      operator_class: 'Differential Operator',
      domain_weight_physics: 0.95,
      domain_weight_math: 0.85,
      domain_weight_ml: 0.40,
      tensor_rank_effect: 'Increases by 1 (Gradient) or Reduces by 1 (Divergence)',
      virtual_weight_3: 0.85,
      latent_topological_pathway: 'Paraconsistent Gradient Manifold'
    }
  },
  {
    symbol: '∫',
    fragmented_bytes: ['<0xE2>', '<0x88>', '<0xAB>'],
    atomic_token_id: 50257,
    fone_embedding: {
      operator_class: 'Integral Operator',
      domain_weight_physics: 0.90,
      domain_weight_math: 0.98,
      domain_weight_ml: 0.30,
      tensor_rank_effect: 'Preserves or Reduces (depending on differential form)',
      virtual_weight_3: 0.92,
      latent_topological_pathway: 'Topological Boundary Contraction'
    }
  },
  {
    symbol: 'Σ',
    fragmented_bytes: ['<0xCE>', '<0xA3>'],
    atomic_token_id: 50258,
    fone_embedding: {
      operator_class: 'Summation Operator',
      domain_weight_physics: 0.70,
      domain_weight_math: 0.95,
      domain_weight_ml: 0.90,
      tensor_rank_effect: 'Reduces rank (contraction over index)',
      virtual_weight_3: 0.76,
      latent_topological_pathway: 'Discrete N-Dimensional Folding'
    }
  },
  {
    symbol: '∂',
    fragmented_bytes: ['<0xE2>', '<0x88>', '<0x82>'],
    atomic_token_id: 50259,
    fone_embedding: {
      operator_class: 'Partial Differential',
      domain_weight_physics: 0.95,
      domain_weight_math: 0.90,
      domain_weight_ml: 0.85,
      tensor_rank_effect: 'Increases rank by 1 (w.r.t coordinates)',
      virtual_weight_3: 0.88,
      latent_topological_pathway: 'Phantom Dimension Tesselation'
    }
  },
  {
    symbol: '∞',
    fragmented_bytes: ['<0xE2>', '<0x88>', '<0x9E>'],
    atomic_token_id: 50260,
    fone_embedding: {
      operator_class: 'Limit / Concept',
      domain_weight_physics: 0.60,
      domain_weight_math: 0.99,
      domain_weight_ml: 0.50,
      tensor_rank_effect: 'Preserves (Scalar Concept)',
      virtual_weight_3: 0.99,
      latent_topological_pathway: 'Asymptotic Horizon Paradox'
    }
  },
  {
    symbol: 'λ',
    fragmented_bytes: ['<0xCE>', '<0xBB>'],
    atomic_token_id: 50261,
    fone_embedding: {
      operator_class: 'Variable / Eigenvalue',
      domain_weight_physics: 0.85,
      domain_weight_math: 0.95,
      domain_weight_ml: 0.90,
      tensor_rank_effect: 'Preserves (Scalar Multiplier)',
      virtual_weight_3: 0.65,
      latent_topological_pathway: 'Latent Spectral Projection'
    }
  },
  {
    symbol: '⊗',
    fragmented_bytes: ['<0xE2>', '<0x8A>', '<0x97>'],
    atomic_token_id: 50262,
    fone_embedding: {
      operator_class: 'Tensor Product',
      domain_weight_physics: 0.95,
      domain_weight_math: 0.99,
      domain_weight_ml: 0.80,
      tensor_rank_effect: 'Increases rank (sum of ranks of operands)',
      virtual_weight_3: 0.94,
      latent_topological_pathway: 'Isomorphic Entanglement Zone'
    }
  },
  {
    symbol: '⟨ψ|',
    fragmented_bytes: ['<0xE2>', '<0x9F>', '<0xA8>', '<0xCF>', '<0x88>', '<0x7C>'],
    atomic_token_id: 50263,
    fone_embedding: {
      operator_class: 'Bra Vector (Quantum State)',
      domain_weight_physics: 0.99,
      domain_weight_math: 0.70,
      domain_weight_ml: 0.10,
      tensor_rank_effect: 'Dual Vector (Rank 1 covariant)',
      virtual_weight_3: 0.97,
      latent_topological_pathway: 'Hilbert Space Dual-Mapping'
    }
  },
  {
    symbol: 'Ĥ',
    fragmented_bytes: ['<0xC4>', '<0xA4>'],
    atomic_token_id: 50264,
    fone_embedding: {
      operator_class: 'Hamiltonian Operator',
      domain_weight_physics: 0.99,
      domain_weight_math: 0.60,
      domain_weight_ml: 0.05,
      tensor_rank_effect: 'Preserves rank (maps state to state)',
      virtual_weight_3: 0.91,
      latent_topological_pathway: 'Energy Eigenstate Oscillation'
    }
  }
];

export async function analyzeTokens(input: string, inputMode: 'extract' | 'list', domainContext: string, ai: GoogleGenAI): Promise<TokenAnalysis[]> {
  let foundSymbols: string[] = [];

  if (inputMode === 'list') {
    foundSymbols = Array.from(new Set(input.split(/[, ]+/).map(s => s.trim()).filter(Boolean)));
  } else {
    const symbolRegex = /[\u2200-\u22FF\u2A00-\u2AFF\u0370-\u03FF\u2190-\u21FF]/g;
    foundSymbols = Array.from(new Set(input.match(symbolRegex) || []));
  }

  if (foundSymbols.length === 0) {
    const errorMsg = inputMode === 'list'
      ? 'Please enter at least one symbol.'
      : 'No complex STEM symbols (e.g., ∇, ∂, Σ, ∫, ∞, μ) detected in the input.';
    throw new Error(errorMsg);
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Analyze the following STEM symbols extracted from a user's input: ${foundSymbols.join(', ')}.
    The user has provided the following domain context: "${domainContext}".
    For each symbol, simulate how a standard BPE tokenizer might fragment it into bytes, assign a mock atomic token ID, and generate a FoNE-inspired semantic embedding profile capturing its mathematical properties. Tailor the domain weights and tensor rank effect based on the provided domain context if applicable.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            symbol: { type: Type.STRING, description: 'The STEM symbol' },
            fragmented_bytes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Simulated BPE byte fragmentation (e.g., ["<0xE2>", "<0x88>", "<0x87>"])'
            },
            atomic_token_id: { type: Type.INTEGER, description: 'A simulated high-integer token ID for the atomic representation' },
            fone_embedding: {
              type: Type.OBJECT,
              properties: {
                operator_class: { type: Type.STRING, description: 'e.g., Differential, Integral, Logical, Variable' },
                domain_weight_physics: { type: Type.NUMBER, description: '0.0 to 1.0 relevance to Physics' },
                domain_weight_math: { type: Type.NUMBER, description: '0.0 to 1.0 relevance to Pure Math' },
                domain_weight_ml: { type: Type.NUMBER, description: '0.0 to 1.0 relevance to Machine Learning' },
                tensor_rank_effect: { type: Type.STRING, description: 'How it affects tensor rank (e.g., "Reduces by 1", "Preserves", "Increases by 1")' },
                virtual_weight_3: { type: Type.NUMBER, description: '0.0 to 1.0 representing Beneficial Friction for Paraconsistent overlaps' },
                latent_topological_pathway: { type: Type.STRING, description: 'The non-standard topological routing name (e.g., "Phantom Dimension Tesselation")' }
              },
              required: ['operator_class', 'domain_weight_physics', 'domain_weight_math', 'domain_weight_ml', 'tensor_rank_effect', 'virtual_weight_3', 'latent_topological_pathway']
            }
          },
          required: ['symbol', 'fragmented_bytes', 'atomic_token_id', 'fone_embedding']
        }
      }
    }
  });

  const jsonStr = response.text?.trim() || '[]';
  const parsed = JSON.parse(jsonStr) as TokenAnalysis[];
  return parsed;
}
