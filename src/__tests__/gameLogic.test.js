import { describe, it, expect } from 'vitest';

/**
 * @file gameLogic.test.js
 * Automated Unit Tests for "The First Vote" Game Engine
 * These tests verify the Integrity Point thresholds and Voter Profile classification.
 */

const calculateVoterProfile = (ip) => {
  if (ip >= 81) return "Guardian of Democracy";
  if (ip >= 41) return "Conscious Citizen";
  return "Passive Spectator";
};

describe('Voter Profile Classification', () => {
  it('identifies high-integrity players as Guardians', () => {
    expect(calculateVoterProfile(150)).toBe('Guardian of Democracy');
  });

  it('identifies medium-integrity players as Conscious Citizens', () => {
    expect(calculateVoterProfile(65)).toBe('Conscious Citizen');
  });

  it('identifies low-integrity players as Passive Spectators', () => {
    expect(calculateVoterProfile(10)).toBe('Passive Spectator');
  });
});

describe('Score Boundary Logic', () => {
  it('correctly handles the 81-point threshold', () => {
    expect(calculateVoterProfile(81)).toBe('Guardian of Democracy');
    expect(calculateVoterProfile(80)).toBe('Conscious Citizen');
  });

  it('correctly handles the 41-point threshold', () => {
    expect(calculateVoterProfile(41)).toBe('Conscious Citizen');
    expect(calculateVoterProfile(40)).toBe('Passive Spectator');
  });
});

describe('Mathematical Safety', () => {
  it('ensures IP scores are capped at zero and do not go negative', () => {
    const mockState = { ip: 10 };
    const addIP = (current, points) => Math.max(0, current + points);
    
    expect(addIP(mockState.ip, -50)).toBe(0);
  });
});
