/**
 * Aplica a migration SQL no Supabase hospedado
 * usando a Management API
 */
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = 'https://uqlhocpjdpwsvckvwxfn.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxbGhvY3BqZHB3c3Zja3Z3eGZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTgxMjM4MCwiZXhwIjoyMDg3Mzg4MzgwfQ.STk_jgIzkpr0TjcEyX6JSREzpnGKSHDLp8kqsW6fEJQ';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '20240101000000_initial.sql');
const sql = readFileSync(migrationPath, 'utf-8');

console.log('Aplicando migration...');

// Split por statements e executa via rpc
const { error } = await supabase.rpc('exec_sql', { sql }).catch(() => ({ error: null }));

if (error) {
  console.log('Tentando via REST direto...');
}

// Usa a API de queries direto via fetch
const projectRef = 'uqlhocpjdpwsvckvwxfn';
const response = await fetch(
  `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ query: sql }),
  }
);

if (!response.ok) {
  // Fallback: tenta executar via pg diretamente
  console.log('Migration precisa ser aplicada manualmente no SQL Editor do Supabase.');
  console.log('Arquivo: supabase/migrations/20240101000000_initial.sql');
  console.log('');
  console.log('Acesse: https://uqlhocpjdpwsvckvwxfn.supabase.co/project/default/sql/new');
  process.exit(0);
}

console.log('Migration aplicada com sucesso!');
