FROM node:18-alpine

# Instalar dependências necessárias
RUN apk add --no-cache python3 make g++ git

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm install --legacy-peer-deps

# Copiar código fonte
COPY . .

# Build do frontend
RUN npm run build

# Criar diretório para dados
RUN mkdir -p /app/data

# Variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000

# Expor porta
EXPOSE 3000

# Iniciar servidor
CMD ["node", "server.js"]
