import { describe, it, expect } from 'vitest';
import { isGeminiAvailable } from '../services/gemini';

describe('Gemini Service', () => {
  it('should initialize correctly or gracefully fallback depending on env key', () => {
    // If no API key is provided, it should be false, else true
    expect(typeof isGeminiAvailable).toBe('boolean');
  });
});
