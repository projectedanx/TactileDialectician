/**
 * Represents a specific vector of knowledge provenance, tracking the source and epistemic weight.
 */
export interface ProvenanceVector {
  sourceDomain: string;
  weight: number; // 0.0 to 1.0
  driftPotential: number; // 0.0 to 1.0
}

/**
 * The Provenance Tracker.
 * Manages and logs the lineage of data transformations across the epistemic matrix.
 */
export class ProvenanceTracker {
    private vectors: Map<string, ProvenanceVector>;

    constructor(initialVectors: ProvenanceVector[]) {
        this.vectors = new Map(initialVectors.map(v => [v.sourceDomain, v]));
    }

    /**
     * Calculates the aggregate Semantic Drift based on current provenance weights.
     */
    calculateSemanticDrift(): number {
        let totalDrift = 0;
        let totalWeight = 0;

        for (const vector of this.vectors.values()) {
            totalDrift += (vector.driftPotential * vector.weight);
            totalWeight += vector.weight;
        }

        return totalWeight > 0 ? totalDrift / totalWeight : 0;
    }

    /**
     * Dynamically adjusts the weight of a specific provenance vector to mitigate drift or enforce ethical boundaries.
     */
    adjustProvenanceWeight(sourceDomain: string, newWeight: number): void {
        const vector = this.vectors.get(sourceDomain);
        if (vector) {
            // Apply a dampening factor to prevent sudden catastrophic shifts (Topological continuity)
            vector.weight = (vector.weight * 0.2) + (Math.max(0, Math.min(1, newWeight)) * 0.8);
            this.vectors.set(sourceDomain, vector);
        }
    }

    /**
     * Retrieves all tracked provenance vectors.
     *
     * @returns {ProvenanceVector[]} An array of all stored provenance vectors.
     */
    getVectors(): ProvenanceVector[] {
        return Array.from(this.vectors.values());
    }
}
