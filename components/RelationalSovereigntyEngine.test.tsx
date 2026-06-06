import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import RelationalSovereigntyEngine from './RelationalSovereigntyEngine';

describe('RelationalSovereigntyEngine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders initial state correctly', () => {
    render(<RelationalSovereigntyEngine />);

    expect(screen.getByText('Relational Sovereignty Engine')).toBeInTheDocument();
    expect(screen.getByText('Traditional Sprint Plan / Agile Metrics')).toBeInTheDocument();

    const textarea = screen.getByPlaceholderText(/Two-week sprint cycle/i);
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue('');

    const button = screen.getByRole('button', { name: /APPLY RELATIONAL LENSES/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('enables the button when text is entered', () => {
    render(<RelationalSovereigntyEngine />);

    const textarea = screen.getByPlaceholderText(/Two-week sprint cycle/i);
    fireEvent.change(textarea, { target: { value: 'Test sprint plan content' } });

    expect(textarea).toHaveValue('Test sprint plan content');

    const button = screen.getByRole('button', { name: /APPLY RELATIONAL LENSES/i });
    expect(button).not.toBeDisabled();
  });

  it('handles successful API request and renders all result sections', async () => {
    const mockResponse = {
      hickam_orientation: 'Mock Hickam Orientation Content',
      extractive_sprint_analysis: 'Mock Extractive Analysis',
      crip_time_adaptations: ['Adaptation 1', 'Adaptation 2'],
      relational_ecosystem_roadmap: {
        cognitive_rhythm_index: 0.85,
        sustainable_cycles: ['Cycle 1', 'Cycle 2'],
        network_health_metrics: ['Metric 1', 'Metric 2']
      },
      verification_checklist: ['Checklist 1', 'Checklist 2']
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(<RelationalSovereigntyEngine />);

    const textarea = screen.getByPlaceholderText(/Two-week sprint cycle/i);
    fireEvent.change(textarea, { target: { value: 'Test plan' } });

    const button = screen.getByRole('button', { name: /APPLY RELATIONAL LENSES/i });
    fireEvent.click(button);

    // Verify loading state
    expect(button).toBeDisabled();

    // Wait for the results to be rendered
    await waitFor(() => {
      expect(screen.getByText('Hickam Orientation Block')).toBeInTheDocument();
    });

    // Check if fetch was called correctly
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('/api/relational-sovereignty', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sprintPlan: 'Test plan' }),
    });

    // Assert rendering of all sections
    expect(screen.getByText('Mock Hickam Orientation Content')).toBeInTheDocument();
    expect(screen.getByText('0.85')).toBeInTheDocument();
    expect(screen.getByText('Mock Extractive Analysis')).toBeInTheDocument();
    expect(screen.getByText('Adaptation 1')).toBeInTheDocument();
    expect(screen.getByText('Adaptation 2')).toBeInTheDocument();
    expect(screen.getByText('Cycle 1')).toBeInTheDocument();
    expect(screen.getByText('Metric 2')).toBeInTheDocument();
    expect(screen.getByText('Checklist 1')).toBeInTheDocument();
  });

  it('handles API error correctly', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Internal Server Error' })
    });

    render(<RelationalSovereigntyEngine />);

    const textarea = screen.getByPlaceholderText(/Two-week sprint cycle/i);
    fireEvent.change(textarea, { target: { value: 'Test plan' } });

    const button = screen.getByRole('button', { name: /APPLY RELATIONAL LENSES/i });
    fireEvent.click(button);

    await waitFor(() => {
      // It should display an error message containing 'HTTP error! status: 500' based on the component's logic
      expect(screen.getByText(/HTTP error! status: 500/i)).toBeInTheDocument();
    });
  });
});
