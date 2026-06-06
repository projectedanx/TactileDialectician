import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import NeuroSymbolicExecutor from './NeuroSymbolicExecutor';
import { useNeuroSymbolicExecution } from '../hooks/useNeuroSymbolicExecution';

// Mock the react-markdown and rehype/remark plugins since they can be problematic in JSDOM
vi.mock('react-markdown', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="react-markdown">{children}</div>
}));
vi.mock('remark-math', () => ({ default: () => {} }));
vi.mock('rehype-katex', () => ({ default: () => {} }));

vi.mock('../hooks/useNeuroSymbolicExecution', () => ({
  useNeuroSymbolicExecution: vi.fn()
}));

const mockUseNeuroSymbolicExecution = useNeuroSymbolicExecution as any;

describe('NeuroSymbolicExecutor', () => {
  const defaultMockReturn = {
    input: '',
    setInput: vi.fn(),
    trace: [],
    loading: false,
    discoverLoading: false,
    successRate: null,
    savedResults: [],
    handleDiscoverUnsolved: vi.fn(),
    handleSaveResult: vi.fn(),
    handleRemoveSaved: vi.fn(),
    handleExecute: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseNeuroSymbolicExecution.mockReturnValue(defaultMockReturn);
  });

  it('renders initial state correctly', () => {
    render(<NeuroSymbolicExecutor />);
    expect(screen.getByText('Neuro-Symbolic Executor')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g., integrate(x^2, x) or Calculate the derivative of sin(x)*e^x')).toBeInTheDocument();
    expect(screen.getByLabelText('Execute Neuro-Symbolic Computation')).toBeInTheDocument();
    expect(screen.queryByText('Procedural Success Rate')).not.toBeInTheDocument();
    expect(screen.queryByText('Execution Trace')).not.toBeInTheDocument();
    expect(screen.queryByText('Saved Results')).not.toBeInTheDocument();
  });

  it('updates input on typing', () => {
    const setInputMock = vi.fn();
    mockUseNeuroSymbolicExecution.mockReturnValue({
      ...defaultMockReturn,
      setInput: setInputMock
    });

    render(<NeuroSymbolicExecutor />);
    const textarea = screen.getByPlaceholderText('e.g., integrate(x^2, x) or Calculate the derivative of sin(x)*e^x');

    fireEvent.change(textarea, { target: { value: 'integrate(x, x)' } });
    expect(setInputMock).toHaveBeenCalledWith('integrate(x, x)');
  });

  it('calls handleExecute when execute button is clicked', () => {
    const handleExecuteMock = vi.fn();
    mockUseNeuroSymbolicExecution.mockReturnValue({
      ...defaultMockReturn,
      input: 'test',
      handleExecute: handleExecuteMock
    });

    render(<NeuroSymbolicExecutor />);
    const button = screen.getByLabelText('Execute Neuro-Symbolic Computation');
    fireEvent.click(button);
    expect(handleExecuteMock).toHaveBeenCalled();
  });

  it('calls handleExecute when Cmd/Ctrl + Enter is pressed', () => {
    const handleExecuteMock = vi.fn();
    mockUseNeuroSymbolicExecution.mockReturnValue({
      ...defaultMockReturn,
      input: 'test',
      handleExecute: handleExecuteMock
    });

    render(<NeuroSymbolicExecutor />);
    const textarea = screen.getByPlaceholderText('e.g., integrate(x^2, x) or Calculate the derivative of sin(x)*e^x');

    fireEvent.keyDown(textarea, { key: 'Enter', metaKey: true });
    expect(handleExecuteMock).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(textarea, { key: 'Enter', ctrlKey: true });
    expect(handleExecuteMock).toHaveBeenCalledTimes(2);
  });

  it('calls handleDiscoverUnsolved when find button is clicked', () => {
    const handleDiscoverUnsolvedMock = vi.fn();
    mockUseNeuroSymbolicExecution.mockReturnValue({
      ...defaultMockReturn,
      handleDiscoverUnsolved: handleDiscoverUnsolvedMock
    });

    render(<NeuroSymbolicExecutor />);
    const button = screen.getByLabelText('Discover Unsolved Problem');
    fireEvent.click(button);
    expect(handleDiscoverUnsolvedMock).toHaveBeenCalled();
  });

  it('renders Procedural Success Rate when successRate is provided', () => {
    mockUseNeuroSymbolicExecution.mockReturnValue({
      ...defaultMockReturn,
      successRate: 75.4
    });

    render(<NeuroSymbolicExecutor />);
    expect(screen.getByText('Procedural Success Rate')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('renders Execution Trace when trace has items', () => {
    mockUseNeuroSymbolicExecution.mockReturnValue({
      ...defaultMockReturn,
      trace: [
        { type: 'direct', content: 'Step 1 direct', status: 'success' },
        { type: 'llm_reasoning', content: 'Step 2 reasoning', status: 'pending' },
        { type: 'final_result', content: 'Final answer' }
      ]
    });

    render(<NeuroSymbolicExecutor />);
    expect(screen.getByText('Execution Trace')).toBeInTheDocument();
    expect(screen.getByText('Step 1 direct')).toBeInTheDocument();
    expect(screen.getByText('Step 2 reasoning')).toBeInTheDocument();
    expect(screen.getByText('Final answer')).toBeInTheDocument();
  });

  it('renders Saved Results and handles removal', () => {
    const handleRemoveSavedMock = vi.fn();
    mockUseNeuroSymbolicExecution.mockReturnValue({
      ...defaultMockReturn,
      savedResults: [
        { query: 'test query', result: 'test result', date: new Date().toISOString() }
      ],
      handleRemoveSaved: handleRemoveSavedMock
    });

    render(<NeuroSymbolicExecutor />);
    expect(screen.getByText('Saved Results')).toBeInTheDocument();
    expect(screen.getByText('test query')).toBeInTheDocument();
    expect(screen.getByText('test result')).toBeInTheDocument();

    const removeButton = screen.getByLabelText('Remove saved result');
    fireEvent.click(removeButton);
    expect(handleRemoveSavedMock).toHaveBeenCalledWith(0);
  });

  it('calls handleSaveResult from trace final step', () => {
    const handleSaveResultMock = vi.fn();
    mockUseNeuroSymbolicExecution.mockReturnValue({
      ...defaultMockReturn,
      trace: [
        { type: 'final_result', content: 'Result to save' }
      ],
      handleSaveResult: handleSaveResultMock
    });

    render(<NeuroSymbolicExecutor />);

    const saveButton = screen.getByLabelText('Save Final Result');
    fireEvent.click(saveButton);
    expect(handleSaveResultMock).toHaveBeenCalledWith('Result to save');
  });
});
