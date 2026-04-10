import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { parseAIError } from "./errorHandling";

describe("parseAIError", () => {
  // Mock console.error to avoid cluttering test output
  const originalConsoleError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  it("should handle falsy errors", () => {
    expect(parseAIError(null)).toBe("An unknown error occurred.");
    expect(parseAIError(undefined)).toBe("An unknown error occurred.");
    expect(parseAIError(false)).toBe("An unknown error occurred.");
    expect(parseAIError(0)).toBe("An unknown error occurred.");
    expect(parseAIError("")).toBe("An unknown error occurred.");
  });

  describe("Deterministic Parsing Errors", () => {
    it("should handle nerdamer errors", () => {
      const error = new Error("Something went wrong with nerdamer");
      expect(parseAIError(error)).toContain("Deterministic Parsing Error: Something went wrong with nerdamer");
    });

    it("should handle mathjs errors", () => {
      const error = { message: "mathjs evaluation failed" };
      expect(parseAIError(error)).toContain("Deterministic Parsing Error: mathjs evaluation failed");
    });

    it("should handle parse error", () => {
      const error = { response: { data: { error: { message: "parse error during symbol evaluation" } } } };
      expect(parseAIError(error)).toContain("Deterministic Parsing Error: parse error during symbol evaluation");
    });

    it("should handle simplification errors", () => {
      const error = { message: "simplification failed" };
      expect(parseAIError(error)).toContain("Deterministic Parsing Error: simplification failed");
    });
  });

  describe("Rate Limit Errors", () => {
    it("should handle 429 status", () => {
      expect(parseAIError({ status: 429 })).toBe("Rate limit exceeded or quota exhausted. Please wait a moment and try again.");
      expect(parseAIError({ response: { status: 429 } })).toBe("Rate limit exceeded or quota exhausted. Please wait a moment and try again.");
    });

    it("should handle 429 in message", () => {
      expect(parseAIError(new Error("Request failed with status 429"))).toBe("Rate limit exceeded or quota exhausted. Please wait a moment and try again.");
    });

    it("should handle quota in message", () => {
      expect(parseAIError({ message: "You have exceeded your quota" })).toBe("Rate limit exceeded or quota exhausted. Please wait a moment and try again.");
    });

    it("should handle rate limit in message", () => {
      expect(parseAIError({ response: { data: { error: { message: "rate limit exceeded" } } } })).toBe("Rate limit exceeded or quota exhausted. Please wait a moment and try again.");
    });
  });

  describe("Authentication Errors", () => {
    it("should handle 401 status", () => {
      expect(parseAIError({ status: 401 })).toBe("Authentication failed. Please check your Gemini API key configuration.");
      expect(parseAIError({ response: { status: 401 } })).toBe("Authentication failed. Please check your Gemini API key configuration.");
    });

    it("should handle 403 status", () => {
      expect(parseAIError({ status: 403 })).toBe("Authentication failed. Please check your Gemini API key configuration.");
      expect(parseAIError({ response: { status: 403 } })).toBe("Authentication failed. Please check your Gemini API key configuration.");
    });

    it("should handle API key in message", () => {
      expect(parseAIError({ message: "Invalid API key provided" })).toBe("Authentication failed. Please check your Gemini API key configuration.");
    });

    it("should handle authentication in message", () => {
      expect(parseAIError(new Error("authentication required"))).toBe("Authentication failed. Please check your Gemini API key configuration.");
    });
  });

  describe("Server Errors", () => {
    it("should handle 500 status", () => {
      expect(parseAIError({ status: 500 })).toBe("The AI service is currently overloaded or unavailable. Please try again later.");
      expect(parseAIError({ response: { status: 500 } })).toBe("The AI service is currently overloaded or unavailable. Please try again later.");
    });

    it("should handle 503 status", () => {
      expect(parseAIError({ status: 503 })).toBe("The AI service is currently overloaded or unavailable. Please try again later.");
      expect(parseAIError({ response: { status: 503 } })).toBe("The AI service is currently overloaded or unavailable. Please try again later.");
    });

    it("should handle 503 in message", () => {
      expect(parseAIError(new Error("Error 503 Service Unavailable"))).toBe("The AI service is currently overloaded or unavailable. Please try again later.");
    });

    it("should handle overloaded in message", () => {
      expect(parseAIError({ message: "Service is overloaded" })).toBe("The AI service is currently overloaded or unavailable. Please try again later.");
    });
  });

  describe("Format Errors", () => {
    it("should handle JSON in message", () => {
      expect(parseAIError({ message: "Invalid JSON response" })).toBe("The model returned an invalid response format. Please try again.");
    });

    it("should handle parse in message", () => {
      expect(parseAIError({ response: { data: { error: { message: "Could not parse response body" } } } })).toBe("The model returned an invalid response format. Please try again.");
    });
  });

  describe("Network Errors", () => {
    it("should handle fetch in message", () => {
      expect(parseAIError(new Error("fetch failed"))).toBe("Network error. Please check your internet connection.");
    });

    it("should handle network in message", () => {
      expect(parseAIError({ message: "network timeout" })).toBe("Network error. Please check your internet connection.");
    });
  });

  describe("Fallback", () => {
    it("should handle general error message", () => {
      expect(parseAIError(new Error("Some strange error"))).toBe("Analysis failed: Some strange error");
      expect(parseAIError({ message: "Custom error message" })).toBe("Analysis failed: Custom error message");
      expect(parseAIError({ response: { data: { error: { message: "Deep error" } } } })).toBe("Analysis failed: Deep error");
    });

    it("should handle object without message but valid truthy", () => {
      expect(parseAIError({})).toBe("Analysis failed: Unexpected error");
      expect(parseAIError({ foo: "bar" })).toBe("Analysis failed: Unexpected error");
    });
  });
});
