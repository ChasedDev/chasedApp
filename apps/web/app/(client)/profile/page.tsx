'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateProfileSchema } from '@chased/shared';
import { z } from 'zod';
import { FormField } from '@/components/ui/FormField';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/lib/hooks/useToast';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type ProfileForm = z.infer<typeof UpdateProfileSchema>;

export default function ProfilePage() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();
  const [loggingOut, setLoggingOut] = useState(false);

  const { data: me, isLoading } = useQuery({ queryKey: ['me'], queryFn: () => fetch('/api/me').then(r => r.json()) });
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({ resolver: zodResolver(UpdateProfileSchema), values: me });

  const mutation = useMutation({
    mutationFn: (data: ProfileForm) => fetch('/api/me', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['me'] }); toast({ message: 'Perfil atualizado!', type: 'success' }); },
    onError: () => toast({ message: 'Erro ao salvar', type: 'error' }),
  });

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    // Clear all cached queries on logout
    qc.clear();
    router.push('/login');
    router.refresh();
  };

  if (isLoading) return <LoadingSpinner />;
//ABC
  return (
    <div className="space-y-4 pb-nav">
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-xl font-bold">Meu perfil</h1>
        <div className="w-10 h-10 rounded-2xl bg-brand-100 flex items-center justify-center">
          <i className="fa-solid fa-user text-brand-600" />
        </div>
      </div>

      <form onSubmit={handleSubmit(data => mutation.mutate(data))} className="card p-5 space-y-4">
        <div className="pb-2 border-b border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dados pessoais</p>
        </div>
        <FormField label="Nome completo" error={errors.name?.message}><input {...register('name')} className="input-base" /></FormField>
        <FormField label="Telefone" error={errors.phone?.message}><input {...register('phone')} type="tel" className="input-base" /></FormField>

        <div className="pb-2 border-b border-slate-100 pt-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dados da farmácia</p>
        </div>
        <FormField label="Nome da farmácia" error={errors.pharmacy_name?.message}><input {...register('pharmacy_name')} className="input-base" /></FormField>
        <FormField label="Responsável" error={errors.responsible_name?.message}><input {...register('responsible_name')} className="input-base" /></FormField>
        <FormField label="CNPJ" error={errors.cnpj?.message}><input {...register('cnpj')} className="input-base" placeholder="Opcional" /></FormField>
        <FormField label="WhatsApp" error={errors.whatsapp?.message}><input {...register('whatsapp')} type="tel" className="input-base" /></FormField>
        <FormField label="Endereço" error={errors.address_line1?.message}><input {...register('address_line1')} className="input-base" /></FormField>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2"><FormField label="Cidade" error={errors.city?.message}><input {...register('city')} className="input-base" /></FormField></div>
          <FormField label="UF" error={errors.state?.message}><input {...register('state')} className="input-base" maxLength={2} placeholder="SP" /></FormField>
        </div>
        <FormField label="CEP" error={errors.zip?.message}><input {...register('zip')} className="input-base" /></FormField>

        <PrimaryButton type="submit" loading={mutation.isPending} className="w-full">
          <i className="fa-solid fa-floppy-disk" />Salvar alterações
        </PrimaryButton>
      </form>

      <button onClick={handleLogout} disabled={loggingOut}
        className="w-full py-3.5 rounded-2xl border-2 border-red-100 text-red-500 font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
        {loggingOut ? <i className="fa-solid fa-circle-notch fa-spin" /> : <i className="fa-solid fa-right-from-bracket" />}
        Sair da conta
      </button>
    </div>
  );
}
