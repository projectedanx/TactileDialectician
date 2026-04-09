import { cn } from "./utils"
import { describe, it, expect } from "vitest"

describe("cn utility", () => {
  it("should merge simple strings", () => {
    expect(cn("btn", "btn-primary")).toBe("btn btn-primary")
  })

  it("should handle conditional classes", () => {
    expect(cn("btn", true && "btn-active", false && "hidden")).toBe("btn btn-active")
    expect(cn("btn", { "btn-active": true, "hidden": false })).toBe("btn btn-active")
  })

  it("should resolve tailwind conflicts", () => {
    // tailwind-merge should ensure the last conflicting class wins
    expect(cn("px-2 px-4")).toBe("px-4")
    expect(cn("p-4 p-2")).toBe("p-2")
    expect(cn("bg-red-500 bg-blue-500")).toBe("bg-blue-500")
  })

  it("should handle nested arrays and objects", () => {
    expect(cn(["btn", "p-4"], { "btn-primary": true })).toBe("btn p-4 btn-primary")
  })

  it("should handle various falsy values", () => {
    expect(cn("base", null, undefined, false, "")).toBe("base")
  })
})
