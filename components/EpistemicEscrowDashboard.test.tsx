import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom'; // Added the jest-dom matchers
import EpistemicEscrowDashboard from './EpistemicEscrowDashboard';

describe('EpistemicEscrowDashboard', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders empty state when no scars are present', () => {
    render(<EpistemicEscrowDashboard />);
    expect(screen.getByText(/No topological drift detected/i)).toBeInTheDocument();
  });

  it('renders symbolic scars from localStorage', () => {
    const mockScars = [
      {
        id: 'scar-123',
        timestamp: new Date().toISOString(),
        eventType: 'FAILED_NLI_CONTRADICTION',
        mutationRecoverabilityScore: 0.4,
        rawError: 'Mock contradiction error'
      }
    ];
    localStorage.setItem('symbolic_scars', JSON.stringify(mockScars));

    render(<EpistemicEscrowDashboard />);
    expect(screen.getByText(/scar-123/i)).toBeInTheDocument();
    expect(screen.getByText(/FAILED_NLI_CONTRADICTION/i)).toBeInTheDocument();
  });

  it('allows annealing a scar', () => {
    const mockScars = [
      {
        id: 'scar-123',
        timestamp: new Date().toISOString(),
        eventType: 'FAILED_NLI_CONTRADICTION',
        mutationRecoverabilityScore: 0.4,
        rawError: 'Mock error'
      }
    ];
    localStorage.setItem('symbolic_scars', JSON.stringify(mockScars));

    render(<EpistemicEscrowDashboard />);
    const annealBtn = screen.getByText(/ANNEAL \(DEBRIDE\)/i);
    fireEvent.click(annealBtn);

    const remainingScars = JSON.parse(localStorage.getItem('symbolic_scars') || '[]');
    expect(remainingScars).toHaveLength(0);
    expect(screen.queryByText(/scar-123/i)).not.toBeInTheDocument();
  });

  it('allows holding a scar in tension (Golden Scar)', () => {
    const mockScars = [
      {
        id: 'scar-123',
        timestamp: new Date().toISOString(),
        eventType: 'FAILED_NLI_CONTRADICTION',
        mutationRecoverabilityScore: 0.4,
        rawError: 'Mock error'
      }
    ];
    localStorage.setItem('symbolic_scars', JSON.stringify(mockScars));

    render(<EpistemicEscrowDashboard />);
    const tensionBtn = screen.getByText(/HOLD IN TENSION \(Φ\)/i);
    fireEvent.click(tensionBtn);

    const remainingScars = JSON.parse(localStorage.getItem('symbolic_scars') || '[]');
    // Should still be there, but maybe marked or UI updated.
    // We just verify it hasn't been deleted from localStorage.
    expect(remainingScars).toHaveLength(1);
    expect(remainingScars[0].goldenScarApplied).toBe(true);
  });
});
