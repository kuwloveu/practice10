import { MapPin, Users, Lock } from 'lucide-react';
import { Room } from '@/types';

interface Props {
  room: Room;
  selected: boolean;
  onClick: () => void;
}

export function RoomCard({ room, selected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={[
        'group relative w-full rounded-xl border-2 p-4 text-left transition-all',
        selected
          ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-200'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50',
        room.blocked ? 'opacity-70' : '',
      ].join(' ')}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold text-slate-800">{room.name}</p>
          <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {room.building}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" /> {room.capacity}
            </span>
          </div>
        </div>
        {room.blocked && (
          <span className="flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
            <Lock className="h-3 w-3" /> Blocked
          </span>
        )}
      </div>
    </button>
  );
}
