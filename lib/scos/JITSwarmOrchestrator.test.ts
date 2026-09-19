import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import {
  JITSwarmOrchestrator,
  SymbolicScarArchive,
  JustifiedUncertaintyReport,
  VerificationCoProcessor,
  JITMicroAgent
} from './JITSwarmOrchestrator';

const SCRATCH_DIR = path.join(process.cwd(), 'scratch');
const TEST_ARCHIVE_PATH = path.join(SCRATCH_DIR, 'test_scar_archive.json');

describe('JITSwarmOrchestrator Architecture Validation', () => {
  let orchestrator: JITSwarmOrchestrator;

  beforeEach(() => {
    // Clear out any existing test archive
    if (fs.existsSync(TEST_ARCHIVE_PATH)) {
      fs.unlinkSync(TEST_ARCHIVE_PATH);
    }

    orchestrator = new JITSwarmOrchestrator();
    // Redirect the orchestrator's archive to a test specific one
    orchestrator.scarArchive = new SymbolicScarArchive(TEST_ARCHIVE_PATH);
    orchestrator.vcp = new VerificationCoProcessor(orchestrator.scarArchive);

    // Suppress console logs for cleaner test output
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (fs.existsSync(TEST_ARCHIVE_PATH)) {
      fs.unlinkSync(TEST_ARCHIVE_PATH);
    }
  });

  describe('Trial 1: EXCESSIVE SCHEMA DRIFT & ESCROW GATING (NO REPAIR)', () => {
    it('should halt execution, mint a scar, and generate a JUR when compilation fails thrice', () => {
      const [success, result] = orchestrator.executeTask(
        'SYSTEM_PATCH_COMPILATION',
        'Apply system patch to route telemetry events asynchronously.',
        null // Mock target API missing triggers failure
      );

      expect(success).toBe(false);
      expect(result.status).toContain('EPISTEMIC_ESCROW_HALT');
      expect(result.trace_id).toBeDefined();
      expect(result.jur_path).toBeDefined();

      // Verify Scar Archive state
      expect(fs.existsSync(TEST_ARCHIVE_PATH)).toBe(true);
      const archiveData = JSON.parse(fs.readFileSync(TEST_ARCHIVE_PATH, 'utf-8'));
      const scarIds = Object.keys(archiveData);
      expect(scarIds.length).toBe(1);

      const mintedScar = archiveData[scarIds[0]];
      expect(mintedScar.task_type).toBe('SYSTEM_PATCH_COMPILATION');
      expect(mintedScar.failure_mode).toBe("MANDATE_FIELD_PRESENCE: 'target_api'");

      // Verify JUR state
      const jurPath = result.jur_path as string;
      expect(fs.existsSync(jurPath)).toBe(true);
      const jurData = JSON.parse(fs.readFileSync(jurPath, 'utf-8'));
      expect(jurData['@type']).toBe('JustifiedUncertaintyReport');
      expect(jurData.telemetry.algorithmic_shame_breached).toBe(true);

      // Cleanup JUR file
      fs.unlinkSync(jurPath);
    });
  });

  describe('Trial 2: IMMUNIZED EXECUTION VIA FAILURE-INFORMED PROMPT INVERSION', () => {
    it('should recover using FIPI on the second attempt after a prior scar was minted', () => {
      // Step 1: Pre-mint a scar to simulate prior failure
      orchestrator.scarArchive.commitScar(
        'SYSTEM_PATCH_COMPILATION',
        "MANDATE_FIELD_PRESENCE: 'target_api'",
        "DCCD_SCHEMA_VIOLATION: Missing required invariant key 'target_api'",
        {}
      );

      // Step 2: Re-run the task. The VCP should pick up the scar and inject F-IPI constraints.
      const [success, result] = orchestrator.executeTask(
        'SYSTEM_PATCH_COMPILATION',
        'Apply system patch to route telemetry events asynchronously.',
        null
      );

      expect(success).toBe(true);
      expect(result.status).toBe('SUCCESSFUL_Realization_TAKEN_2_ATTEMPTS');

      const payload = result.payload as Record<string, unknown>;
      expect(payload).toBeDefined();
      expect(payload.target_api).toBe('SCoRe_RESOLVED_VALUE');
    });
  });

  describe('Component Tests', () => {
    it('VerificationCoProcessor correctly calculates CFDI', () => {
      const vcp = new VerificationCoProcessor(new SymbolicScarArchive());
      // mockLogits: [0.8, -1.2, 0.4, -0.9] -> Probabilities: ~[0.46, 0.06, 0.31, 0.08] -> max 0.46
      // Ast adherence 0.6
      // CFDI = |0.46 - 0.6| = 0.14
      const cfdi = vcp.computeCfdi([0.8, -1.2, 0.4, -0.9], 0.6);
      expect(cfdi).toBeCloseTo(0.097, 2);
    });

    it('JITMicroAgent validates schema prescence', () => {
      const agent = new JITMicroAgent('test-agent', {}, []);
      const [success, msg, payload] = agent.executeDccdPass('draft', null);
      expect(success).toBe(false);
      expect(msg).toContain('DCCD_SCHEMA_VIOLATION');
      expect(payload).toBeNull();

      const [success2, msg2, payload2] = agent.executeDccdPass('draft', 'valid_api');
      expect(success2).toBe(true);
      expect(msg2).toContain('AST_VERIFIED_SUCCESS');
      expect(payload2).toBeDefined();
    });
  });
});
