# Non-Parametric Occam Loss Compiler for AI Scientific Reasoning

## Overview
In computational discovery, models tend toward maximum likelihood over-fitting by multiplying free parameters. To automate parsimonious theory selection, we specify an explicit mathematical loss compiler that penalizes model complexity at the structural level.

## 1. Ontological Commitment Schema
A strongly typed JSON schema representing a theory's "Ontological Commitment". It explicitly declares variables, free parameters, and foundational assumptions.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "OntologicalCommitment",
  "type": "object",
  "properties": {
    "theory_name": {
      "type": "string"
    },
    "variables": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "description": { "type": "string" },
          "observable": { "type": "boolean" }
        },
        "required": ["name", "observable"]
      }
    },
    "free_parameters": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "value": { "type": "number" }
        },
        "required": ["name"]
      }
    },
    "assumptions": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "probability": {
            "type": "number",
            "minimum": 0,
            "maximum": 1
          }
        },
        "required": ["id", "probability"]
      }
    }
  },
  "required": ["theory_name", "variables", "free_parameters", "assumptions"]
}
```

## 2. Quantitative Complexity Metric
The complexity metric $C(G)$ is derived from parameter dimensionality and assumption-dependence paths. It models the probability of error propagation:
$$P(T) = \prod P(A_i)$$
Where $A_i$ are the independent assumptions.
We define the Occam penalty as:
$$C(G) = \alpha \cdot N_{params} - \beta \cdot \log(P(T))$$
where $N_{params}$ is the number of free parameters, and $\alpha, \beta$ are scaling constants. Since $P(T)$ is a product of probabilities, its log is negative, so $-\log(P(T))$ acts as a penalty for numerous or unlikely assumptions.

## 3. Pareto Optimization Function
The compiler seeks the "Simplest Adequate Approximation". It computes an Occam Loss Score:
$$\mathcal{L}_{\text{Occam}} = E(G) + C(G)$$
where $E(G)$ is the prediction error against real-world test sets.
The compiler rejects any model that adds free parameters without achieving a corresponding, statistically significant decrease in prediction error (e.g., $E \ge 3\sigma$).

## 4. Simulated Walk-through: Copernican vs. Ptolemaic
See the companion simulation script `occam_compiler.py` which demonstrates the selection of Copernican heliocentrism over Ptolemaic geocentrism using Galileo's observations.
