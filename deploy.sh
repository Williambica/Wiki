#!/bin/bash

echo "🚀 Iniciando deploy da Wiki Farmácias Associadas..."

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: package.json não encontrado!${NC}"
    echo "Execute este script no diretório raiz do projeto."
    exit 1
fi

# 1. Instalar dependências
echo -e "\n${YELLOW}📦 Instalando dependências...${NC}"
npm install --production

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao instalar dependências!${NC}"
    exit 1
fi

# 2. Build do frontend
echo -e "\n${YELLOW}🔨 Buildando frontend...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao buildar frontend!${NC}"
    exit 1
fi

# 3. Verificar se o banco existe
if [ ! -f "wiki.db" ]; then
    echo -e "\n${YELLOW}💾 Banco de dados não encontrado. Criando...${NC}"
    
    # Iniciar servidor temporariamente para criar tabelas
    timeout 5 node server.js &
    sleep 3
    
    # Importar dados
    echo -e "${YELLOW}📊 Importando dados...${NC}"
    node importar-faq-final.js
    node importar-queries-sql.js
    
    echo -e "${GREEN}✅ Banco de dados criado e populado!${NC}"
else
    echo -e "${GREEN}✅ Banco de dados já existe.${NC}"
fi

# 4. Criar diretório de logs
mkdir -p logs

# 5. Verificar PM2
if ! command -v pm2 &> /dev/null; then
    echo -e "\n${YELLOW}⚠️  PM2 não encontrado. Instalando globalmente...${NC}"
    npm install -g pm2
fi

# 6. Parar processo anterior (se existir)
echo -e "\n${YELLOW}🛑 Parando processo anterior...${NC}"
pm2 stop wiki-farmacias 2>/dev/null || true
pm2 delete wiki-farmacias 2>/dev/null || true

# 7. Iniciar aplicação
echo -e "\n${YELLOW}🚀 Iniciando aplicação...${NC}"
pm2 start ecosystem.config.js

# 8. Salvar configuração PM2
pm2 save

# 9. Configurar auto-start (apenas primeira vez)
if [ ! -f ~/.pm2/startup.sh ]; then
    echo -e "\n${YELLOW}⚙️  Configurando auto-start...${NC}"
    pm2 startup
fi

# 10. Verificar status
echo -e "\n${GREEN}✅ Deploy concluído!${NC}"
echo -e "\n${YELLOW}📊 Status da aplicação:${NC}"
pm2 status

echo -e "\n${GREEN}🎉 Wiki Farmácias Associadas está rodando!${NC}"
echo -e "${YELLOW}📝 Ver logs: pm2 logs wiki-farmacias${NC}"
echo -e "${YELLOW}🔄 Reiniciar: pm2 restart wiki-farmacias${NC}"
echo -e "${YELLOW}🛑 Parar: pm2 stop wiki-farmacias${NC}"
