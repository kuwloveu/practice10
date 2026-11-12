import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';
import { AvailabilityResult } from '@/types';

interface Props {
  result: AvailabilityResult | null;
}

export function ResultBanner({ result }: Props) {
  if (!result) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
        <Info className="h-5 w-5 shrink-0 text-slate-400" />
        <span>Select a room and time interval, then check availability.</span>
      </div>
    );
  }

  if (result.available) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
        <div>
          <p className="font-semibold">Available</p>
          <p className="text-emerald-700">{result.reason}</p>
        </div>
      </div>
    );
  }

  const isValidation = result.ruleCode === 'AC1' || result.ruleCode === 'AC2';
  const Icon = isValidation ? AlertCircle : XCircle;
  const colorClass = isValidation
    ? 'border-amber-200 bg-amber-50 text-amber-800'
    : 'border-rose-200 bg-rose-50 text-rose-800';
  const iconClass = isValidation ? 'text-amber-600' : 'text-rose-600';

  return (
      <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${colorClass}`}>
        <Icon className={`h-5 w-5 shrink-0 ${iconClass}`} />
        <div>
          <p className="font-semibold">
            Unavailable{result.ruleCode ? ` · ${result.ruleCode}` : ''}
          </p>
          <p className={isValidation ? 'text-amber-700' : 'text-rose-700'}>{result.reason}</p>
        </div>
      </div>
    );
}
