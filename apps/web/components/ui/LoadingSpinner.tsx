export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const s = { sm: 'text-lg', md: 'text-3xl', lg: 'text-5xl' };
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <i className={`fa-solid fa-circle-notch fa-spin text-brand-500 ${s[size]}`} />
      <p className="text-sm text-slate-400">Carregando...</p>
    </div>
  );
}
