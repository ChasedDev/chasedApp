'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { FormField } from '@/components/ui/FormField';
import { useToast } from '@/lib/hooks/useToast';
import { useState } from 'react';

const RegisterSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  name: z.string().min(2, 'Nome obrigatório'),
  phone: z.string().optional(),
  pharmacy_name: z.string().min(2, 'Nome da farmácia obrigatório'),
  responsible_name: z.string().min(2, 'Responsável obrigatório'),
  cnpj: z.string().optional(),
  whatsapp: z.string().min(10, 'WhatsApp inválido'),
  address_line1: z.string().min(5, 'Endereço obrigatório'),
  city: z.string().min(2, 'Cidade obrigatória'),
  state: z.string().length(2, 'UF com 2 letras'),
  zip: z.string().min(8, 'CEP inválido'),
});
type RegisterForm = z.infer<typeof RegisterSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({ resolver: zodResolver(RegisterSchema) });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erro no cadastro');
      toast({ message: 'Cadastro realizado! Entrando...', type: 'success' });
      router.push('/');
    } catch (err: unknown) {
      toast({ message: (err as Error).message, type: 'error' });
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-700">Chased</h1>
          <p className="text-gray-500 mt-2">Crie sua conta</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <h3 className="font-semibold text-gray-700">Dados pessoais</h3>
            <FormField label="Nome completo" error={errors.name?.message}><input {...register('name')} className="input-base" /></FormField>
            <FormField label="E-mail" error={errors.email?.message}><input {...register('email')} type="email" className="input-base" /></FormField>
            <FormField label="Senha" error={errors.password?.message}><input {...register('password')} type="password" className="input-base" /></FormField>
            <FormField label="Telefone" error={errors.phone?.message}><input {...register('phone')} type="tel" className="input-base" /></FormField>
            <h3 className="font-semibold text-gray-700 pt-2">Dados da farmácia</h3>
            <FormField label="Nome da farmácia" error={errors.pharmacy_name?.message}><input {...register('pharmacy_name')} className="input-base" /></FormField>
            <FormField label="Responsável" error={errors.responsible_name?.message}><input {...register('responsible_name')} className="input-base" /></FormField>
            <FormField label="CNPJ" error={errors.cnpj?.message}><input {...register('cnpj')} className="input-base" placeholder="Opcional" /></FormField>
            <FormField label="WhatsApp da farmácia" error={errors.whatsapp?.message}><input {...register('whatsapp')} type="tel" className="input-base" placeholder="5511999999999" /></FormField>
            <FormField label="Endereço" error={errors.address_line1?.message}><input {...register('address_line1')} className="input-base" /></FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Cidade" error={errors.city?.message}><input {...register('city')} className="input-base" /></FormField>
              <FormField label="UF" error={errors.state?.message}><input {...register('state')} className="input-base" maxLength={2} placeholder="SP" /></FormField>
            </div>
            <FormField label="CEP" error={errors.zip?.message}><input {...register('zip')} className="input-base" /></FormField>
            <PrimaryButton type="submit" loading={loading} className="w-full mt-2">Criar conta</PrimaryButton>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Já tem conta?{' '}
            <Link href="/login" className="text-brand-600 font-medium hover:underline">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
