import { describe, it, expect } from 'vitest';
import { AgenticPlausibilityOracle } from './AgenticPlausibilityOracle';
import { MetaPromptConfig } from './PhantomDimensionRouter';

describe('AgenticPlausibilityOracle', () => {
  it('should return base scores with empty dissonance for a standard configuration', () => {
    const config: MetaPromptConfig = {
      basePrompt: 'Test standard',
      latentWeights: {
        curvature_penalty: 0.5
      },
      phantomDimensions: [1, 2, 3, 4]
    };
    const result = AgenticPlausibilityOracle.evaluateConfiguration(config);
    expect(result.physicalPlausibilityScore).toBeCloseTo(0.8);
    expect(result.geometricAdherenceScore).toBeCloseTo(0.9);
    expect(result.dissonanceIdentified).toEqual([]);
  });

  it('should apply curvature penalty and detect paraconsistent overlap when curvature is high', () => {
    const config: MetaPromptConfig = {
      basePrompt: 'Test high curvature',
      latentWeights: {
        curvature_penalty: 1.5
      },
      phantomDimensions: [1, 2, 3, 4]
    };
    const result = AgenticPlausibilityOracle.evaluateConfiguration(config);
    expect(result.physicalPlausibilityScore).toBeCloseTo(0.5); // 0.8 - 0.3
    expect(result.geometricAdherenceScore).toBeCloseTo(0.9);
    expect(result.dissonanceIdentified).toContain('Light transport violates conservation of energy in extreme curvature regions. [⊘]');
    expect(result.dissonanceIdentified).toContain('FAILED_NLI_CONTRADICTION: Physically impossible but geometrically valid. Applying Golden Scar protocol. [Φ]');
    expect(result.dissonanceIdentified).toHaveLength(2);
  });

  it('should apply curvature penalty using absolute value when curvature is negative high', () => {
    const config: MetaPromptConfig = {
      basePrompt: 'Test high negative curvature',
      latentWeights: {
        curvature_penalty: -1.5
      },
      phantomDimensions: [1, 2, 3, 4]
    };
    const result = AgenticPlausibilityOracle.evaluateConfiguration(config);
    expect(result.physicalPlausibilityScore).toBeCloseTo(0.5); // 0.8 - 0.3
    expect(result.geometricAdherenceScore).toBeCloseTo(0.9);
    expect(result.dissonanceIdentified).toContain('Light transport violates conservation of energy in extreme curvature regions. [⊘]');
    expect(result.dissonanceIdentified).toContain('FAILED_NLI_CONTRADICTION: Physically impossible but geometrically valid. Applying Golden Scar protocol. [Φ]');
    expect(result.dissonanceIdentified).toHaveLength(2);
  });

  it('should apply dimensionality penalty when phantom dimensions exceed 4', () => {
    const config: MetaPromptConfig = {
      basePrompt: 'Test high dimensionality',
      latentWeights: {
        curvature_penalty: 0.5
      },
      phantomDimensions: [1, 2, 3, 4, 5]
    };
    const result = AgenticPlausibilityOracle.evaluateConfiguration(config);
    expect(result.physicalPlausibilityScore).toBeCloseTo(0.8);
    expect(result.geometricAdherenceScore).toBeCloseTo(0.7); // 0.9 - 0.2
    expect(result.dissonanceIdentified).toContain(`Manifold dimensionality (5) exceeds stable 4D projection bounds. [∇]`);
    expect(result.dissonanceIdentified).toHaveLength(1);
  });

  it('should handle combined extreme conditions without applying paraconsistent overlap', () => {
    const config: MetaPromptConfig = {
      basePrompt: 'Test combined extremes',
      latentWeights: {
        curvature_penalty: 1.5
      },
      phantomDimensions: [1, 2, 3, 4, 5]
    };
    const result = AgenticPlausibilityOracle.evaluateConfiguration(config);
    expect(result.physicalPlausibilityScore).toBeCloseTo(0.5); // 0.8 - 0.3
    expect(result.geometricAdherenceScore).toBeCloseTo(0.7); // 0.9 - 0.2
    expect(result.dissonanceIdentified).toContain('Light transport violates conservation of energy in extreme curvature regions. [⊘]');
    expect(result.dissonanceIdentified).toContain(`Manifold dimensionality (5) exceeds stable 4D projection bounds. [∇]`);
    // Should NOT contain the paraconsistent overlap because gScore is 0.7, not > 0.8
    expect(result.dissonanceIdentified.find(d => d.includes('FAILED_NLI_CONTRADICTION'))).toBeUndefined();
    expect(result.dissonanceIdentified).toHaveLength(2);
  });

  it('should work correctly when latentWeights is missing curvature_penalty', () => {
    const config: MetaPromptConfig = {
      basePrompt: 'Test missing curvature_penalty',
      latentWeights: {
        other_penalty: 1.5
      },
      phantomDimensions: [1, 2]
    };
    const result = AgenticPlausibilityOracle.evaluateConfiguration(config);
    expect(result.physicalPlausibilityScore).toBeCloseTo(0.8);
    expect(result.geometricAdherenceScore).toBeCloseTo(0.9);
    expect(result.dissonanceIdentified).toEqual([]);
  });
});
