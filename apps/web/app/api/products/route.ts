import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = await createServerClient();
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') ?? '';
  const categoryId = searchParams.get('categoryId') ?? '';
  let query = supabase.from('products').select('*, categories(id, name)').eq('active', true).order('name');
  if (categoryId) query = query.eq('category_id', categoryId);
  if (search) query = query.or(`name.ilike.%${search}%,brand.ilike.%${search}%,presentation.ilike.%${search}%`);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
