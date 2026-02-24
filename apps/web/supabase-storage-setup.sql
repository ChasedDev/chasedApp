-- ============================================================
-- SUPABASE STORAGE SETUP
-- Execute no SQL Editor do Supabase para habilitar upload de imagens
-- ============================================================

-- 1. Crie o bucket (ou via dashboard: Storage → New bucket → "images" → Public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Política: qualquer usuário autenticado pode fazer upload
CREATE POLICY "Autenticados podem fazer upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- 3. Política: imagens são públicas para leitura
CREATE POLICY "Imagens são públicas"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

-- 4. Política: admin pode deletar imagens
CREATE POLICY "Admin pode deletar imagens"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images');
