import Link from 'next/link';

interface EmptyStateProps { message: string; description?: string; icon?: string; action?: { label: string; href: string }; }

export function EmptyState({ message, description, icon = 'fa-box-open', action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
      <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mb-4">
        <i className={`fa-solid ${icon} text-2xl text-slate-400`} />
      </div>
      <p className="font-semibold text-slate-700 text-base">{message}</p>
      {description && <p className="text-sm text-slate-400 mt-1 max-w-xs">{description}</p>}
      {action && (
        <Link href={action.href} className="mt-5 btn-primary inline-flex">
          {action.label}
        </Link>
      )}
    </div>
  );
}
