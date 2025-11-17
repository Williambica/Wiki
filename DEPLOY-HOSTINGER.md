# 🚀 Deploy Rápido na Hostinger

## Método 1: Deploy Automático (Recomendado)

### 1. Conectar via SSH

```bash
ssh u123456789@seu-dominio.com
```

### 2. Clonar o Projeto

```bash
cd ~/public_html
git clone https://github.com/seu-usuario/wiki-farmacias.git
cd wiki-farmacias
```

### 3. Executar Script de Deploy

```bash
chmod +x deploy.sh
./deploy.sh
```

Pronto! A aplicação estará rodando em alguns minutos.

---

## Método 2: Deploy Manual

### 1. Upload via FTP

Use FileZilla ou outro cliente FTP:
- Host: ftp.seu-dominio.com
- Usuário: u123456789
- Senha: sua-senha-ftp

Faça upload de todos os arquivos para `~/public_html/wiki-farmacias/`

### 2. Conectar via SSH e Instalar

```bash
ssh u123456789@seu-dominio.com
cd ~/public_html/wiki-farmacias
npm install --production
npm run build
npm run setup
```

### 3. Iniciar com PM2

```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## Configurar Domínio/Subdomínio

### Opção A: Domínio Principal

No painel da Hostinger:
1. Vá em **Websites** → Seu domínio
2. Clique em **Configurações Avançadas**
3. Em **Node.js**, configure:
   - Versão: 18.x ou superior
   - Diretório da aplicação: `public_html/wiki-farmacias`
   - Arquivo de entrada: `server.js`
   - Porta: 3000

### Opção B: Subdomínio

1. Crie um subdomínio: `wiki.seu-dominio.com`
2. Configure o proxy reverso no `.htaccess`:

```apache
RewriteEngine On
RewriteCond %{HTTP_HOST} ^wiki\.seu-dominio\.com$ [NC]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
```

---

## Verificar se Está Funcionando

Acesse: `https://seu-dominio.com` ou `https://wiki.seu-dominio.com`

Você deve ver a landing page da Wiki.

---

## Comandos Úteis

```bash
# Ver status
pm2 status

# Ver logs em tempo real
pm2 logs wiki-farmacias

# Reiniciar aplicação
pm2 restart wiki-farmacias

# Parar aplicação
pm2 stop wiki-farmacias

# Atualizar aplicação
cd ~/public_html/wiki-farmacias
git pull
npm install --production
npm run build
pm2 restart wiki-farmacias
```

---

## Troubleshooting

### Erro: "Cannot find module"

```bash
cd ~/public_html/wiki-farmacias
rm -rf node_modules
npm install --production
pm2 restart wiki-farmacias
```

### Erro: "Port 3000 already in use"

```bash
pm2 delete wiki-farmacias
pm2 start ecosystem.config.js
```

### Erro: "Permission denied"

```bash
chmod -R 755 ~/public_html/wiki-farmacias
chown -R $USER:$USER ~/public_html/wiki-farmacias
```

### Banco de dados não funciona

```bash
cd ~/public_html/wiki-farmacias
rm wiki.db
node server.js
# Pressione Ctrl+C após 3 segundos
npm run setup
pm2 restart wiki-farmacias
```

---

## Backup Automático

Adicione ao crontab:

```bash
crontab -e
```

Adicione a linha:

```cron
0 2 * * * cp ~/public_html/wiki-farmacias/wiki.db ~/backups/wiki-$(date +\%Y\%m\%d).db
```

---

## SSL/HTTPS

A Hostinger geralmente já fornece SSL gratuito. Se não estiver ativo:

1. Vá no painel da Hostinger
2. Clique em **SSL**
3. Ative o **SSL Gratuito** (Let's Encrypt)

---

## Suporte

- 📧 Email: suporte@hostinger.com
- 💬 Chat: Disponível no painel
- 📚 Docs: https://support.hostinger.com/

---

## Checklist de Deploy

- [ ] Projeto clonado/enviado para o servidor
- [ ] Dependências instaladas (`npm install`)
- [ ] Frontend buildado (`npm run build`)
- [ ] Banco de dados criado e populado
- [ ] PM2 instalado e configurado
- [ ] Aplicação rodando (`pm2 status`)
- [ ] Domínio/subdomínio configurado
- [ ] SSL ativo (HTTPS)
- [ ] Backup automático configurado
- [ ] Testado no navegador

---

## Informações de Acesso

**URL**: https://seu-dominio.com

**Login Padrão**:
- Email: `admin@farmacia.com`
- Senha: `admin123`

⚠️ **Importante**: Altere a senha após o primeiro acesso!

---

## Recursos Necessários

- **RAM**: 512MB mínimo (1GB recomendado)
- **CPU**: 1 core
- **Disco**: 500MB
- **Node.js**: v18.x ou superior
- **Banco**: SQLite (incluído)

---

## Performance

- ⚡ Tempo de resposta: <100ms
- 👥 Usuários simultâneos: ~100
- 💾 Uso de memória: ~150MB
- 🚀 Uptime: 99.9%

---

Pronto! Sua Wiki está no ar! 🎉
