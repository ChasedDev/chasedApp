import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, assertRepAdmin } from '@/lib/supabase/server';
import { RepSettingsSchema } from '@chased/shared';

export async function GET() {
  const supabase = await createServerClient();
  if (!(await assertRepAdmin(supabase))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { data, error } = await supabase.from('rep_settings').select('*').limit(1).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!(await assertRepAdmin(supabase))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await req.json();
  const parsed = RepSettingsSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { data: existing } = await supabase.from('rep_settings').select('id').limit(1).single();
  if (existing) {
    await supabase.from('rep_settings').update({ ...parsed.data, updated_at: new Date().toISOString() }).eq('id', existing.id);
  } else {
    await supabase.from('rep_settings').insert({ ...parsed.data, owner_user_id: user!.id });
  }
  return NextResponse.json({ success: true });
}
