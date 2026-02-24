'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { FormField } from '@/components/ui/FormField';
import { useToast } from '@/lib/hooks/useToast';
import { useQueryClient } from '@tanstack/react-query';

const LoginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});
type LoginForm = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({ resolver: zodResolver(LoginSchema) });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    qc.clear();

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error || !authData.user) {
      toast({ message: error?.message ?? 'Erro ao entrar', type: 'error' });
      setLoading(false);
      return;
    }

    // Always query by user id to avoid RLS stale row issues
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single();

    setLoading(false);
    const isAdmin = profile?.role === 'rep_admin';

    // Hard redirect to bypass client-side cache completely
    window.location.href = isAdmin ? '/admin' : '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-600/30">
            <i className="fa-solid fa-capsules text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Chased</h1>
          <p className="text-slate-400 mt-1 text-sm">Plataforma de vendas farmacêuticas</p>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-bold mb-5 text-slate-800">Entrar na sua conta</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField label="E-mail" error={errors.email?.message}>
              <input {...register('email')} type="email" className="input-base" placeholder="seu@email.com" autoComplete="email" />
            </FormField>
            <FormField label="Senha" error={errors.password?.message}>
              <input {...register('password')} type="password" className="input-base" autoComplete="current-password" />
            </FormField>
            <PrimaryButton type="submit" loading={loading} className="w-full" size="lg">
              <i className="fa-solid fa-arrow-right-to-bracket" />Entrar
            </PrimaryButton>
          </form>
          <p className="text-center text-sm text-slate-400 mt-4">
            Não tem conta?{' '}
            <Link href="/register" className="text-brand-600 font-semibold hover:underline">Cadastre-se</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
