import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { CreateOrderSchema, buildWhatsAppMessage, buildWhatsAppUrl, calculateOrderTotals } from '@chased/shared';

export async function POST(req: NextRequest) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const parsed = CreateOrderSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { items: cartItems, notes } = parsed.data;
  const { data: pharmacy } = await supabase.from('pharmacies').select('*').eq('owner_user_id', user.id).single();
  if (!pharmacy) return NextResponse.json({ error: 'Pharmacy not found. Complete your profile.' }, { status: 400 });
  const { data: repSettings } = await supabase.from('rep_settings').select('*').limit(1).single();
  if (!repSettings) return NextResponse.json({ error: 'Representative settings not configured' }, { status: 500 });
  const productIds = cartItems.map(i => i.product_id);
  const { data: products, error: productError } = await supabase.from('products').select('id, name, brand, presentation, price_cents, stock_qty, active').in('id', productIds);
  if (productError || !products) return NextResponse.json({ error: 'Error fetching products' }, { status: 500 });

  const orderItems: Array<{ product_id: string; product_snapshot: { name: string; brand: string | null; presentation: string; price_cents: number }; unit_price_cents: number; qty: number; line_total_cents: number; name: string; presentation: string }> = [];

  for (const cartItem of cartItems) {
    const product = products.find(p => p.id === cartItem.product_id);
    if (!product || !product.active) return NextResponse.json({ error: `Product ${cartItem.product_id} not found or inactive` }, { status: 400 });
    if (product.stock_qty < cartItem.qty) return NextResponse.json({ error: `Insufficient stock for ${product.name}` }, { status: 400 });
    orderItems.push({ product_id: product.id, product_snapshot: { name: product.name, brand: product.brand, presentation: product.presentation, price_cents: product.price_cents }, unit_price_cents: product.price_cents, qty: cartItem.qty, line_total_cents: product.price_cents * cartItem.qty, name: product.name, presentation: product.presentation });
  }

  const { subtotal_cents, discount_cents, total_cents } = calculateOrderTotals(orderItems.map(i => ({ unit_price_cents: i.unit_price_cents, qty: i.qty })));
const whatsapp_message = buildWhatsAppMessage({
  pharmacy_name: pharmacy.pharmacy_name,
  responsible_name: pharmacy.responsible_name,
  cnpj: pharmacy.cnpj ?? null, // ✅ add
  pharmacy_whatsapp: pharmacy.whatsapp,
  address_line1: pharmacy.address_line1,
  city: pharmacy.city,
  state: pharmacy.state,
  zip: pharmacy.zip,
  items: orderItems.map(i => ({
    name: i.name,
    presentation: i.presentation,
    qty: i.qty,
    unit_price_cents: i.unit_price_cents,
    line_total_cents: i.line_total_cents,
  })),
  notes: notes ?? null,
  subtotal_cents,
  discount_cents,
  total_cents,
});
  const whatsapp_url = buildWhatsAppUrl(repSettings.whatsapp_number_digits, whatsapp_message);

  const { data: order, error: orderError } = await supabase.from('orders').insert({ pharmacy_id: pharmacy.id, client_user_id: user.id, status: 'draft', notes: notes ?? null, subtotal_cents, discount_cents, total_cents, whatsapp_message }).select('id').single();
  if (orderError || !order) return NextResponse.json({ error: orderError?.message || 'Order creation failed' }, { status: 500 });

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems.map(i => ({ order_id: order.id, product_id: i.product_id, product_snapshot: i.product_snapshot, unit_price_cents: i.unit_price_cents, qty: i.qty, line_total_cents: i.line_total_cents })));
  if (itemsError) return NextResponse.json({ error: itemsError.message }, { status: 500 });

  await supabase.from('events').insert({ user_id: user.id, pharmacy_id: pharmacy.id, event_name: 'order_created', payload: { order_id: order.id, total_cents, item_count: orderItems.length } });
  return NextResponse.json({ order_id: order.id, whatsapp_url, whatsapp_message });
}

export async function GET() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { data, error } = await supabase.from('orders').select('*, pharmacies(*)').eq('client_user_id', user.id).order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
