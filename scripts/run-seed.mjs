/**
 * Aplica o seed SQL no Supabase
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://uqlhocpjdpwsvckvwxfn.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxbGhvY3BqZHB3c3Zja3Z3eGZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTgxMjM4MCwiZXhwIjoyMDg3Mzg4MzgwfQ.STk_jgIzkpr0TjcEyX6JSREzpnGKSHDLp8kqsW6fEJQ';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

console.log('Inserindo categorias...');
const { error: catError } = await supabase.from('categories').upsert([
  { id: 'a1b2c3d4-0001-0001-0001-000000000001', name: 'Analgésicos', active: true },
  { id: 'a1b2c3d4-0002-0002-0002-000000000002', name: 'Antibióticos', active: true },
  { id: 'a1b2c3d4-0003-0003-0003-000000000003', name: 'Vitaminas e Suplementos', active: true },
], { onConflict: 'id' });
if (catError) console.error('Erro categorias:', catError.message);
else console.log('✅ Categorias inseridas');

console.log('Inserindo produtos...');
const products = [
  // Analgésicos
  { id: 'p0000001-0000-0000-0000-000000000001', category_id: 'a1b2c3d4-0001-0001-0001-000000000001', name: 'Paracetamol', brand: 'Genérico', presentation: '500mg, 20 comprimidos', description: 'Analgésico e antitérmico de ação central.', price_cents: 890, stock_qty: 150, active: true, image_url: 'https://placehold.co/400x400/e8f5e9/2e7d32?text=Paracetamol' },
  { id: 'p0000001-0000-0000-0000-000000000002', category_id: 'a1b2c3d4-0001-0001-0001-000000000001', name: 'Ibuprofeno', brand: 'Aché', presentation: '600mg, 20 comprimidos', description: 'Anti-inflamatório não esteroidal.', price_cents: 1290, stock_qty: 80, active: true, image_url: 'https://placehold.co/400x400/e8f5e9/2e7d32?text=Ibuprofeno' },
  { id: 'p0000001-0000-0000-0000-000000000003', category_id: 'a1b2c3d4-0001-0001-0001-000000000001', name: 'Dipirona Sódica', brand: 'EMS', presentation: '500mg, 30 comprimidos', description: 'Analgésico e antitérmico potente.', price_cents: 1490, stock_qty: 200, active: true, image_url: 'https://placehold.co/400x400/e8f5e9/2e7d32?text=Dipirona' },
  { id: 'p0000001-0000-0000-0000-000000000004', category_id: 'a1b2c3d4-0001-0001-0001-000000000001', name: 'Nimesulida', brand: 'Medley', presentation: '100mg, 12 comprimidos', description: 'Anti-inflamatório e analgésico.', price_cents: 1190, stock_qty: 60, active: true, image_url: 'https://placehold.co/400x400/e8f5e9/2e7d32?text=Nimesulida' },
  { id: 'p0000001-0000-0000-0000-000000000005', category_id: 'a1b2c3d4-0001-0001-0001-000000000001', name: 'Codeína + Paracetamol', brand: 'Neosaldina', presentation: '30mg+500mg, 20 comprimidos', description: 'Analgésico opioide combinado.', price_cents: 2890, stock_qty: 30, active: true, image_url: 'https://placehold.co/400x400/e8f5e9/2e7d32?text=Codeina' },
  { id: 'p0000001-0000-0000-0000-000000000006', category_id: 'a1b2c3d4-0001-0001-0001-000000000001', name: 'Cetoprofeno', brand: 'Eurofarma', presentation: '150mg, 10 comprimidos', description: 'Anti-inflamatório potente.', price_cents: 1890, stock_qty: 45, active: true, image_url: 'https://placehold.co/400x400/e8f5e9/2e7d32?text=Cetoprofeno' },
  { id: 'p0000001-0000-0000-0000-000000000007', category_id: 'a1b2c3d4-0001-0001-0001-000000000001', name: 'Meloxicam', brand: 'Genérico', presentation: '15mg, 10 comprimidos', description: 'Anti-inflamatório para artrite.', price_cents: 1590, stock_qty: 55, active: true, image_url: 'https://placehold.co/400x400/e8f5e9/2e7d32?text=Meloxicam' },
  // Antibióticos
  { id: 'p0000002-0000-0000-0000-000000000001', category_id: 'a1b2c3d4-0002-0002-0002-000000000002', name: 'Amoxicilina', brand: 'Medley', presentation: '500mg, 21 cápsulas', description: 'Antibiótico de amplo espectro.', price_cents: 2190, stock_qty: 70, active: true, image_url: 'https://placehold.co/400x400/e3f2fd/1565c0?text=Amoxicilina' },
  { id: 'p0000002-0000-0000-0000-000000000002', category_id: 'a1b2c3d4-0002-0002-0002-000000000002', name: 'Azitromicina', brand: 'EMS', presentation: '500mg, 5 comprimidos', description: 'Antibiótico macrolídeo.', price_cents: 3490, stock_qty: 40, active: true, image_url: 'https://placehold.co/400x400/e3f2fd/1565c0?text=Azitromicina' },
  { id: 'p0000002-0000-0000-0000-000000000003', category_id: 'a1b2c3d4-0002-0002-0002-000000000002', name: 'Ciprofloxacino', brand: 'Genérico', presentation: '500mg, 14 comprimidos', description: 'Antibiótico fluoroquinolona.', price_cents: 2890, stock_qty: 35, active: true, image_url: 'https://placehold.co/400x400/e3f2fd/1565c0?text=Ciprofloxacino' },
  { id: 'p0000002-0000-0000-0000-000000000004', category_id: 'a1b2c3d4-0002-0002-0002-000000000002', name: 'Doxiciclina', brand: 'Aché', presentation: '100mg, 15 comprimidos', description: 'Antibiótico tetraciclina.', price_cents: 3190, stock_qty: 25, active: true, image_url: 'https://placehold.co/400x400/e3f2fd/1565c0?text=Doxiciclina' },
  { id: 'p0000002-0000-0000-0000-000000000005', category_id: 'a1b2c3d4-0002-0002-0002-000000000002', name: 'Metronidazol', brand: 'Eurofarma', presentation: '400mg, 21 comprimidos', description: 'Antibiótico antiprotozoário.', price_cents: 1890, stock_qty: 50, active: true, image_url: 'https://placehold.co/400x400/e3f2fd/1565c0?text=Metronidazol' },
  { id: 'p0000002-0000-0000-0000-000000000006', category_id: 'a1b2c3d4-0002-0002-0002-000000000002', name: 'Cefalexina', brand: 'Ranbaxy', presentation: '500mg, 24 cápsulas', description: 'Antibiótico cefalosporina.', price_cents: 2490, stock_qty: 30, active: true, image_url: 'https://placehold.co/400x400/e3f2fd/1565c0?text=Cefalexina' },
  // Vitaminas
  { id: 'p0000003-0000-0000-0000-000000000001', category_id: 'a1b2c3d4-0003-0003-0003-000000000003', name: 'Vitamina C', brand: 'Vitaminlife', presentation: '1000mg, 60 comprimidos efervescentes', description: 'Suplemento de Vitamina C com Zinco.', price_cents: 2490, stock_qty: 120, active: true, image_url: 'https://placehold.co/400x400/fff3e0/e65100?text=Vitamina+C' },
  { id: 'p0000003-0000-0000-0000-000000000002', category_id: 'a1b2c3d4-0003-0003-0003-000000000003', name: 'Vitamina D3', brand: 'Sundown', presentation: '2000 UI, 120 cápsulas softgel', description: 'Suplemento de Vitamina D3.', price_cents: 3990, stock_qty: 90, active: true, image_url: 'https://placehold.co/400x400/fff3e0/e65100?text=Vitamina+D3' },
  { id: 'p0000003-0000-0000-0000-000000000003', category_id: 'a1b2c3d4-0003-0003-0003-000000000003', name: 'Complexo B', brand: 'Vitaminlife', presentation: '60 cápsulas', description: 'Complexo de vitaminas B.', price_cents: 2890, stock_qty: 75, active: true, image_url: 'https://placehold.co/400x400/fff3e0/e65100?text=Complexo+B' },
  { id: 'p0000003-0000-0000-0000-000000000004', category_id: 'a1b2c3d4-0003-0003-0003-000000000003', name: 'Ômega 3', brand: 'Maxifish', presentation: '1000mg, 60 cápsulas', description: 'Óleo de peixe EPA e DHA.', price_cents: 4990, stock_qty: 60, active: true, image_url: 'https://placehold.co/400x400/fff3e0/e65100?text=Omega+3' },
  { id: 'p0000003-0000-0000-0000-000000000005', category_id: 'a1b2c3d4-0003-0003-0003-000000000003', name: 'Magnésio', brand: 'Essential', presentation: '300mg, 60 cápsulas', description: 'Magnésio quelato de alta absorção.', price_cents: 3490, stock_qty: 85, active: true, image_url: 'https://placehold.co/400x400/fff3e0/e65100?text=Magnesio' },
  { id: 'p0000003-0000-0000-0000-000000000006', category_id: 'a1b2c3d4-0003-0003-0003-000000000003', name: 'Probiótico', brand: 'Floratil', presentation: '200mg, 8 sachês', description: 'Saccharomyces boulardii.', price_cents: 5490, stock_qty: 40, active: true, image_url: 'https://placehold.co/400x400/fff3e0/e65100?text=Probiotico' },
  { id: 'p0000003-0000-0000-0000-000000000007', category_id: 'a1b2c3d4-0003-0003-0003-000000000003', name: 'Zinco', brand: 'Vitaminlife', presentation: '30mg, 60 cápsulas', description: 'Zinco quelato de alta absorção.', price_cents: 2190, stock_qty: 100, active: true, image_url: 'https://placehold.co/400x400/fff3e0/e65100?text=Zinco' },
];

const { error: prodError } = await supabase.from('products').upsert(products, { onConflict: 'id' });
if (prodError) console.error('Erro produtos:', prodError.message);
else console.log(`✅ ${products.length} produtos inseridos`);

console.log('Inserindo banners promocionais...');
const { error: bannerError } = await supabase.from('promo_banners').upsert([
  { title: 'Vitaminas em Oferta', subtitle: 'Confira nossa linha de vitaminas e suplementos', image_url: 'https://placehold.co/800x400/fff3e0/e65100?text=Vitaminas+em+Oferta', link_type: 'category', link_target_id: 'a1b2c3d4-0003-0003-0003-000000000003', active: true, sort_order: 0 },
  { title: 'Antibióticos Disponíveis', subtitle: 'Linha completa com receita médica', image_url: 'https://placehold.co/800x400/e3f2fd/1565c0?text=Antibioticos', link_type: 'category', link_target_id: 'a1b2c3d4-0002-0002-0002-000000000002', active: true, sort_order: 1 },
], { onConflict: 'id' });
if (bannerError) console.error('Erro banners:', bannerError.message);
else console.log('✅ Banners inseridos');
