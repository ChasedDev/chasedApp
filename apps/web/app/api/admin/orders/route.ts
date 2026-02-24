import { NextResponse } from 'next/server';
import { createServerClient, assertRepAdmin } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createServerClient();
  if (!(await assertRepAdmin(supabase))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { data, error } = await supabase.from('orders').select('*, pharmacies(pharmacy_name, responsible_name, whatsapp)').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
