import { NextRequest, NextResponse } from 'next/server';
import { SignupSchema } from '@chased/shared';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = SignupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const supabase = await createServerClient();

    // 1) Create Auth user
    const { data: authData, error: signupError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (signupError || !authData.user) {
      return NextResponse.json(
        { error: signupError?.message || 'Erro ao criar usuário' },
        { status: 400 }
      );
    }

    const userId = authData.user.id;

    // 2) Upsert Profile (idempotent)
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(
        {
          id: userId,
          role: 'client',
          name: data.name,
          phone: data.phone ?? null,
        },
        { onConflict: 'id' }
      );

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    // 3) Upsert Pharmacy (recommended: unique on owner_user_id)
    const { error: pharmacyError } = await supabase
      .from('pharmacies')
      .upsert(
        {
          owner_user_id: userId,
          pharmacy_name: data.pharmacy_name,
          responsible_name: data.responsible_name,
          cnpj: data.cnpj ?? null,
          whatsapp: data.whatsapp,
          address_line1: data.address_line1,
          city: data.city,
          state: data.state,
          zip: data.zip,
        },
        { onConflict: 'owner_user_id' }
      );

    if (pharmacyError) {
      return NextResponse.json({ error: pharmacyError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, user_id: userId });
  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}