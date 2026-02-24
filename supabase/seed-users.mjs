import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uqlhocpjdpwsvckvwxfn.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxbGhvY3BqZHB3c3Zja3Z3eGZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTgxMjM4MCwiZXhwIjoyMDg3Mzg4MzgwfQ.STk_jgIzkpr0TjcEyX6JSREzpnGKSHDLp8kqsW6fEJQ';

console.log('🔗 Conectando em:', SUPABASE_URL);

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function createUser(email, password, role, name, pharmacyData) {
  console.log(`\n👤 Criando usuário: ${email}`);

  // Check if user already exists
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error('  ❌ Erro ao listar usuários:', listError.message);
    return null;
  }

  let userId;
  const existingUser = users.find(u => u.email === email);

  if (existingUser) {
    console.log(`  ℹ️  Usuário já existe, usando ID: ${existingUser.id}`);
    userId = existingUser.id;
    // Update password
    await supabase.auth.admin.updateUserById(userId, { password });
  } else {
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });

    if (authError) {
      console.error(`  ❌ Erro auth: ${authError.message}`);
      // Common fix: the trigger failed because profiles table might not exist yet
      console.log('  💡 Dica: Execute a migration no Supabase SQL Editor primeiro!');
      return null;
    }
    userId = authData.user.id;
    console.log(`  ✅ Auth user criado: ${userId}`);
  }

  // Upsert profile manually (bypass trigger issues)
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({ id: userId, role, name, phone: null }, { onConflict: 'id' });

  if (profileError) {
    console.error(`  ❌ Erro ao criar profile: ${profileError.message}`);
    console.log('  💡 Verifique se a migration foi executada no Supabase!');
    return null;
  }
  console.log(`  ✅ Profile criado (role: ${role})`);

  // Create pharmacy for client
  if (role === 'client' && pharmacyData) {
    const { data: existingPharmacy } = await supabase
      .from('pharmacies')
      .select('id')
      .eq('owner_user_id', userId)
      .maybeSingle();

    if (!existingPharmacy) {
      const { error: pharmacyError } = await supabase.from('pharmacies').insert({
        owner_user_id: userId,
        pharmacy_name: pharmacyData.pharmacy_name,
        responsible_name: pharmacyData.responsible_name,
        cnpj: pharmacyData.cnpj ?? null,
        whatsapp: pharmacyData.whatsapp,
        address_line1: pharmacyData.address_line1,
        city: pharmacyData.city,
        state: pharmacyData.state,
        zip: pharmacyData.zip,
      });
      if (pharmacyError) {
        console.error(`  ❌ Erro farmácia: ${pharmacyError.message}`);
      } else {
        console.log(`  ✅ Farmácia: ${pharmacyData.pharmacy_name}`);
      }
    } else {
      console.log(`  ℹ️  Farmácia já existe`);
    }
  }

  // Create rep settings for admin
  if (role === 'rep_admin') {
    const { data: existingSettings } = await supabase
      .from('rep_settings')
      .select('id')
      .maybeSingle();

    if (!existingSettings) {
      const { error: settingsError } = await supabase.from('rep_settings').insert({
        owner_user_id: userId,
        display_name: 'Representante Demo',
        whatsapp_number_e164: '+5511999999999',
        whatsapp_number_digits: '5511999999999',
        default_footer_message: 'Obrigado por seu pedido!',
      });
      if (settingsError) {
        console.error(`  ❌ Erro rep_settings: ${settingsError.message}`);
      } else {
        console.log(`  ✅ Rep Settings criado`);
        console.log(`  ⚠️  Atualize o WhatsApp real em /admin/settings após logar!`);
      }
    } else {
      console.log(`  ℹ️  Rep settings já existe`);
    }
  }

  return userId;
}

async function main() {
  console.log('\n🌱 CHASED - Criando usuários demo...');
  console.log('==========================================\n');

  const adminId = await createUser(
    'admin@chased.com',
    'chased123',
    'rep_admin',
    'Admin Representante',
    null
  );

  const clientId = await createUser(
    'farmacia@demo.com',
    'chased123',
    'client',
    'João Silva',
    {
      pharmacy_name: 'Farmácia Central Demo',
      responsible_name: 'João Silva',
      cnpj: '12.345.678/0001-99',
      whatsapp: '5511987654321',
      address_line1: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zip: '01234-567',
    }
  );

  console.log('\n==========================================');
  if (adminId && clientId) {
    console.log('✅ Seed concluído com sucesso!\n');
    console.log('Contas criadas:');
    console.log('  👔 Admin:   admin@chased.com   / chased123  →  /admin');
    console.log('  🏪 Cliente: farmacia@demo.com  / chased123  →  /');
    console.log('\n⚠️  Após logar como admin, vá em /admin/settings');
    console.log('   e coloque o número WhatsApp real do representante!');
  } else {
    console.log('⚠️  Alguns usuários não foram criados.');
    console.log('   Verifique se a MIGRATION foi executada no Supabase SQL Editor.');
    console.log('   Arquivo: supabase/migrations/20240101000000_initial.sql');
  }
}

main().catch(err => {
  console.error('\n❌ Erro fatal:', err.message);
  process.exit(1);
});
