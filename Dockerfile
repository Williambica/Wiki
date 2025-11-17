# Stage 1: Build do Frontend
FROM node:18-alpine AS builder

# Instalar dependências de build
RUN apk add --no-cache python3 make g++ git

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar TODAS as dependências (incluindo devDependencies)
RUN npm install --legacy-peer-deps

# Copiar código fonte
COPY . .

# Build do frontend Vite
RUN npm run build

# Stage 2: Produção
FROM node:18-alpine

# Instalar dependências runtime
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm ci --only=production --legacy-peer-deps

# Copiar servidor
COPY server.js ./

# Copiar build do frontend do stage anterior
COPY --from=builder /app/dist ./dist

# Copiar arquivos públicos
COPY --from=builder /app/public ./public

# Criar diretório para dados
RUN mkdir -p /app/data

# Variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000

# Expor porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/categorias', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Iniciar servidor
CMD ["node", "server.js"]
