# AGENTS.md

## Project
Smart Campus room availability checker. One room, fictional bookings, fixed current time. The app only decides whether a requested time window is available. It does not create or save bookings.

## Structure
- src/utils/availability.ts: booking rule, checkAvailability(room, start, end, currentTime, existingBookings)
- src/utils/time.ts: time helpers (labelToMinutes, minutesToLabel)
- src/types.ts: shared types and limits (MAX_BOOKING_MINUTES = 120, minutes per day = 1440)
- src/App.tsx: form and check button
- src/components/: RoomCard, Timeline, ResultBanner (display only)
- src/data/sampleData.ts: rooms and bookings (fixtures)
- src/utils/availability.test.ts: tests T01–T20

## Acceptance criteria

- AC1: Reject start >= end and requests in the past.
- AC2: Enforce the maximum allowed duration (120 minutes).
- AC3: Reject a blocked room.
- AC4: Reject overlaps; allow bookings that only touch at endpoints.
- AC5: Return Available / Unavailable without changing booking data.
- AC6: Preserve clear UI feedback on desktop and mobile.

## Engineering rules
- Prefer pure functions and minimal changes.
- Use at most two justified design patterns.
- Do not mutate fixtures or booking data.
- Use shared helpers and constants instead of duplicating values.
- Do not change the UI or fixtures unless the task explicitly asks for it.

## Out of scope
- No backend, login, database, or saved bookings.

## Commands
- Run tests: npx vitest run

## Verification
- Run the existing tests before and after any change.
- Add focused regression tests for each acceptance criterion.
- Report changed files, the reason for each change, and the test output.