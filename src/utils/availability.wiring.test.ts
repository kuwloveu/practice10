import { describe, expect, it } from 'vitest';
import { checkAvailability } from '@/utils/availability';
import { labelToMinutes } from '@/utils/time';
import { Room } from '@/types';

function makeRoom(): Room {
  return {
    id: 'r1',
    name: 'Test Room',
    building: 'Block A',
    capacity: 10,
    blocked: false,
  };
}

describe('start/end wiring: reversed interval is rejected with AC1', () => {
  it('rejects when the start time is later than the end time', () => {
    const result = checkAvailability(makeRoom(), 900, 840, 780, []);
    expect(result.available).toBe(false);
    expect(result.ruleCode).toBe('AC1');
  });

  it('rejects a reversed interval converted from time labels', () => {
    // Simulates the App flow: both fields parsed via labelToMinutes, end before start
    const start = labelToMinutes('15:00');
    const end = labelToMinutes('14:00');
    const result = checkAvailability(makeRoom(), start, end, 780, []);
    expect(result.available).toBe(false);
    expect(result.ruleCode).toBe('AC1');
  });

  it('accepts the same interval when start and end are in the correct order', () => {
    const start = labelToMinutes('14:00');
    const end = labelToMinutes('15:00');
    const result = checkAvailability(makeRoom(), start, end, 780, []);
    expect(result.available).toBe(true);
  });
});
