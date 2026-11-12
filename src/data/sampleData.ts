import { Room, Booking } from '@/types';

export const rooms: Room[] = [
  { id: 'r1', name: 'Thames Hall', building: 'Block A', capacity: 40, blocked: false },
  { id: 'r2', name: 'Severn Lab', building: 'Block B', capacity: 24, blocked: false },
  { id: 'r3', name: 'Avon Study Room', building: 'Block A', capacity: 12, blocked: false },
  { id: 'r4', name: 'Mersey Conference Room', building: 'Block C', capacity: 60, blocked: true },
];

export const bookings: Booking[] = [
  { id: 'b1', roomId: 'r1', start: 540, end: 600, bookedBy: 'Intro to Algorithms' },
  { id: 'b2', roomId: 'r1', start: 780, end: 870, bookedBy: 'Faculty Meeting' },
  { id: 'b3', roomId: 'r2', start: 600, end: 660, bookedBy: 'Networks Lab' },
  { id: 'b4', roomId: 'r3', start: 720, end: 780, bookedBy: 'Study Group' },
];
