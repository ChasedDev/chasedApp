'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import Image from 'next/image';
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

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single();

    setLoading(false);
    const isAdmin = profile?.role === 'rep_admin';
    window.location.href = isAdmin ? '/admin' : '/';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-br from-brand-50 via-white to-slate-50 px-4 py-10">

      {/* ── Center: Logo + Form ── */}
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="w-full max-w-sm">

          {/* Chesed logo */}
          <div className="flex justify-center mb-8">
            <div className="relative w-44 h-44 rounded-full overflow-hidden">
              <Image
                src="/logo-chesed.png"
                alt="Chesed Distribuidora"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Card */}
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

      {/* ── Bottom: Partner logos ── */}
      <div className="w-full max-w-sm mt-10">
        <p className="text-center text-xs text-slate-400 mb-4 uppercase tracking-widest font-medium">
          Parceiros
        </p>
        <div className="flex items-center justify-center gap-4">
          {/* Ranbaxy */}
          <div className="relative w-32 h-16 rounded-2xl overflow-hidden shadow-sm border border-slate-100">
            <Image
              src="/logo-ranbaxy.jpg"
              alt="Ranbaxy"
              fill
              className="object-cover"
            />
          </div>
          {/* Glenmark */}
          <div className="relative w-32 h-16 rounded-2xl overflow-hidden shadow-sm border border-slate-100">
            <Image
              src="/logo-glenmark.png"
              alt="Glenmark"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

    </div>
  );
}