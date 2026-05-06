**Summary:**
This PR implements the "Epistemic Inversion Strategy" by formally introducing the `VIPER` persona (Visual Intent & Physical Execution Router). It transitions the system's image generation approach from probabilistic "vibe" parsing to deterministic optical simulation, treating the latent space as a physical volume.

**Key Changes:**
- **VIPER Agent Profile:** Added `docs/agent/VIPER.md` detailing the Epistemic Matrix, the "Gaffer" profile, and explicit thermodynamic metrics (HGI, ADS, SCR, RCC-8 Spatial Binds) to eradicate Semantic Saponification.
- **Inversion Strategy & Checklist:** Created `docs/viper_inversion/PLAN.md` and `CHECKLIST.md` formalizing the human's role in providing affective desire and the AI's role in supplying deterministic physical parameters.
- **Global Documentation Updates:** Integrated VIPER into `AGENTS.md`, updated the `README.md` Agent Profiles section, appended new metrological terminology to `DOMAIN_GLOSSARY.md` (e.g., Semantic Saponification, SpatialBind, HGI), and updated `TODO.md` and `LESSONS_LEARNED.md` to reflect these emergent architectural paradigms.

**Verification:**
- Verified all documentation constraints, markdown formatting, and structural logic manually via `cat` and `ls` commands.
- The standard vitest testing suite, linting, and Next.js production build (`npm run build`) were successfully executed to ensure repository coherence was maintained without regressions.
