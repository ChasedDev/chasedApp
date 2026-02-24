import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { UpdateProfileSchema } from '@chased/shared';

export async function GET() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  const { data: pharmacy } = await supabase.from('pharmacies').select('*').eq('owner_user_id', user.id).single();
  return NextResponse.json({ ...profile, ...pharmacy, email: user.email });
}

export async function PUT(req: NextRequest) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const parsed = UpdateProfileSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { name, phone, pharmacy_name, responsible_name, cnpj, whatsapp, address_line1, city, state, zip } = parsed.data;
  if (name || phone !== undefined) await supabase.from('profiles').update({ name, phone }).eq('id', user.id);
  const pharmacyUpdate: Record<string, unknown> = {};
  if (pharmacy_name) pharmacyUpdate.pharmacy_name = pharmacy_name;
  if (responsible_name) pharmacyUpdate.responsible_name = responsible_name;
  if (cnpj !== undefined) pharmacyUpdate.cnpj = cnpj;
  if (whatsapp) pharmacyUpdate.whatsapp = whatsapp;
  if (address_line1) pharmacyUpdate.address_line1 = address_line1;
  if (city) pharmacyUpdate.city = city;
  if (state) pharmacyUpdate.state = state;
  if (zip) pharmacyUpdate.zip = zip;
  if (Object.keys(pharmacyUpdate).length > 0) await supabase.from('pharmacies').update(pharmacyUpdate).eq('owner_user_id', user.id);
  return NextResponse.json({ success: true });
}
