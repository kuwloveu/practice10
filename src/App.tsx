import { useMemo, useState } from 'react';
import { Clock, Building2, CheckSquare } from 'lucide-react';
import { rooms, bookings } from '@/data/sampleData';
import { checkAvailability } from '@/utils/availability';
import { minutesToLabel, labelToMinutes, durationLabel } from '@/utils/time';
import { AvailabilityResult, MAX_BOOKING_MINUTES } from '@/types';
import { RoomCard } from '@/components/RoomCard';
import { Timeline } from '@/components/Timeline';
import { ResultBanner } from '@/components/ResultBanner';

function App() {
  const [selectedRoomId, setSelectedRoomId] = useState<string>('r1');
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('15:00');
  const [currentTime, setCurrentTime] = useState(780); // 13:00 default
  const [result, setResult] = useState<AvailabilityResult | null>(null);

  const selectedRoom = useMemo(
    () => rooms.find((r) => r.id === selectedRoomId) ?? null,
    [selectedRoomId],
  );

  const roomBookings = useMemo(
    () => bookings.filter((b) => b.roomId === selectedRoomId),
    [selectedRoomId],
  );

  // Empty time field must not be parsed: labelToMinutes('') would throw off the clock
  const startMin = startTime ? labelToMinutes(startTime) : NaN;
  const endMin = endTime ? labelToMinutes(endTime) : NaN;

  const handleCheck = () => {
    const res = checkAvailability(selectedRoom, startMin, endMin, currentTime, roomBookings);
    setResult(res);
  };

  const duration = endMin - startMin;
  const canCheck = selectedRoom !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <header className="mb-6 text-center sm:mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-1.5 text-sm font-medium text-sky-700">
            <Building2 className="h-4 w-4" />
            Smart Campus
          </div>
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            Room Availability Checker
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Check if a campus room is free for your chosen time slot.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Left: Room selection */}
          <section className="min-w-0 lg:col-span-2">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-600">
              <Building2 className="h-4 w-4" /> Select a Room
            </h2>
            <div className="space-y-3">
              {rooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  selected={room.id === selectedRoomId}
                  onClick={() => {
                    setSelectedRoomId(room.id);
                    setResult(null);
                  }}
                />
              ))}
            </div>
          </section>

          {/* Right: Time form + timeline + result */}
          <section className="min-w-0 lg:col-span-3 space-y-5">
            {/* Current time setter */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <label className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Clock className="h-4 w-4 text-slate-400" /> Current Time (for testing)
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={minutesToLabel(currentTime)}
                    onChange={(e) => {
                      if (!e.target.value) return;
                      setCurrentTime(labelToMinutes(e.target.value));
                      setResult(null);
                    }}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                  <span className="text-xs text-slate-400">{minutesToLabel(currentTime)}</span>
                </div>
              </label>
            </div>

            {/* Time interval form */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-600">
                <Clock className="h-4 w-4" /> Booking Interval
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Start</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => {
                      setStartTime(e.target.value);
                      setResult(null);
                    }}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">End</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => {
                      setEndTime(e.target.value);
                      setResult(null);
                    }}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Duration: <strong className="text-slate-700">{duration > 0 ? durationLabel(duration) : '—'}</strong>
                </span>
                {duration > MAX_BOOKING_MINUTES && (
                  <span className="font-medium text-amber-600">Exceeds {MAX_BOOKING_MINUTES} min limit</span>
                )}
              </div>

              <button
                onClick={handleCheck}
                disabled={!canCheck}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <CheckSquare className="h-4 w-4" /> Check Availability
              </button>
            </div>

            {/* Result */}
            <ResultBanner result={result} />

            {/* Timeline */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">
                Today's Schedule — {selectedRoom?.name}
              </h2>
              <Timeline
                bookings={roomBookings}
                candidateStart={result ? startMin : null}
                candidateEnd={result ? endMin : null}
              />
            </div>
          </section>
        </div>

        {/* Footer note */}
        <footer className="mt-8 text-center text-xs text-slate-400">
          Fictional sample data · Rooms and bookings shown for demonstration only.
        </footer>
      </div>
    </div>
  );
}

export default App;
