export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  blocked: boolean;
}

export interface Booking {
  id: string;
  roomId: string;
  start: number; // minutes from midnight (0–1440)
  end: number;
  bookedBy: string;
}

export interface AvailabilityResult {
  available: boolean;
  reason: string;
  ruleCode?: string;
}

export const MAX_BOOKING_MINUTES = 120;
export const DAY_MINUTES = 1440;
