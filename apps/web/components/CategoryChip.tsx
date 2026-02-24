import clsx from 'clsx';

export function CategoryChip({ label, active, onClick, icon }: { label: string; active?: boolean; onClick: () => void; icon?: string }) {
  return (
    <button onClick={onClick} className={clsx(
      'flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-all shrink-0',
      active ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30' : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300 hover:text-brand-600'
    )}>
      {icon && <i className={`fa-solid ${icon} text-xs`} />}
      {label}
    </button>
  );
}
