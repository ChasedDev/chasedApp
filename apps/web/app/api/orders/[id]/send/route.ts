import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { data: order, error: orderError } = await supabase.from('orders').select('*, order_items(*)').eq('id', id).eq('client_user_id', user.id).single();
  if (orderError || !order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  if (order.status !== 'draft') return NextResponse.json({ error: 'Order already sent' }, { status: 400 });
  const { error: updateError } = await supabase.from('orders').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', id);
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
  for (const item of order.order_items ?? []) {
    await supabase.rpc('decrement_stock', { p_product_id: item.product_id, p_qty: item.qty });
  }
  await supabase.from('events').insert({ user_id: user.id, pharmacy_id: order.pharmacy_id, event_name: 'whatsapp_opened', payload: { order_id: id } });
  return NextResponse.json({ success: true });
}
