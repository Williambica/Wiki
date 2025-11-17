FROM node:18-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código
COPY . .

# Build do frontend
RUN npm run build || echo "Build failed, continuing..."

# Expor porta
EXPOSE 3000

# Iniciar servidor
CMD ["node", "server.js"]
