import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as math from "mathjs";
import nerdamer from "nerdamer";
import "nerdamer/Calculus.js";
import "nerdamer/Algebra.js";
import "nerdamer/Solve.js";

const server = new McpServer({
  name: "korsakov-neurosymbolic-server",
  version: "2026.4.1",
});

// KORSAKOV: PHASE_3_EXECUTION. Persona suspended. Type-system active.
// 6-component rubric: Purpose✓ Guidelines✓ Limitations✓ Params✓ Length✓
server.tool(
  "symbolic_compute",
  [
    "PURPOSE: Executes deterministic symbolic mathematical evaluation using the nerdamer parser.",
    "GUIDELINES: Invoke when the agent requires symbolic manipulation (algebra, calculus, equation solving).",
    "Do not use Python/SymPy syntax. Complex numbers use 'i' (e.g., '2 + 3i').",
    "LIMITATIONS: expression maxLength 2048 characters. If the tool echoes the input",
    "function (e.g., input 'zeta(-2)' returns '-2*zeta'), the function is unsupported.",
    "PARAMETERS: expression — valid mathematical expression string."
  ].join(" "),
  {
    expression: z.string().max(2048).describe("Mathematical expression string to evaluate symbolically. Max 2048 characters."),
  },
  async ({ expression }) => {
    try {
      const result = nerdamer(expression).evaluate().text();
      return {
        content: [{ type: "text", text: JSON.stringify({ status: "EXECUTED", result }) }],
      };
    } catch (err: any) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error_code: "TOOL_FAULT_GENERAL_PROGRAMMING",
              fault_category: "GENERAL_PROGRAMMING",
              structured_detail: {
                violation: "PARSING_ERROR",
                error: String(err.message || err),
              },
              retry_viable: true,
              suggested_decomposition: "Verify mathematical syntax. Ensure no unsupported Python/SymPy functions are used.",
            }),
          },
        ],
        isError: true,
      };
    }
  }
);

// KORSAKOV: PHASE_3_EXECUTION. Persona suspended. Type-system active.
// 6-component rubric: Purpose✓ Guidelines✓ Limitations✓ Params✓ Length✓
server.tool(
  "numeric_compute",
  [
    "PURPOSE: Executes deterministic numeric mathematical evaluation using the mathjs parser.",
    "GUIDELINES: Invoke when the agent requires numeric calculation or matrix operations.",
    "Do not use Python syntax. Complex numbers use 'i'.",
    "LIMITATIONS: expression maxLength 2048 characters.",
    "PARAMETERS: expression — valid mathematical expression string."
  ].join(" "),
  {
    expression: z.string().max(2048).describe("Mathematical expression string to evaluate numerically. Max 2048 characters."),
  },
  async ({ expression }) => {
    try {
      const result = math.evaluate(expression).toString();
      return {
        content: [{ type: "text", text: JSON.stringify({ status: "EXECUTED", result }) }],
      };
    } catch (err: any) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error_code: "TOOL_FAULT_GENERAL_PROGRAMMING",
              fault_category: "GENERAL_PROGRAMMING",
              structured_detail: {
                violation: "EVALUATION_ERROR",
                error: String(err.message || err),
              },
              retry_viable: true,
              suggested_decomposition: "Verify mathematical syntax. Ensure variables are defined or operations are valid for mathjs.",
            }),
          },
        ],
        isError: true,
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write("KORSAKOV: stdio transport active. MCP 2025-11-25.\n");
}

main().catch((err) => {
  process.stderr.write(`KORSAKOV: Fatal — ${err.message}\n`);
  process.exit(1);
});
