import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, assertRepAdmin } from '@/lib/supabase/server';
import { CategorySchema } from '@chased/shared';

export async function GET() {
  const supabase = await createServerClient();
  if (!(await assertRepAdmin(supabase))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = await createServerClient();
  if (!(await assertRepAdmin(supabase))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await req.json();
  const parsed = CategorySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { data, error } = await supabase.from('categories').insert(parsed.data).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
