# ActPlane Architecture: Sovereignty-Enforcement Split

## Overview
The ActPlane architecture inverts the traditional, model-centric development paradigm. Instead of relying on the non-deterministic "brain" (the LLM) for execution reliability and security, it offloads these responsibilities to the **agent harness**. By treating the harness as an operating system kernel for cognitive workloads, ActPlane enforces runtime safety and state duration through **Hierarchical Policy Domains**.

## The Four Pillars

### Pillar I: Automated Discovery and Constraint Mining
Establishes a temporal trust boundary where rules loaded before agent execution have higher authority.
- **Invariant Mining:** Parent orchestrators set static, immutable core policies (e.g., "no direct push to main").
- **Monotonic Inheritance:** Child domains inherit parent rules, marking them read-only and immutable.
- **Soft Target Discovery:** Agents dynamically author context-dependent rules at runtime (self-restricting deltas) that act as downstream, local policies.

### Pillar II: Isomorphic Formalization
Formalizes policy domains into **in-kernel eBPF maps** for deterministic enforcement with zero userspace overhead.
- **PID-to-Domain Map:** Maps process identifiers to specific policy domains.
- **Domain Registry Map:** Maintains metadata including parent ID, inherited rule/label masks, local rules, and active IFC labels.
- **Monotonic Label Propagation (IFC):** Labels propagate via OS data-flow edges (fork, exec, read, write). Operations violating rules based on acquired labels are blocked at the kernel level.

### Pillar III: Parametric Trade-off Modeling
Balances security isolation with performance.
- **Security vs. Latency:** Utilizes BPF-LSM tracepoint hooks for microsecond-level overhead ($\approx 1.9\%$), avoiding the latency of hardware virtualization or standard containers.
- **Safety Inheritance vs. Over-Tainting:** Spawning subprocesses in a child domain clears inherited file-read labels to prevent label creep while maintaining the root domain's structural invariants.

### Pillar IV: Continuous Falsification and Edge-Case Stress Testing
Subjects the runtime to active attack vectors.
- **Gate-Bypassing Defense:** An in-kernel Authority Checker intercepts delta submissions, rejecting any that attempt to mask or satisfy inherited `unless` gates.
- **Declassification Attempt Defense:** Privilege scoping binds label declassification strictly to the authoring domain. Child domains lack the bitwise privilege to clear inherited safety labels.

## Implementation Schema
The kernel uses structures such as `policy_domain`, mapping PIDs, and executing a synchronous pre-operation enforcement hook (`enforce_domain_boundary`) to validate actions via bitwise comparisons against rule masks.
