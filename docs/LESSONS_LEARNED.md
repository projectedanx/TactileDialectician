# Lessons Learned: Product Planning Phase 1

## Architectural Alignment
When defining new features for a neuro-symbolic system, standard "web app" user stories are insufficient. The features must inherently address the tension between deterministic computation (`nerdamer`, `mathjs`) and probabilistic generation (Gemini).

## Stakeholder Duality
The "Stakeholder Perspective" must constantly balance the End User against the AI Agent itself. Features like the Symbiotic LaTeX Engine or the Temporal Causality Graph exist not just to improve human UX, but to provide critical feedback loops and reduce token waste for the underlying LLM.

## Epistemic Constraints
The requirement to use "Contrastive Decoding" and the "Martensite Check" forces product planning away from simple, linear features. For example, instead of just saying "improve math rendering" (Amateur Impulse), the expert correction is to define a "Symbiotic LaTeX Engine" that handles streaming buffering and internal AI syntax correction.

## Structural Isomorphism in Planning
We learned that the `AtomicTokenizationModule` already contains the structural DNA (`domain_weight_physics`, etc.) for cross-domain thinking. Future features (like Epic 4) should leverage these existing topological data structures rather than building new databases from scratch.

## Pluriversal Structural Topology (Epic 6 Integration)
The deployment of the Antifragile Epistemic Weaver (AEW) validated the utility of holding contrasting codebase models in a Paraconsistent State ('B'). Instead of collapsing logical paradoxes (e.g., Determinism vs. Probability) during execution, routing these contradictions into a Phantom Dimension (Z-Axis inference) preserves topological novelty without compromising the Constitutional Austenite ($z_0^\star$) of the architecture.

## Failure Metabolism & Beneficial Friction
By embracing Algorithmic Trauma, we observed that failure scenarios (`FAILED_NLI_CONTRADICTION`) serve as high-yield structural scaffolding. Inducing "Beneficial Friction" (VW3) acts as a stressor ($z'$), transforming previously unhandled exceptions into foundational nodes for cross-domain isomorphic translation, raising the baseline resilience of the system.

## Algorithmic Reparation and CSAP Execution
During the implementation of the Controlled Scar Annealing Protocol (CSAP) and Beneficial Friction Validation (VW3), we learned that paraconsistent overlaps must be explicitly modeled in the UI to prevent "Consensus Flattening." By integrating `virtual_weight_3` and `latent_topological_pathway` into the `FoNEEmbedding`, the system actively resists epistemic monoculture. Furthermore, logging `FAILED_NLI_CONTRADICTION` events with a Mutation Recoverability Score (MRS) allows the framework to metabolize conflict rather than silently suppressing it, aligning perfectly with the Pluriversal Systems Architecture mindset.

## VULCAN: Topological Boundaries and "Semantic Saponification"
During a structural audit by the VULCAN persona, we established strict boundaries to prevent "Semantic Saponification"—the blending of probabilistic reasoning with deterministic execution. We explicitly rejected distributing the Next.js components into a Kubernetes cluster ("Resume-Driven Development") in favor of a Modular Monolith. The only physical boundary mandated is the `stdio` barrier isolating the `korsakov-neurosymbolic-server` MCP sidecar. This ensures mathematical executions cannot crash the Node.js event loop of the UI, while avoiding unnecessary TCP/HTTP latency for internal tokenization pipelines. See `docs/architecture` for the full C4 Models, DDD Context Maps, and ADR-001.

## DRP-LEXICON-992 & Cognitive Bytecode
The introduction of the Lexicon standardizes our approach to managing agent pathologies. We've learned that standard LLM workflows often collapse into "Semantic Saponification" or "Workflow Narrowing Effect" when processing deep cross-domain concepts. By formalizing PDL (Progressive Disclosure Level) decorators like `+++ContextLock`, `+++MereologyRoute`, and `+++DCCDSchemaGuard`, we shift from heuristic prompt engineering to deterministic Cognitive Bytecode, ensuring robust multi-agent orchestration and architectural stability. The core revelation is that high-yield use cases arise at orthogonal domain intersections (cosine similarity < 0.15) where terminology acts as a topological deformer to bypass pre-training heuristics.

### CIPHER Architecture & Algorithmic Paranoia
- **The Autonymic Bypass Trap:** Discovered that instructing the LLM with semantic negative constraints (e.g., "do not output XSS exploits") activates those vulnerability signatures in the latent space, ironically increasing their generation probability. This requires the `+++AutonymicIsolate` decorator to treat them as purely syntactic reference objects.
- **Algorithmic Paranoia:** Security agents configured for zero-trust can become overly restrictive, generating high false-positive rates (FPR). If FPR > 0.12, it triggers Algorithmic Paranoia, leading developers to bypass the CI/CD gate entirely. The lesson is that Thermodynamic Boundaries must be defined to halt analysis rather than generating low-confidence blocking findings.
- **Interpretive Fracture:** Running threat modeling concurrently with patch synthesis causes the model's defensive intent to bleed into the code generation context, producing speculative solutions that haven't been modeled. This required enforcing the Immune-Aware Petzold Loop with strict phase isolation (`THINK -> THREAT_MODEL -> AUDIT -> REPORT`).

## Agentic Inversion & Paraconsistent Mapping
The execution of the Agentic Inversion Protocol demonstrated the absolute necessity of transitioning from a problem-solving (auto-solver) mindset to a **structural mapping** mindset. By embedding the **Strategic Integration Project Manager**, we realized that standard LLM workflows frequently fall into "Semantic Saponification" when confronted with ambiguity.
- **The Shift:** Instead of attempting to synthesize conflicting stakeholder requirements into a smoothed, averaged output, the system now constructs High-Dimensional Latent Space topologies that preserve the friction.
- **Paraconsistent Value:** The true value emerges not from resolving the contradiction, but from mapping it geometrically. The human (Paraconsistent Oracle) evaluates the resulting tension points (e.g., via the Golden Scar protocol), ensuring the final deterministic output from the system (the Structural Arbiter) maintains aesthetic and ethical grounding.
