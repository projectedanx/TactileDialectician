## Title
feat: integrate JIT Swarm Orchestrator and SCOS architecture

## Description
This PR formally implements the **Sovereign Cognitive Operating System (SCOS)** JIT Swarm Orchestrator architecture in TypeScript, directly porting and expanding upon the mathematical architecture specification.

It introduces a deterministic execution environment that decouples "Hollow-Core" semantic planning (Manifold $\alpha$) from zero-entropy syntactic realization via JIT Micro-Agents (Manifold $\beta$).

### Key Inclusions
1. **`lib/scos/JITSwarmOrchestrator.ts`**: Complete architectural instantiation, including:
   - `VerificationCoProcessor` (VCP) for sensing emergent epistemic drift and applying Differentiable Cache Augmentation.
   - `SymbolicScarArchive` (STA) for serializing compilation failures into repulsive F-IPI (Failure-Informed Prompt Inversion) constraints.
   - `JITMicroAgent` for spinning up ephemeral execution contexts utilizing Draft-Conditioned Constrained Decoding (DCCD).
   - `JustifiedUncertaintyReport` (JUR) for exporting context states upon halting in Epistemic Escrow.
2. **Comprehensive Test Suite (`lib/scos/JITSwarmOrchestrator.test.ts`)**: Vitest verification of:
   - Trial 1: Escrow halting and Betti-1 Bounding (Algorithmic Shame detection).
   - Trial 2: Reflexive Repair recovery using F-IPI.
   - Component-level CFDI calculation checks and schema presence validators.
3. **Pluriversal Repository Updates**:
   - Mapped new topological boundaries into `docs/agent/SCOS.md`.
   - Populated `DOMAIN_GLOSSARY.md` and `LEXICON.md` with PAT-016 through PAT-019 defining CFDI, VCP, JUR, and F-IPI.
   - Preserved architectural learning curves in `LESSONS_LEARNED.md`.

This integration acts as the central deterministic nervous system for the AI-Assisted STEM collaboration workspace, mathematically forcing LLM generation to align with the rigid invariant schema required by the physical runtime environment.
