-- ============================================================
-- CHASED - Seed Data (UUIDs válidos)
-- ============================================================

-- Categorias
INSERT INTO categories (id, name, active) VALUES
  ('01be3b9d-1365-4b3b-8805-6490032acae2', 'Analgésicos', TRUE),
  ('a5a99249-3870-430f-b3de-56f42be0a5da', 'Antibióticos', TRUE),
  ('e6ba7aa1-3529-4ceb-898c-13b71a4d7526', 'Vitaminas e Suplementos', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Produtos - Analgésicos
INSERT INTO products (id, category_id, name, brand, presentation, description, price_cents, stock_qty, active, image_url) VALUES
  ('58069171-89f4-4b39-a89f-20c40583d13c', '01be3b9d-1365-4b3b-8805-6490032acae2', 'Paracetamol', 'Genérico', '500mg, 20 comprimidos', 'Analgésico e antitérmico de ação central.', 890, 150, TRUE, 'https://placehold.co/400x400/e8f5e9/2e7d32?text=Paracetamol'),
  ('0d29c8e1-71c3-4f0f-8c5d-f2c9a04f78fd', '01be3b9d-1365-4b3b-8805-6490032acae2', 'Ibuprofeno', 'Aché', '600mg, 20 comprimidos', 'Anti-inflamatório não esteroidal.', 1290, 80, TRUE, 'https://placehold.co/400x400/e8f5e9/2e7d32?text=Ibuprofeno'),
  ('3807aeea-e704-45f5-a7aa-46311e24a031', '01be3b9d-1365-4b3b-8805-6490032acae2', 'Dipirona Sódica', 'EMS', '500mg, 30 comprimidos', 'Analgésico e antitérmico potente.', 1490, 200, TRUE, 'https://placehold.co/400x400/e8f5e9/2e7d32?text=Dipirona'),
  ('5e116d5a-879a-46ce-a8fe-f2f3d16fe98e', '01be3b9d-1365-4b3b-8805-6490032acae2', 'Nimesulida', 'Medley', '100mg, 12 comprimidos', 'Anti-inflamatório e analgésico.', 1190, 60, TRUE, 'https://placehold.co/400x400/e8f5e9/2e7d32?text=Nimesulida'),
  ('d9544051-570f-44f2-913b-4ec79932c923', '01be3b9d-1365-4b3b-8805-6490032acae2', 'Cetoprofeno', 'Eurofarma', '150mg, 10 comprimidos', 'Anti-inflamatório e analgésico potente.', 1890, 45, TRUE, 'https://placehold.co/400x400/e8f5e9/2e7d32?text=Cetoprofeno'),
  ('7887fd6c-3fad-4e87-b346-e075a56cbf15', '01be3b9d-1365-4b3b-8805-6490032acae2', 'Meloxicam', 'Genérico', '15mg, 10 comprimidos', 'Anti-inflamatório para artrite.', 1590, 55, TRUE, 'https://placehold.co/400x400/e8f5e9/2e7d32?text=Meloxicam'),
  ('f871280e-f0ba-438b-bde2-d40238b1dce3', '01be3b9d-1365-4b3b-8805-6490032acae2', 'Codeína + Paracetamol', 'Neosaldina', '30mg+500mg, 20 comprimidos', 'Analgésico opioide combinado.', 2890, 30, TRUE, 'https://placehold.co/400x400/e8f5e9/2e7d32?text=Codeina')
ON CONFLICT (id) DO NOTHING;

-- Produtos - Antibióticos
INSERT INTO products (id, category_id, name, brand, presentation, description, price_cents, stock_qty, active, image_url) VALUES
  ('0de300c1-530e-486f-a0d2-17fd2fd6e692', 'a5a99249-3870-430f-b3de-56f42be0a5da', 'Amoxicilina', 'Medley', '500mg, 21 cápsulas', 'Antibiótico de amplo espectro.', 2190, 70, TRUE, 'https://placehold.co/400x400/e3f2fd/1565c0?text=Amoxicilina'),
  ('4e60ae89-3b87-40d0-a2a4-d4866a25a4d6', 'a5a99249-3870-430f-b3de-56f42be0a5da', 'Azitromicina', 'EMS', '500mg, 5 comprimidos', 'Antibiótico macrolídeo de espectro ampliado.', 3490, 40, TRUE, 'https://placehold.co/400x400/e3f2fd/1565c0?text=Azitromicina'),
  ('28ff7d29-0f9f-4fb1-bff9-9eaef58208fc', 'a5a99249-3870-430f-b3de-56f42be0a5da', 'Ciprofloxacino', 'Genérico', '500mg, 14 comprimidos', 'Antibiótico fluoroquinolona.', 2890, 35, TRUE, 'https://placehold.co/400x400/e3f2fd/1565c0?text=Ciprofloxacino'),
  ('bb19bedb-1b0b-4593-9d7a-4e72e72041b0', 'a5a99249-3870-430f-b3de-56f42be0a5da', 'Doxiciclina', 'Aché', '100mg, 15 comprimidos', 'Antibiótico tetraciclina de longa ação.', 3190, 25, TRUE, 'https://placehold.co/400x400/e3f2fd/1565c0?text=Doxiciclina'),
  ('19304d29-812a-4d3e-bce7-5b5ff78d1aa7', 'a5a99249-3870-430f-b3de-56f42be0a5da', 'Metronidazol', 'Eurofarma', '400mg, 21 comprimidos', 'Antibiótico antiprotozoário.', 1890, 50, TRUE, 'https://placehold.co/400x400/e3f2fd/1565c0?text=Metronidazol'),
  ('ca121f50-2b10-40b5-b7c6-86df0aaa0563', 'a5a99249-3870-430f-b3de-56f42be0a5da', 'Cefalexina', 'Ranbaxy', '500mg, 24 cápsulas', 'Antibiótico cefalosporina de 1ª geração.', 2490, 30, TRUE, 'https://placehold.co/400x400/e3f2fd/1565c0?text=Cefalexina')
ON CONFLICT (id) DO NOTHING;

-- Produtos - Vitaminas e Suplementos
INSERT INTO products (id, category_id, name, brand, presentation, description, price_cents, stock_qty, active, image_url) VALUES
  ('5fe01f2b-904d-4033-a0ae-0aa98a7781b1', 'e6ba7aa1-3529-4ceb-898c-13b71a4d7526', 'Vitamina C', 'Vitaminlife', '1000mg, 60 comprimidos efervescentes', 'Suplemento de Vitamina C com Zinco.', 2490, 120, TRUE, 'https://placehold.co/400x400/fff3e0/e65100?text=Vitamina+C'),
  ('f92d35ed-f4f0-427f-b26a-ce7fb0c76c84', 'e6ba7aa1-3529-4ceb-898c-13b71a4d7526', 'Vitamina D3', 'Sundown', '2000 UI, 120 cápsulas softgel', 'Suplemento de Vitamina D3.', 3990, 90, TRUE, 'https://placehold.co/400x400/fff3e0/e65100?text=Vitamina+D3'),
  ('70e6546f-cdb7-49d4-836f-f69f5dea5b94', 'e6ba7aa1-3529-4ceb-898c-13b71a4d7526', 'Complexo B', 'Vitaminlife', '60 cápsulas', 'Complexo completo de vitaminas do complexo B.', 2890, 75, TRUE, 'https://placehold.co/400x400/fff3e0/e65100?text=Complexo+B'),
  ('9e7939cd-430f-4fe8-be2b-05caa11b16dc', 'e6ba7aa1-3529-4ceb-898c-13b71a4d7526', 'Ômega 3', 'Maxifish', '1000mg, 60 cápsulas', 'Óleo de peixe rico em EPA e DHA.', 4990, 60, TRUE, 'https://placehold.co/400x400/fff3e0/e65100?text=Omega+3'),
  ('727e8f70-8e00-42c1-bed8-0e57b7cd46ac', 'e6ba7aa1-3529-4ceb-898c-13b71a4d7526', 'Magnésio', 'Essential', '300mg, 60 cápsulas', 'Magnésio quelato de alta absorção.', 3490, 85, TRUE, 'https://placehold.co/400x400/fff3e0/e65100?text=Magnesio'),
  ('ff0eb75d-70ff-4542-8db7-8e4fc2b4520f', 'e6ba7aa1-3529-4ceb-898c-13b71a4d7526', 'Probiótico', 'Floratil', '200mg, 8 sachês', 'Suplemento probiótico com Saccharomyces.', 5490, 40, TRUE, 'https://placehold.co/400x400/fff3e0/e65100?text=Probiotico'),
  ('ac4a6ba6-accc-493a-b50f-aa14bbc60a0f', 'e6ba7aa1-3529-4ceb-898c-13b71a4d7526', 'Zinco', 'Vitaminlife', '30mg, 60 cápsulas', 'Suplemento mineral de zinco quelato.', 2190, 100, TRUE, 'https://placehold.co/400x400/fff3e0/e65100?text=Zinco')
ON CONFLICT (id) DO NOTHING;

-- Banners promocionais
INSERT INTO promo_banners (title, subtitle, image_url, link_type, link_target_id, active, sort_order) VALUES
  ('Vitaminas em Oferta', 'Confira nossa linha de vitaminas e suplementos', 'https://placehold.co/800x400/fff3e0/e65100?text=Vitaminas+em+Oferta', 'category', 'e6ba7aa1-3529-4ceb-898c-13b71a4d7526', TRUE, 0),
  ('Antibióticos Disponíveis', 'Linha completa de antibióticos com receita', 'https://placehold.co/800x400/e3f2fd/1565c0?text=Antibioticos', 'category', 'a5a99249-3870-430f-b3de-56f42be0a5da', TRUE, 1)
ON CONFLICT DO NOTHING;
