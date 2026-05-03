# Project Aurelius Execution Checklist

## 1. Documentation & Scaffolding
- [x] Create Project Aurelius directory (`docs/project_aurelius`).
- [x] Draft `PLAN.md` detailing the WHAT, WHY (Epistemic Inversion), and HOW.
- [x] Draft `CHECKLIST.md` (this file).

## 2. Core Module Implementation (Phase 1 & 2)
- [ ] Create `lib/project_aurelius` directory.
- [ ] Implement `PhantomDimensionRouter.ts` to map geometric semantics to meta-prompt configurations.
- [ ] Implement `AgenticPlausibilityOracle.ts` to mock the physical validation feedback loop.

## 3. Provenance & Ethics (Phase 3)
- [ ] Implement `ProvenanceTracker.ts` to manage training data attribution weights.

## 4. UI/Dashboard Integration
- [ ] Create `AureliusDashboard.tsx` in `components/`.
- [ ] Integrate the dashboard into `app/page.tsx` or `components/Sidebar.tsx` for visibility.
- [ ] Ensure UI strictly uses semantic tokens (e.g., `--primary`, `bg-surface`) and follows the Euclidean 8-point grid.

## 5. Verification & Audit
- [ ] Update `docs/architecture/LESSONS_LEARNED.md` with insights from the Aurelius implementation.
- [ ] Update `ROADMAP.md` or `TODO.md` to reflect the initiation of Project Aurelius.
- [ ] Run `npm run lint` and `npm run build` to verify codebase integrity.
