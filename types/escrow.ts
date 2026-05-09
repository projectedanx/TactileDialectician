/**
 * Describes the structure of a logical contradiction intercepted by the system.
 */
export interface ContradictionPayload {
  id: string;
  timestamp: string;
  source: string;
  narrative: string;
  crs: number;
  derivative: string;
  status: 'pending' | 'resolved' | 'annealed';
  dominantWeight: number;
  subordinateWeight: number;
}
