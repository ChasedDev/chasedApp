interface ErrorStateProps { message?: string; onRetry?: () => void; }

export function ErrorState({ message = 'Ocorreu um erro', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4">⚠️</div>
      <p className="text-gray-500 font-medium">{message}</p>
      {onRetry && <button onClick={onRetry} className="mt-4 text-brand-600 font-semibold hover:underline">Tentar novamente</button>}
    </div>
  );
}
