FROM node:18

WORKDIR /app

# Copiar tudo
COPY . .

# Instalar dependências (ignora erros)
RUN npm install --legacy-peer-deps || npm install --force || true

# Build (ignora erros)
RUN npm run build || true

# Expor porta
EXPOSE 3000

# Variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000

# Iniciar servidor
CMD ["node", "server.js"]
