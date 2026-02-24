import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, assertRepAdmin } from '@/lib/supabase/server';
import { ProductSchema } from '@chased/shared';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerClient();
  if (!(await assertRepAdmin(supabase))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
  if (error) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerClient();
  if (!(await assertRepAdmin(supabase))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await req.json();
  const parsed = ProductSchema.partial().safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { data, error } = await supabase.from('products').update({ ...parsed.data, updated_at: new Date().toISOString() }).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerClient();
  if (!(await assertRepAdmin(supabase))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
