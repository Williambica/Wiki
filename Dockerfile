FROM node:20-alpine

# Instalar dependências necessárias
RUN apk add --no-cache python3 make g++ git

WORKDIR /app

# Copiar tudo primeiro
COPY . .

# Instalar dependências
RUN npm install --legacy-peer-deps

# Build do frontend
RUN npm run build

# Verificar se o build foi criado
RUN ls -la dist/ || echo "ERRO: dist/ não foi criado!"

# Criar diretório para dados
RUN mkdir -p /app/data

# Variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000

# Expor porta
EXPOSE 3000

# Iniciar servidor
CMD ["node", "server.js"]
