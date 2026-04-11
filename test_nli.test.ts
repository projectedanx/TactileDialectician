import { describe, it, expect, vi } from "vitest";
import { parseAIError } from "./utils/errorHandling";

describe("CSAP NLI Error Logic", () => {
  it("detects and processes FAILED_NLI_CONTRADICTION", () => {
    console.log = vi.fn();
    const result = parseAIError(new Error("Logical contradiction in NLI generation"));
    expect(result).toBe("Logical Contradiction Detected (FAILED_NLI_CONTRADICTION). Parallax zone recorded as Symbolic Scar.");
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining("FAILED_NLI_CONTRADICTION"));
  });
});
