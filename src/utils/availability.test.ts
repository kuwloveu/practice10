import { describe, expect, it } from 'vitest';
import { checkAvailability } from '@/utils/availability';
import { Room, Booking } from '@/types';

function makeRoom(): Room {
  return {
    id: 'r1',
    name: 'Test Room',
    building: 'Block A',
    capacity: 10,
    blocked: false,
  };
}

function makeBookings(): Booking[] {
  return [
    { id: 'b1', roomId: 'r1', start: 600, end: 660, bookedBy: 'Test Booking' },
  ];
}

const CURRENT_TIME = 540;

describe('checkAvailability', () => {
  it('T01 AC4: touching after existing booking is available', () => {
    const result = checkAvailability(makeRoom(), 660, 720, CURRENT_TIME, makeBookings());
    expect(result.available).toBe(true);
  });

  it('T02 AC1: start equal to current time is rejected', () => {
    const result = checkAvailability(makeRoom(), 540, 570, CURRENT_TIME, makeBookings());
    expect(result.available).toBe(false);
    expect(result.ruleCode).toBe('AC1');
  });

  it('T03 AC1: start equal to end is rejected', () => {
    const result = checkAvailability(makeRoom(), 720, 720, CURRENT_TIME, makeBookings());
    expect(result.available).toBe(false);
    expect(result.ruleCode).toBe('AC1');
  });

  it('T04 AC1: start after end is rejected', () => {
    const result = checkAvailability(makeRoom(), 750, 720, CURRENT_TIME, makeBookings());
    expect(result.available).toBe(false);
    expect(result.ruleCode).toBe('AC1');
  });

  it('T05 AC1: end beyond 1440 is rejected', () => {
    const result = checkAvailability(makeRoom(), 1380, 1441, CURRENT_TIME, makeBookings());
    expect(result.available).toBe(false);
    expect(result.ruleCode).toBe('AC1');
  });

  it('T06 AC2: exactly 120 minutes is available', () => {
    const result = checkAvailability(makeRoom(), 720, 840, CURRENT_TIME, makeBookings());
    expect(result.available).toBe(true);
  });

  it('T07 AC2: longer than 120 minutes is rejected', () => {
    const result = checkAvailability(makeRoom(), 720, 841, CURRENT_TIME, makeBookings());
    expect(result.available).toBe(false);
    expect(result.ruleCode).toBe('AC2');
  });

  it('T08 AC4: touching before existing booking is available', () => {
    const result = checkAvailability(makeRoom(), 570, 600, CURRENT_TIME, makeBookings());
    expect(result.available).toBe(true);
  });

  it('T09 AC4: partial overlap with existing booking is rejected', () => {
    const result = checkAvailability(makeRoom(), 630, 690, CURRENT_TIME, makeBookings());
    expect(result.available).toBe(false);
    expect(result.ruleCode).toBe('AC4');
  });

  it('T10 AC4: fully containing existing booking is rejected', () => {
    const result = checkAvailability(makeRoom(), 570, 690, CURRENT_TIME, makeBookings());
    expect(result.available).toBe(false);
    expect(result.ruleCode).toBe('AC4');
  });

  it('T11 AC4: fully inside existing booking is rejected', () => {
    const result = checkAvailability(makeRoom(), 615, 645, CURRENT_TIME, makeBookings());
    expect(result.available).toBe(false);
    expect(result.ruleCode).toBe('AC4');
  });

  it('T12 AC4: exact match with existing booking is rejected', () => {
    const result = checkAvailability(makeRoom(), 600, 660, CURRENT_TIME, makeBookings());
    expect(result.available).toBe(false);
    expect(result.ruleCode).toBe('AC4');
  });

  it('T13 AC3: blocked room is rejected', () => {
    const room = makeRoom();
    room.blocked = true;
    const result = checkAvailability(room, 660, 720, CURRENT_TIME, makeBookings());
    expect(result.available).toBe(false);
    expect(result.ruleCode).toBe('AC3');
  });

  it('T14 AC4: no existing bookings means available', () => {
    const result = checkAvailability(makeRoom(), 630, 690, CURRENT_TIME, []);
    expect(result.available).toBe(true);
  });

  it('T15 AC5: existing booking data is not changed after call', () => {
    const bookings = makeBookings();
    const before = JSON.stringify(bookings);
    checkAvailability(makeRoom(), 630, 690, CURRENT_TIME, bookings);
    checkAvailability(makeRoom(), 660, 720, CURRENT_TIME, bookings);
    expect(JSON.stringify(bookings)).toBe(before);
  });

  it('T16 AC1: NaN start is rejected', () => {
    const result = checkAvailability(makeRoom(), NaN, 720, CURRENT_TIME, makeBookings());
    expect(result.available).toBe(false);
    expect(result.ruleCode).toBe('AC1');
  });

  it('T17 AC4: booking in a different room does not block availability', () => {
    const bookings: Booking[] = [
      { id: 'b2', roomId: 'r2', start: 600, end: 660, bookedBy: 'Other Room Booking' },
    ];
    const result = checkAvailability(makeRoom(), 630, 690, CURRENT_TIME, bookings);
    expect(result.available).toBe(true);
  });

  it('T18 AC1: end exactly 1440 is available', () => {
    const result = checkAvailability(makeRoom(), 1380, 1440, CURRENT_TIME, makeBookings());
    expect(result.available).toBe(true);
  });

  it('T19 AC1: start before current time is rejected', () => {
    const result = checkAvailability(makeRoom(), 500, 530, CURRENT_TIME, makeBookings());
    expect(result.available).toBe(false);
    expect(result.ruleCode).toBe('AC1');
  });

  it('T20 AC5: room and bookings are unchanged after available and unavailable checks', () => {
    const room = makeRoom();
    const bookings = makeBookings();
    const roomBefore = JSON.stringify(room);
    const bookingsBefore = JSON.stringify(bookings);
    checkAvailability(room, 630, 690, CURRENT_TIME, bookings);
    checkAvailability(room, 660, 720, CURRENT_TIME, bookings);
    expect(JSON.stringify(room)).toBe(roomBefore);
    expect(JSON.stringify(bookings)).toBe(bookingsBefore);
  });
});
