#!/bin/bash

# ============================================================
# CHASED - Script de Setup Completo
# Execute: bash setup.sh
# ============================================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo "🚀 CHASED - Setup Completo"
echo "================================"
echo ""

# Check node
if ! command -v node &> /dev/null; then
  echo -e "${RED}❌ Node.js não encontrado. Instale em: https://nodejs.org${NC}"
  exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo -e "${RED}❌ Node.js 18+ necessário. Versão atual: $(node -v)${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v)${NC}"

# Install dependencies
echo ""
echo "📦 Instalando dependências..."
npm install
echo -e "${GREEN}✅ Dependências instaladas${NC}"

# Create seed users
echo ""
echo "👤 Criando usuários demo no Supabase..."
cd supabase
node seed-users.mjs
cd ..
echo -e "${GREEN}✅ Usuários criados${NC}"

echo ""
echo "================================"
echo -e "${GREEN}🎉 Setup concluído!${NC}"
echo ""
echo "Para rodar o projeto:"
echo -e "  ${YELLOW}cd apps/web && npm run dev${NC}"
echo ""
echo "Acesse: http://localhost:3000"
echo ""
echo "Contas demo:"
echo "  👔 Admin:  admin@chased.com  / chased123  → /admin"
echo "  🏪 Cliente: farmacia@demo.com / chased123  → /"
echo ""
