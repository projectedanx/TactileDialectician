import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockTool = vi.fn();
const mockConnect = vi.fn().mockResolvedValue(undefined);

vi.mock('@modelcontextprotocol/sdk/server/mcp.js', () => {
  return {
    McpServer: function() {
      return {
        tool: mockTool,
        connect: mockConnect,
      };
    }
  };
});

vi.mock('@modelcontextprotocol/sdk/server/stdio.js', () => {
  return {
    StdioServerTransport: function() {
      return {};
    }
  };
});

const mockMathEvaluate = vi.fn();
vi.mock('mathjs', () => ({
  create: vi.fn(() => ({
    evaluate: mockMathEvaluate,
    import: vi.fn()
  })),
  all: {}
}));

const mockNerdamerEvaluate = vi.fn();
const mockNerdamer = Object.assign(vi.fn(() => ({
  evaluate: mockNerdamerEvaluate
})), {
  // Add any static properties if needed
});

vi.mock('nerdamer', () => ({ default: mockNerdamer }));
vi.mock('nerdamer/Calculus.js', () => ({}));
vi.mock('nerdamer/Algebra.js', () => ({}));
vi.mock('nerdamer/Solve.js', () => ({}));

describe('MCP Server Tool Execution Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('should return isError true when symbolic_compute throws an error', async () => {
    // Force error in nerdamer
    mockNerdamerEvaluate.mockImplementation(() => {
      throw new Error("Mocked parsing error");
    });

    await import('./index');

    // Find the symbolic_compute registration
    const symbolicComputeCall = mockTool.mock.calls.find(call => call[0] === 'symbolic_compute') as any[];
    expect(symbolicComputeCall).toBeDefined();

    // The handler is the last argument to server.tool
    const handler = symbolicComputeCall[symbolicComputeCall.length - 1];

    // Execute the handler
    const response = await handler({ expression: 'invalid' }, {});

    expect(response.isError).toBe(true);
    expect(response.content[0].type).toBe('text');
    const content = JSON.parse(response.content[0].text);
    expect(content.structured_detail.error).toBe('Mocked parsing error');
  });

  it('should return isError true when numeric_compute throws an error', async () => {
    // Force error in math.evaluate
    mockMathEvaluate.mockImplementation(() => {
      throw new Error("Mocked numeric evaluation error");
    });

    await import('./index');

    // Find the numeric_compute registration
    const numericComputeCall = mockTool.mock.calls.find(call => call[0] === 'numeric_compute') as any[];
    expect(numericComputeCall).toBeDefined();

    // The handler is the last argument to server.tool
    const handler = numericComputeCall[numericComputeCall.length - 1];

    // Execute the handler
    const response = await handler({ expression: 'invalid' }, {});

    expect(response.isError).toBe(true);
    expect(response.content[0].type).toBe('text');
    const content = JSON.parse(response.content[0].text);
    expect(content.structured_detail.error).toBe('Mocked numeric evaluation error');
  });

  it('should return result when symbolic_compute succeeds', async () => {
    // Mock successful execution
    mockNerdamerEvaluate.mockImplementation(() => ({
      text: () => "success_symbolic"
    }));

    await import('./index');

    const symbolicComputeCall = mockTool.mock.calls.find(call => call[0] === 'symbolic_compute') as any[];
    expect(symbolicComputeCall).toBeDefined();

    const handler = symbolicComputeCall[symbolicComputeCall.length - 1];
    const response = await handler({ expression: 'valid' }, {});

    expect(response.isError).toBeUndefined(); // Should not be true
    expect(response.content[0].type).toBe('text');
    const content = JSON.parse(response.content[0].text);
    expect(content.status).toBe('EXECUTED');
    expect(content.result).toBe('success_symbolic');
  });

  it('should return result when numeric_compute succeeds', async () => {
    // Mock successful execution
    mockMathEvaluate.mockImplementation(() => ({
      toString: () => "success_numeric"
    }));

    await import('./index');

    const numericComputeCall = mockTool.mock.calls.find(call => call[0] === 'numeric_compute') as any[];
    expect(numericComputeCall).toBeDefined();

    const handler = numericComputeCall[numericComputeCall.length - 1];
    const response = await handler({ expression: 'valid' }, {});

    expect(response.isError).toBeUndefined(); // Should not be true
    expect(response.content[0].type).toBe('text');
    const content = JSON.parse(response.content[0].text);
    expect(content.status).toBe('EXECUTED');
    expect(content.result).toBe('success_numeric');
  });
});
