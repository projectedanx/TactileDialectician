# Lessons Learned: Product Planning Phase 1

## Architectural Alignment
When defining new features for a neuro-symbolic system, standard "web app" user stories are insufficient. The features must inherently address the tension between deterministic computation (`nerdamer`, `mathjs`) and probabilistic generation (Gemini).

## Stakeholder Duality
The "Stakeholder Perspective" must constantly balance the End User against the AI Agent itself. Features like the Symbiotic LaTeX Engine or the Temporal Causality Graph exist not just to improve human UX, but to provide critical feedback loops and reduce token waste for the underlying LLM.

## Epistemic Constraints
The requirement to use "Contrastive Decoding" and the "Martensite Check" forces product planning away from simple, linear features. For example, instead of just saying "improve math rendering" (Amateur Impulse), the expert correction is to define a "Symbiotic LaTeX Engine" that handles streaming buffering and internal AI syntax correction.

## Structural Isomorphism in Planning
We learned that the `AtomicTokenizationModule` already contains the structural DNA (`domain_weight_physics`, etc.) for cross-domain thinking. Future features (like Epic 4) should leverage these existing topological data structures rather than building new databases from scratch.
