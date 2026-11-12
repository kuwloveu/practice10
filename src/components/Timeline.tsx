import { Booking } from '@/types';
import { minutesToLabel } from '@/utils/time';

interface Props {
  bookings: Booking[];
  candidateStart: number | null;
  candidateEnd: number | null;
}

const HOUR_START = 8; // visible range 08:00–22:00
const HOUR_END = 22;
const SPAN = (HOUR_END - HOUR_START) * 60;

export function Timeline({ bookings, candidateStart, candidateEnd }: Props) {
  const hours: number[] = [];
  for (let h = HOUR_START; h <= HOUR_END; h++) hours.push(h);

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[640px]">
        {/* hour labels */}
        <div className="relative h-5">
          {hours.map((h) => (
            <span
              key={h}
              className="absolute -translate-x-1/2 text-[10px] font-medium text-slate-400"
              style={{ left: `${((h * 60 - HOUR_START * 60) / SPAN) * 100}%` }}
            >
              {String(h).padStart(2, '0')}:00
            </span>
          ))}
        </div>

        {/* track */}
        <div className="relative h-12 rounded-lg border border-slate-200 bg-slate-50">
          {/* hour gridlines */}
          {hours.map((h) => (
            <div
              key={h}
              className="absolute top-0 bottom-0 w-px bg-slate-200"
              style={{ left: `${((h * 60 - HOUR_START * 60) / SPAN) * 100}%` }}
            />
          ))}

          {/* existing bookings */}
          {bookings.map((b) => {
            const left = ((b.start - HOUR_START * 60) / SPAN) * 100;
            const width = ((b.end - b.start) / SPAN) * 100;
            return (
              <div
                key={b.id}
                className="absolute top-1 bottom-1 flex items-center justify-center overflow-hidden rounded-md bg-slate-300 px-1 text-[10px] font-medium text-slate-700"
                style={{ left: `${left}%`, width: `${width}%` }}
                title={`${b.bookedBy} · ${minutesToLabel(b.start)}–${minutesToLabel(b.end)}`}
              >
                <span className="truncate">{b.bookedBy}</span>
              </div>
            );
          })}

          {/* candidate interval */}
          {candidateStart !== null && candidateEnd !== null &&
            candidateStart >= HOUR_START * 60 &&
            candidateEnd <= HOUR_END * 60 && (
              <div
                className="absolute top-1 bottom-1 rounded-md border-2 border-dashed border-sky-500 bg-sky-200/50"
                style={{
                  left: `${((candidateStart - HOUR_START * 60) / SPAN) * 100}%`,
                  width: `${((candidateEnd - candidateStart) / SPAN) * 100}%`,
                }}
                title="Your selected interval"
              />
            )}
        </div>

        {/* legend */}
        <div className="mt-2 flex items-center gap-4 text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded bg-slate-300" /> Existing booking
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded border-2 border-dashed border-sky-500 bg-sky-200/50" />
            Your interval
          </span>
        </div>
      </div>
    </div>
  );
}
