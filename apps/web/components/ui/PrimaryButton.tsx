import clsx from 'clsx';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

export function PrimaryButton({ loading, children, className, disabled, variant = 'primary', size = 'md', ...props }: PrimaryButtonProps) {
  const base = 'flex items-center justify-center gap-2 font-semibold rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes = { sm: 'px-3 py-2 text-xs', md: 'px-5 py-3 text-sm', lg: 'px-6 py-3.5 text-base' };
  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-600/20',
    success: 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm shadow-emerald-500/20',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    ghost: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
  };
  return (
    <button {...props} disabled={disabled || loading} className={clsx(base, sizes[size], variants[variant], className)}>
      {loading ? <i className="fa-solid fa-circle-notch fa-spin" /> : children}
    </button>
  );
}
