interface FormFieldProps { label: string; error?: string; children: React.ReactNode; hint?: string; }

export function FormField({ label, error, children, hint }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      {children}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
      {error && <p className="text-xs text-red-500 flex items-center gap-1"><i className="fa-solid fa-circle-exclamation" />{error}</p>}
    </div>
  );
}
