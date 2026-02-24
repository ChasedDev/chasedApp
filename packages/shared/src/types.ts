export type Role = 'client' | 'rep_admin';

export interface Profile {
  id: string;
  role: Role;
  name: string;
  phone: string | null;
  created_at: string;
}

export interface Pharmacy {
  id: string;
  owner_user_id: string;
  pharmacy_name: string;
  responsible_name: string;
  cnpj: string | null;
  whatsapp: string;
  address_line1: string;
  city: string;
  state: string;
  zip: string;
  created_at: string;
}

export interface RepSettings {
  id: string;
  owner_user_id: string;
  display_name: string;
  whatsapp_number_e164: string;
  whatsapp_number_digits: string;
  logo_url: string | null;
  default_footer_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  brand: string | null;
  presentation: string;
  description: string | null;
  price_cents: number;
  stock_qty: number;
  active: boolean;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  categories?: Category;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  link_type: 'category' | 'product' | 'none';
  link_target_id: string | null;
  active: boolean;
  sort_order: number;
  created_at: string;
}

export type OrderStatus = 'draft' | 'sent' | 'confirmed' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  pharmacy_id: string;
  client_user_id: string;
  status: OrderStatus;
  notes: string | null;
  subtotal_cents: number;
  discount_cents: number;
  total_cents: number;
  whatsapp_message: string;
  sent_at: string | null;
  created_at: string;
  pharmacies?: Pharmacy;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_snapshot: ProductSnapshot;
  unit_price_cents: number;
  qty: number;
  line_total_cents: number;
  created_at: string;
}

export interface ProductSnapshot {
  name: string;
  brand: string | null;
  presentation: string;
  price_cents: number;
}

export interface CartItem {
  product_id: string;
  name: string;
  brand: string | null;
  presentation: string;
  price_cents: number;
  image_url: string | null;
  qty: number;
  stock_qty: number;
}

export interface CreateOrderResponse {
  order_id: string;
  whatsapp_url: string;
  whatsapp_message: string;
}

export interface EventPayload {
  event_name: string;
  payload: Record<string, unknown>;
}
