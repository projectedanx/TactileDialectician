import { z } from "zod";

// DRP-LSP-CARTOGRAPHER-884 DCCD Boundary
// Enforces that outbound JSON-RPC payloads strictly adhere to LSP 3.17

const PositionSchema = z.object({
  line: z.number().int(),
  character: z.number().int(),
});

const RangeSchema = z.object({
  start: PositionSchema,
  end: PositionSchema,
});

const LocationSchema = z.object({
  uri: z.string().url(),
  range: RangeSchema,
});

export const LSPResponseSchema = z.object({
  jsonrpc: z.literal("2.0"),
  id: z.union([z.number(), z.string(), z.null()]),
  result: z.union([
    LocationSchema,
    z.array(LocationSchema),
    z.null()
  ]).optional(),
  error: z.object({
    code: z.number(),
    message: z.string(),
    data: z.any().optional(),
  }).optional(),
}).refine(data => {
    // Must have exactly one of result or error
    if (data.result !== undefined && data.error !== undefined) return false;
    if (data.result === undefined && data.error === undefined) return false;
    return true;
}, { message: "JSON-RPC response must contain exactly one of 'result' or 'error'"});


export function validatePayload(payload: unknown) {
  return LSPResponseSchema.parse(payload);
}
