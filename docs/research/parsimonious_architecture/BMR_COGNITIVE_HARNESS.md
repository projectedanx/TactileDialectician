# Bayesian Model Reduction (BMR) Active Pruning Architecture

## Overview
The human brain utilizes BMR to prune superfluous parameters and find simpler, more generalizable explanations of possessed data. This harness operationalizes BMR during complex multi-agent LLM workflows to prevent over-fitting.

## 1. Theory-Building Phase
In this phase, the agent acts using abductive reasoning, analogical mapping, and conceptual blending. When presented with a surprising anomaly, it generates a set of competing candidate hypotheses. Each hypothesis represents a directed reasoning chain forming a generative model of the anomaly.

## 2. Axiomatic Pruning Module
This module treats the agent's internal reasoning chains as a generative model. It computes a marginal likelihood score for each reasoning branch:
$$\text{Evidence} \approx \text{Accuracy} - \text{Complexity}$$
Here, complexity is measured as the Kullback-Leibler divergence between the posterior (the detailed reasoning path) and the prior (existing established knowledge). Paths introducing unverified assumptions or ad-hoc explanations suffer a massive marginal likelihood penalty and are pruned.

## 3. Self-Consolidation Loop
Analogous to memory consolidation during sleep, this loop compresses the internal prompt context windows. It systematically replaces verbose, step-by-step logic chains with concise, elegant "fictive principles" (e.g., equivalent to the Ideal Gas Law). These principles preserve maximum explanatory power with minimal parameterization, effectively baking the insights into the agent's updated "prior" state.

## 4. Pseudo-code Implementation
See the companion simulation script `bmr_harness.py` for the mathematical formalization of the structural priors, posterior updates, and the pruning loop.
