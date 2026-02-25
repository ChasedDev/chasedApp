import { NextRequest, NextResponse } from 'next/server';
import { SignupSchema } from '@chased/shared';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = SignupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;

    // 1) Create Auth user (admin)
    const { data: created, error: signupError } =
      await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
      });

    if (signupError || !created.user) {
      return NextResponse.json(
        { error: signupError?.message || 'Erro ao criar usuário' },
        { status: 400 }
      );
    }

    const userId = created.user.id;

    // 2) Upsert profile (bypass RLS)
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert(
        { id: userId, role: 'client', name: data.name, phone: data.phone ?? null },
        { onConflict: 'id' }
      );

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    // 3) Upsert pharmacy (bypass RLS)
    const { error: pharmacyError } = await supabaseAdmin
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