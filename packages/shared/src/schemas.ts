import { z } from 'zod';

export const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  phone: z.string().optional(),
  pharmacy_name: z.string().min(2),
  responsible_name: z.string().min(2),
  cnpj: z.string().optional(),
  whatsapp: z.string().min(10),
  address_line1: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2).max(2),
  zip: z.string().min(8),
});

export const CreateOrderSchema = z.object({
  items: z.array(z.object({
    product_id: z.string().uuid(),
    qty: z.number().int().positive(),
  })).min(1),
  notes: z.string().max(500).optional(),
});

export const UpdateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  pharmacy_name: z.string().min(2).optional(),
  responsible_name: z.string().min(2).optional(),
  cnpj: z.string().optional(),
  whatsapp: z.string().min(10).optional(),
  address_line1: z.string().min(5).optional(),
  city: z.string().min(2).optional(),
  state: z.string().min(2).max(2).optional(),
  zip: z.string().min(8).optional(),
});

export const ProductSchema = z.object({
  category_id: z.string().uuid(),
  name: z.string().min(2),
  brand: z.string().optional().nullable(),
  presentation: z.string().min(2),
  description: z.string().optional().nullable(),
  price_cents: z.number().int().positive(),
  stock_qty: z.number().int().min(0),
  active: z.boolean().default(true),
  image_url: z.string().url().optional().nullable(),
});

export const CategorySchema = z.object({
  name: z.string().min(2),
  active: z.boolean().default(true),
});

export const PromoSchema = z.object({
  title: z.string().min(2),
  subtitle: z.string().optional().nullable(),
  image_url: z.string().url(),
  link_type: z.enum(['category', 'product', 'none']),
  link_target_id: z.string().uuid().optional().nullable(),
  active: z.boolean().default(true),
  sort_order: z.number().int().default(0),
});

export const RepSettingsSchema = z.object({
  display_name: z.string().min(2),
  whatsapp_number_e164: z.string().regex(/^\+\d{10,15}$/),
  whatsapp_number_digits: z.string().regex(/^\d{10,15}$/),
  logo_url: z.string().url().optional().nullable(),
  default_footer_message: z.string().optional().nullable(),
});

export const EventSchema = z.object({
  event_name: z.string().min(1),
  payload: z.record(z.unknown()).default({}),
});
