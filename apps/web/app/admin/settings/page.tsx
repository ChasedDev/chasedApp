'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RepSettingsSchema } from '@chased/shared';
import { z } from 'zod';
import type { RepSettings } from '@chased/shared';
import { FormField } from '@/components/ui/FormField';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/lib/hooks/useToast';

type SettingsForm = z.infer<typeof RepSettingsSchema>;

export default function AdminSettingsPage() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: settings, isLoading } = useQuery<RepSettings>({ queryKey: ['admin-settings'], queryFn: () => fetch('/api/admin/settings').then(r => r.json()) });
  const { register, handleSubmit, formState: { errors } } = useForm<SettingsForm>({ resolver: zodResolver(RepSettingsSchema), values: settings });
  const mutation = useMutation({
    mutationFn: (data: SettingsForm) => fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-settings'] }); toast({ message: 'Configurações salvas!', type: 'success' }); },
    onError: () => toast({ message: 'Erro ao salvar', type: 'error' }),
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-lg space-y-4">
      <h1 className="text-2xl font-bold">Configurações do representante</h1>
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-800">
        Para alterar o número do WhatsApp, edite os campos abaixo. E.164: +5511999999999 | Dígitos: 5511999999999
      </div>
      <form onSubmit={handleSubmit(data => mutation.mutate(data))} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <FormField label="Nome de exibição" error={errors.display_name?.message}><input {...register('display_name')} className="input-base" /></FormField>
        <FormField label="WhatsApp E.164 (ex: +5511999999999)" error={errors.whatsapp_number_e164?.message}><input {...register('whatsapp_number_e164')} className="input-base" /></FormField>
        <FormField label="WhatsApp dígitos para wa.me" error={errors.whatsapp_number_digits?.message}><input {...register('whatsapp_number_digits')} className="input-base" /></FormField>
        <FormField label="URL do logo" error={errors.logo_url?.message}><input {...register('logo_url')} type="url" className="input-base" /></FormField>
        <FormField label="Mensagem rodapé" error={errors.default_footer_message?.message}><textarea {...register('default_footer_message')} className="input-base" rows={2} /></FormField>
        <PrimaryButton type="submit" loading={mutation.isPending} className="w-full">Salvar configurações</PrimaryButton>
      </form>
    </div>
  );
}
