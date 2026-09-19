# ActPlane eBPF IFC DSL Synthesis

## System Architecture Target
A system-level policy engine that dynamically compiles natural-language instructions (e.g., `CLAUDE.md`, `AGENTS.md`) into OS kernel-enforced Information-Flow Control (IFC) policies to block indirect prompt injections and shell escapes across dynamically spawned sub-agents.

## 1. ActPlane IFC DSL (Context-Free Grammar)
A formal CFG maps high-level agentic safety invariants into deterministic kernel constraints.
Example rule: "Sub-agent C spawned by Parent P can write to file F only if F has been validated by verifier script V"
- **Grammar Bounds:** Defines Subject (Agent/Domain), Operation (syscall mapped), Target (File/Socket), and Condition (IFC label/validation state).
- **Deterministic Translation:** Converts to bitmask comparisons.

## 2. Compilation Pipeline via Constrained Semantic Parsing
- **LLM as Parser:** Utilizes an LLM to translate natural-language policies into the DSL.
- **Verification Binding:** Binds every parsed requirement to a programmatic verification metric.
- **JSON Schemas:** Outputs verified-by-construction JSON schemas that represent the DSL AST, preventing hallucinated or malformed policies.

## 3. eBPF Kernel Enforcement Engine
- **Runtime Loading:** Loads DSL policies as BPF maps.
- **BPF LSM Hooks:** Intercepts `sys_enter` events (specifically `execve`, `openat`, and `socket`).
- **Label Propagation:** Tracks data flow taint across process boundaries using monotonic label propagation.
- **Violation Handling:** Immediately returns -EPERM on policy violations based on bitmask intersections.

## 4. Semantic Feedback Loop (SECCOMP_RET_USER_NOTIF)
- **Error Payload Construction:** When a system call is blocked, the engine constructs a structured error payload detailing the closest fuzzy match of the violated DSL rule.
- **Agent Integration:** Streams this payload back into the agent's context window.
- **Self-Correction:** Triggers the agent's internal self-correction loop, avoiding a hard crash while maintaining the invariant boundary.
