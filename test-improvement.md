# 🧪 Test Error Handling in MCP Tool Execution

## 🎯 What
This PR addresses the testing gap in the `mcp-server/index.ts` file, specifically the error handling paths for the registered tools (`symbolic_compute` and `numeric_compute`). Previously, the catch blocks that format parsing/evaluation errors and attach the `isError: true` flag were untested.

## 📊 Coverage
The new test file (`mcp-server/index.test.ts`) adds the following coverage:
*   **symbolic_compute (Success):** Verifies correct output format (`status: "EXECUTED"`, missing `isError` flag) when `nerdamer.evaluate()` succeeds.
*   **symbolic_compute (Error):** Verifies that an error thrown during parsing/evaluation is caught and returned with `isError: true` and the correct structured JSON detail (`error_code`, `fault_category`, `structured_detail.error`, etc.).
*   **numeric_compute (Success):** Verifies correct output format when `mathjs.evaluate()` succeeds.
*   **numeric_compute (Error):** Verifies that an error thrown during numeric evaluation is similarly caught and mapped to the standard error response format with `isError: true`.

## ✨ Result
Test coverage for the MCP deterministic execution sidecar is improved, ensuring that structural guarantees for tool fault reporting remain intact during future refactors. The test suite passes locally with `npx vitest run mcp-server/index.test.ts` and causes no regressions in the global test suite (`npm run test`).
