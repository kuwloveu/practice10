import { Room, Booking, AvailabilityResult, MAX_BOOKING_MINUTES, DAY_MINUTES } from '@/types';
import { minutesToLabel } from '@/utils/time';

export function checkAvailability(
  room: Room | null,
  start: number,
  end: number,
  currentTime: number,
  existingBookings: Booking[],
): AvailabilityResult {
  if (!room) {
    return { available: false, reason: 'Please select a room first.' };
  }

  if (Number.isNaN(start) || Number.isNaN(end)) {
    return {
      available: false,
      reason: 'Please enter valid start and end times.',
      ruleCode: 'AC1',
    };
  }

  // AC1: 0 ≤ start < end ≤ 1440 and start > currentTime
  if (start < 0 || end > DAY_MINUTES) {
    return { available: false, reason: 'Time must be within 00:00–24:00.', ruleCode: 'AC1' };
  }
  if (start >= end) {
    return { available: false, reason: 'Start time must be before end time.', ruleCode: 'AC1' };
  }
  if (start <= currentTime) {
    return {
      available: false,
      reason: `Start time must be after the current time (${minutesToLabel(currentTime)}).`,
      ruleCode: 'AC1',
    };
  }

  // AC2: booking longer than 120 minutes
  if (end - start > MAX_BOOKING_MINUTES) {
    return { available: false, reason: 'Bookings cannot be longer than 120 minutes.', ruleCode: 'AC2' };
  }

  // AC3: room is blocked
  if (room.blocked) {
    return { available: false, reason: 'This room is currently blocked and cannot be booked.', ruleCode: 'AC3' };
  }

  // AC4: overlapping existing booking (touching endpoints allowed)
  const overlapping = existingBookings.find(
    (b) => b.roomId === room.id && start < b.end && b.start < end,
  );
  if (overlapping) {
    return {
      available: false,
      reason: `Overlaps with existing booking (${overlapping.bookedBy}).`,
      ruleCode: 'AC4',
    };
  }

  // AC5: available — data not modified
  return { available: true, reason: 'Room is available for the selected interval.' };
}
