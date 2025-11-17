# ⚡ Quick Start - Deploy em 5 Minutos

## 🎯 Para Hostinger

### 1️⃣ Conecte via SSH
```bash
ssh u123456789@seu-dominio.com
```

### 2️⃣ Clone e Deploy
```bash
cd ~/public_html
git clone https://github.com/seu-usuario/wiki-farmacias.git
cd wiki-farmacias
chmod +x deploy.sh
./deploy.sh
```

### 3️⃣ Configure o Domínio

No painel da Hostinger:
- **Websites** → Seu domínio → **Node.js**
- Versão: 18.x
- Diretório: `public_html/wiki-farmacias`
- Arquivo: `server.js`
- Porta: `3000`

### 4️⃣ Acesse!

https://seu-dominio.com

**Login**: admin@farmacia.com  
**Senha**: admin123

---

## 🖥️ Para Servidor Local/VPS

### 1️⃣ Clone
```bash
git clone https://github.com/seu-usuario/wiki-farmacias.git
cd wiki-farmacias
```

### 2️⃣ Instale e Configure
```bash
npm install
npm run build
npm run setup
```

### 3️⃣ Inicie
```bash
# Com PM2 (recomendado)
npm install -g pm2
npm run pm2:start

# Ou direto
npm start
```

### 4️⃣ Acesse
http://localhost:3000

---

## 🐳 Com Docker (Opcional)

```bash
# Build
docker build -t wiki-farmacias .

# Run
docker run -d -p 3000:3000 --name wiki wiki-farmacias
```

---

## ✅ Checklist Pós-Deploy

- [ ] Site acessível via navegador
- [ ] Landing page carrega
- [ ] Artigos aparecem
- [ ] Busca funciona
- [ ] Queries SQL disponíveis
- [ ] SSL/HTTPS ativo
- [ ] Alterar senha padrão

---

## 🆘 Problemas?

### Site não carrega
```bash
pm2 logs wiki-farmacias
```

### Reiniciar
```bash
pm2 restart wiki-farmacias
```

### Limpar e reinstalar
```bash
rm -rf node_modules dist wiki.db
npm install
npm run build
npm run setup
pm2 restart wiki-farmacias
```

---

## 📚 Documentação Completa

- [DEPLOY.md](DEPLOY.md) - Guia completo de deploy
- [DEPLOY-HOSTINGER.md](DEPLOY-HOSTINGER.md) - Específico para Hostinger
- [README.md](README.md) - Documentação do projeto

---

Pronto! Sua Wiki está no ar! 🎉
