# Chased — Pharmaceutical Sales Platform

## Quick Start

```bash
# 1. Install deps
npm install

# 2. Start Supabase local
npx supabase start

# 3. Apply migrations + seed
npx supabase db reset

# 4. Copy env and fill values
cp .env.example apps/web/.env.local

# 5. Create demo users
SUPABASE_SERVICE_ROLE_KEY=<key> NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321 node supabase/seed-users.mjs

# 6. Run dev
npm run dev
```

## Demo Accounts
| Role | Email | Password |
|------|-------|----------|
| rep_admin | admin@chased.com | chased123 |
| client | farmacia@demo.com | chased123 |

## Change WhatsApp Number
Via Admin UI: login as admin → /admin/settings → update both fields.
Via SQL: `UPDATE rep_settings SET whatsapp_number_e164='+5511999999999', whatsapp_number_digits='5511999999999';`

## WhatsApp Flow
1. Client adds to cart → /checkout → "Gerar pedido"
2. Server creates order + items, calculates totals server-side, builds message
3. Client sees message preview → clicks "Enviar via WhatsApp"
4. App opens wa.me URL in new tab, marks order as sent, decrements stock

## Analytics Queries
```sql
-- Top products
SELECT payload->>'product_id', COUNT(*) FROM events WHERE event_name='add_to_cart' GROUP BY 1 ORDER BY 2 DESC LIMIT 10;

-- Daily orders
SELECT DATE_TRUNC('day', created_at), COUNT(*), SUM(total_cents)/100.0 FROM orders GROUP BY 1 ORDER BY 1 DESC;

-- Funnel
SELECT COUNT(*) FILTER (WHERE event_name='product_view') views, COUNT(*) FILTER (WHERE event_name='add_to_cart') carts, COUNT(*) FILTER (WHERE event_name='order_created') orders FROM events;
```

## Deployment
1. Create Supabase project at supabase.com
2. Run migrations via SQL editor
3. Import repo to Vercel, set root dir to `apps/web`
4. Set env vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
