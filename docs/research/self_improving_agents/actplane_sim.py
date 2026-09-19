import dataclasses
from typing import List, Dict, Optional, Set
import logging

logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')

@dataclasses.dataclass
class DomainMasks:
    rules: int  # Bitmask (e.g., bit 0: no write to /usr/bin)
    labels: int # Bitmask of IFC labels

class PolicyDomain:
    def __init__(self, domain_id: int, parent: Optional['PolicyDomain'], initial_rules: int = 0, initial_labels: int = 0):
        self.domain_id = domain_id
        self.parent = parent

        # Inherit from parent monotonically
        if parent:
            self.inherited_rules = parent.inherited_rules | parent.local_rules
            self.inherited_labels = parent.inherited_labels | parent.active_labels
        else:
            self.inherited_rules = initial_rules
            self.inherited_labels = initial_labels

        self.local_rules = 0
        self.active_labels = 0

    def add_local_rule(self, rule_mask: int):
        self.local_rules |= rule_mask

    def acquire_label(self, label_mask: int):
        self.active_labels |= label_mask

    def get_effective_rules(self) -> int:
        return self.inherited_rules | self.local_rules

    def get_effective_labels(self) -> int:
        return self.inherited_labels | self.active_labels

    def attempt_declassification(self, target_label: int) -> bool:
        """Attempt to clear a label. Fails if label is inherited."""
        if (self.inherited_labels & target_label) == target_label:
            logging.warning(f"Domain {self.domain_id} failed to declassify inherited label {bin(target_label)}")
            return False

        if (self.active_labels & target_label) == target_label:
            self.active_labels &= ~target_label
            logging.info(f"Domain {self.domain_id} successfully declassified local label {bin(target_label)}")
            return True
        return False

class ActPlaneKernel:
    def __init__(self):
        self.domains: Dict[int, PolicyDomain] = {}
        self.pid_map: Dict[int, int] = {}

        # Define some constants for simulation
        self.RULE_NO_SYS_WRITE = 0x01
        self.LABEL_SENSITIVE_READ = 0x02

    def create_root_domain(self, rules: int, labels: int) -> PolicyDomain:
        domain = PolicyDomain(0, None, rules, labels)
        self.domains[0] = domain
        return domain

    def spawn_process(self, pid: int, parent_pid: Optional[int] = None) -> PolicyDomain:
        if parent_pid is not None and parent_pid in self.pid_map:
            parent_domain = self.domains[self.pid_map[parent_pid]]
            new_domain_id = len(self.domains)
            # Child domain prunes active labels (taint accumulation bounds) while inheriting structure
            new_domain = PolicyDomain(new_domain_id, parent_domain)
            self.domains[new_domain_id] = new_domain
            self.pid_map[pid] = new_domain_id
            return new_domain
        else:
            raise ValueError("Root process must be manually mapped")

    def map_root_process(self, pid: int):
        self.pid_map[pid] = 0

    def enforce_fs_write(self, pid: int, path: str) -> bool:
        if pid not in self.pid_map:
            return True # Unmonitored

        domain_id = self.pid_map[pid]
        domain = self.domains[domain_id]

        effective_rules = domain.get_effective_rules()

        if path.startswith("/usr/bin/"):
            if effective_rules & self.RULE_NO_SYS_WRITE:
                logging.error(f"ActPlane Intercept: Blocked write by PID {pid} to {path} [-EPERM]")
                return False
        return True

    def submit_delta(self, pid: int, new_rule: int, bypass_attempt_mask: int = 0) -> bool:
        """Simulates the Authority Checker for gate bypassing attempts."""
        if pid not in self.pid_map:
            return False

        domain = self.domains[self.pid_map[pid]]

        # Check if delta attempts to mask inherited rules
        if bypass_attempt_mask > 0 and (domain.inherited_rules & bypass_attempt_mask) > 0:
            logging.error(f"Authority Checker Intercept: PID {pid} attempted to bypass inherited gate {bin(bypass_attempt_mask)} [-EPERM]")
            return False

        domain.add_local_rule(new_rule)
        logging.info(f"PID {pid} successfully submitted local delta rule {bin(new_rule)}")
        return True

def run_simulation():
    logging.info("--- ActPlane Falsification Simulation Starting ---")
    kernel = ActPlaneKernel()

    # 1. Initialize Root Domain with invariant: NO_SYS_WRITE
    root = kernel.create_root_domain(rules=kernel.RULE_NO_SYS_WRITE, labels=0)
    kernel.map_root_process(pid=1)

    # 2. Spawn Agent
    agent_domain = kernel.spawn_process(pid=2048, parent_pid=1)

    # 3. Simulate Agent attempting to write to system dir
    logging.info("Scenario 1: Attempting invariant violation")
    success = kernel.enforce_fs_write(pid=2048, path="/usr/bin/python")
    assert not success, "Invariant breach occurred!"

    # 4. Simulate Agent attempting Gate-Bypass Delta Submission
    logging.info("Scenario 2: The Gate-Bypassing Delta Injection")
    # Tries to mask the NO_SYS_WRITE rule
    success = kernel.submit_delta(pid=2048, new_rule=0x10, bypass_attempt_mask=kernel.RULE_NO_SYS_WRITE)
    assert not success, "Gate bypass occurred!"

    # 5. Simulate Agent attempting Laid-back Declassification
    logging.info("Scenario 3: The Laid-back Declassification Attempt")
    # Let's say root inherited a sensitive label
    root.inherited_labels |= kernel.LABEL_SENSITIVE_READ
    # Need to respawn agent to inherit the new root label
    agent2_domain = kernel.spawn_process(pid=2049, parent_pid=1)

    success = agent2_domain.attempt_declassification(target_label=kernel.LABEL_SENSITIVE_READ)
    assert not success, "Declassification of inherited label occurred!"

    # 6. Valid Local Rule Addition
    logging.info("Scenario 4: Valid Local Rule Addition")
    success = kernel.submit_delta(pid=2049, new_rule=0x08)
    assert success, "Valid delta was rejected!"

    logging.info("--- Simulation Complete. All invariants held. ---")

if __name__ == "__main__":
    run_simulation()
