import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PluriversalFeatureDiscoveryAgent, FeatureNode } from './PluriversalFeatureDiscoveryAgent';
import * as errorHandling from '../../utils/errorHandling';

vi.mock('../../utils/errorHandling', () => ({
  logSymbolicScar: vi.fn(),
  parseAIError: vi.fn(),
}));

describe('PluriversalFeatureDiscoveryAgent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const feature1: FeatureNode = {
    id: 'f1',
    domain: 'Deterministic',
    parameters: {
      execution_mode: 'sync',
      routing: 'static'
    }
  };

  const feature2: FeatureNode = {
    id: 'f2',
    domain: 'Probabilistic',
    parameters: {
      execution_mode: 'async', // Contradicts f1
      routing: 'static'
    }
  };

  it('should identify Partially Overlapping (PO) features and set PARACONSISTENT_STATE and phantomDimension', () => {
    const result = PluriversalFeatureDiscoveryAgent.synthesizeFeatures(feature1, feature2);
    expect(result.rcc8State).toBe('PO');
    expect(result.paraconsistentStateActive).toBe(true);
    expect(result.phantomDimensionActive).toBe(true);
    expect(result.dissonanceIdentified).toHaveLength(1);
    expect(result.dissonanceIdentified[0]).toContain("Contradiction on parameter 'execution_mode'");
    expect(result.cfdi).toBeCloseTo(0.1);
    expect(errorHandling.logSymbolicScar).not.toHaveBeenCalled();
  });

  it('should calculate CFDI correctly and log FAILED_NLI_CONTRADICTION scar when CFDI > 0.15', () => {
    const f3: FeatureNode = {
      id: 'f3',
      domain: 'Domain3',
      parameters: {
        execution_mode: 'async', // 1
        routing: 'dynamic' // 2
      }
    };
    const result = PluriversalFeatureDiscoveryAgent.synthesizeFeatures(feature1, f3);

    expect(result.cfdi).toBeCloseTo(0.2); // 2 contradictions * 0.1
    expect(errorHandling.logSymbolicScar).toHaveBeenCalledWith(
      'FAILED_NLI_CONTRADICTION',
      expect.objectContaining({
        cfdi: 0.2,
        crs: true
      }),
      0.6
    );
  });

  it('should mathematically validate the topological overlap with CoC Enactment', () => {
    const topology = PluriversalFeatureDiscoveryAgent.synthesizeFeatures(feature1, feature2);
    const coc = PluriversalFeatureDiscoveryAgent.generateCoCSimulation(topology);

    expect(coc.language).toBe('Python');
    expect(coc.script).toContain('def simulate_thermodynamic_restoration()');
    expect(coc.script).toContain('def apply_z_axis_inference()');
  });

  it('should handle DC (Disconnected) states properly without Z-Axis inference', () => {
    const f4: FeatureNode = {
      id: 'f4',
      domain: 'Independent',
      parameters: {
        execution_mode: 'sync',
        routing: 'static'
      }
    };
    const result = PluriversalFeatureDiscoveryAgent.synthesizeFeatures(feature1, f4);

    expect(result.rcc8State).toBe('DC');
    expect(result.paraconsistentStateActive).toBe(false);
    expect(result.phantomDimensionActive).toBe(false);
    expect(result.cfdi).toBe(0);

    const coc = PluriversalFeatureDiscoveryAgent.generateCoCSimulation(result);
    expect(coc.script).not.toContain('def apply_z_axis_inference()');
  });
});
