'use client';
import { PrimaryButton } from './PrimaryButton';

interface ModalConfirmProps { open: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void; confirmLabel?: string; danger?: boolean; }

export function ModalConfirm({ open, title, message, onConfirm, onCancel, confirmLabel = 'Confirmar', danger = false }: ModalConfirmProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50">Cancelar</button>
          <PrimaryButton onClick={onConfirm} className={`flex-1 ${danger ? 'bg-red-500 hover:bg-red-600' : ''}`}>{confirmLabel}</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
