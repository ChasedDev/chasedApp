interface QuantitySelectorProps { value: number; onChange: (qty: number) => void; min?: number; max?: number; compact?: boolean; }

export function QuantitySelector({ value, onChange, min = 1, max = 999, compact = false }: QuantitySelectorProps) {
  return (
    <div className={`flex items-center bg-slate-100 rounded-2xl overflow-hidden gap-0.5 ${compact ? 'h-8' : 'h-10'}`}>
      <button onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}
        className={`flex items-center justify-center text-slate-600 hover:bg-white hover:text-brand-600 disabled:opacity-40 transition-all rounded-xl ${compact ? 'w-8 text-xs' : 'w-10 text-sm'}`}>
        <i className="fa-solid fa-minus" />
      </button>
      <span className={`flex items-center justify-center font-bold text-slate-900 ${compact ? 'w-8 text-sm' : 'w-10 text-base'}`}>{value}</span>
      <button onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}
        className={`flex items-center justify-center text-slate-600 hover:bg-white hover:text-brand-600 disabled:opacity-40 transition-all rounded-xl ${compact ? 'w-8 text-xs' : 'w-10 text-sm'}`}>
        <i className="fa-solid fa-plus" />
      </button>
    </div>
  );
}
