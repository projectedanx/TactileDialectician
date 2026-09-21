import ast
import json
import logging
from typing import Dict, Any

logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')

class SEPAO_Scanner:
    def __init__(self):
        self.ontology: Dict[str, Any] = {}

    def parse_source_code(self, source_code: str) -> Dict[str, Any]:
        """Parses Python source code into a simplified AST dictionary representation."""
        tree = ast.parse(source_code)
        parsed_data = {"functions": {}}

        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                args = [arg.arg for arg in node.args.args]
                parsed_data["functions"][node.name] = {"args": args}

        return parsed_data

    def detect_semantic_delta(self, old_ontology: Dict[str, Any], new_ontology: Dict[str, Any]) -> Dict[str, Any]:
        """Calculates the Semantic Drift Delta between two AST ontologies."""
        delta = {"removed": {}, "added": {}, "modified": {}}

        old_funcs = old_ontology.get("functions", {})
        new_funcs = new_ontology.get("functions", {})

        for func_name, func_data in old_funcs.items():
            if func_name not in new_funcs:
                delta["removed"][func_name] = func_data
            elif func_data["args"] != new_funcs[func_name]["args"]:
                 delta["modified"][func_name] = {
                     "old_args": func_data["args"],
                     "new_args": new_funcs[func_name]["args"]
                 }

        for func_name, func_data in new_funcs.items():
            if func_name not in old_funcs:
                delta["added"][func_name] = func_data

        return delta

    def generate_f_ipi_scar(self, delta: Dict[str, Any], error_msg: str) -> str:
        """Generates a Symbolic Scar and F-IPI mutation rule based on AST deltas."""
        if not delta["modified"]:
            return "{}"

        # Simplify by just taking the first modified function for demonstration
        func_name = list(delta["modified"].keys())[0]
        mod_data = delta["modified"][func_name]

        old_args = set(mod_data["old_args"])
        new_args = set(mod_data["new_args"])

        removed_arg = list(old_args - new_args)[0] if (old_args - new_args) else "unknown"
        added_arg = list(new_args - old_args)[0] if (new_args - old_args) else "unknown"

        scar = {
            "scar_id": f"SCAR_API_MUTATION_{func_name.upper()}",
            "trigger": error_msg,
            "ast_delta": {
                "removed_node": f"Arg('{removed_arg}') from '{func_name}'",
                "added_node": f"Arg('{added_arg}') to '{func_name}'"
            },
            "f_ipi_mutation": f"FORBID usage of '{removed_arg}' kwarg in {func_name}. MANDATE usage of '{added_arg}'."
        }

        return json.dumps(scar, indent=2)

if __name__ == "__main__":
    scanner = SEPAO_Scanner()

    # 1. Simulate old environment (t-1)
    old_source = """
def process_data(data, force=False):
    pass
"""
    old_ontology = scanner.parse_source_code(old_source)
    logging.info(f"Old Ontology: {old_ontology}")

    # 2. Simulate new environment (t) where API changed
    new_source = """
def process_data(data, override_flag=False):
    pass
"""
    new_ontology = scanner.parse_source_code(new_source)
    logging.info(f"New Ontology: {new_ontology}")

    # 3. Detect Delta
    delta = scanner.detect_semantic_delta(old_ontology, new_ontology)
    logging.info(f"Semantic Delta: {json.dumps(delta, indent=2)}")

    # 4. Simulate runtime failure and generate F-IPI Scar
    error_message = "TypeError: process_data() got an unexpected keyword argument 'force'"
    scar_json = scanner.generate_f_ipi_scar(delta, error_message)

    logging.warning(f"🚨 Ontological Conflict Detected. Generating F-IPI Scar:\n{scar_json}")
