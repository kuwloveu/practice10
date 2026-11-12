import { describe, expect, it } from 'vitest';
import { labelToMinutes, minutesToLabel } from '@/utils/time';

describe('minutesToLabel', () => {
  it('formats minutes-from-midnight as zero-padded HH:MM', () => {
    expect(minutesToLabel(570)).toBe('09:30');
    expect(minutesToLabel(0)).toBe('00:00');
    expect(minutesToLabel(1439)).toBe('23:59');
  });
});

describe('labelToMinutes', () => {
  it('parses valid HH:MM labels to minutes from midnight', () => {
    expect(labelToMinutes('09:30')).toBe(570);
    expect(labelToMinutes('00:00')).toBe(0);
    expect(labelToMinutes('23:59')).toBe(1439);
  });

  it('round-trips valid labels through both helpers', () => {
    const labels = ['00:00', '09:30', '12:00', '18:45', '23:59'];
    for (const label of labels) {
      expect(minutesToLabel(labelToMinutes(label))).toBe(label);
    }
  });

  it('returns NaN for input without a ":" separator', () => {
    // "14".split(':') yields ["14"], so minutes is undefined -> h*60 + undefined
    expect(labelToMinutes('14')).toBeNaN();
  });
});
