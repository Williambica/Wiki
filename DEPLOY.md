# 🚀 Deploy na Hostinger - Wiki Farmácias Associadas

## Pré-requisitos

- Conta na Hostinger com Node.js habilitado
- Acesso SSH ao servidor
- Git instalado no servidor

---

## Passo 1: Preparar o Projeto Localmente

### 1.1 Build do Frontend

```bash
npm run build
```

Isso criará a pasta `dist/` com os arquivos otimizados.

### 1.2 Testar Localmente

```bash
npm start
```

Acesse http://localhost:3000 e verifique se tudo funciona.

---

## Passo 2: Configurar o Servidor Hostinger

### 2.1 Conectar via SSH

```bash
ssh usuario@seu-dominio.com
```

### 2.2 Instalar Node.js (se necessário)

A Hostinger geralmente já tem Node.js instalado. Verifique:

```bash
node --version
npm --version
```

### 2.3 Criar Diretório do Projeto

```bash
mkdir -p ~/wiki-farmacias
cd ~/wiki-farmacias
```

---

## Passo 3: Upload dos Arquivos

### Opção A: Via Git (Recomendado)

```bash
# No servidor
git clone https://github.com/seu-usuario/wiki-farmacias.git .
npm install --production
npm run build
```

### Opção B: Via FTP/SFTP

1. Conecte via FileZilla ou outro cliente FTP
2. Faça upload de todos os arquivos exceto:
   - `node_modules/`
   - `.git/`
   - `wiki.db` (será criado no servidor)

3. No servidor, instale as dependências:

```bash
npm install --production
```

---

## Passo 4: Configurar Variáveis de Ambiente

Crie o arquivo `.env` no servidor:

```bash
nano .env
```

Adicione:

```env
NODE_ENV=production
PORT=3000
```

---

## Passo 5: Inicializar o Banco de Dados

```bash
# Importar dados iniciais
node importar-faq-final.js
node importar-queries-sql.js
```

---

## Passo 6: Configurar PM2 (Process Manager)

### 6.1 Instalar PM2 Globalmente

```bash
npm install -g pm2
```

### 6.2 Iniciar a Aplicação

```bash
pm2 start ecosystem.config.js
```

### 6.3 Configurar Auto-Start

```bash
pm2 startup
pm2 save
```

### 6.4 Comandos Úteis PM2

```bash
# Ver status
pm2 status

# Ver logs
pm2 logs wiki-farmacias

# Reiniciar
pm2 restart wiki-farmacias

# Parar
pm2 stop wiki-farmacias

# Remover
pm2 delete wiki-farmacias
```

---

## Passo 7: Configurar Proxy Reverso (Apache/Nginx)

### Para Apache (.htaccess)

Já está configurado no arquivo `.htaccess` incluído.

### Para Nginx

Adicione ao seu arquivo de configuração:

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

## Passo 8: Configurar SSL (HTTPS)

### Usando Let's Encrypt (Gratuito)

```bash
# Instalar Certbot
sudo apt-get install certbot python3-certbot-apache

# Obter certificado
sudo certbot --apache -d seu-dominio.com
```

---

## Passo 9: Testar o Deploy

Acesse: https://seu-dominio.com

Verifique:
- ✅ Landing page carrega
- ✅ Artigos aparecem
- ✅ Busca funciona
- ✅ Modal abre corretamente
- ✅ Queries SQL estão disponíveis

---

## Manutenção

### Atualizar a Aplicação

```bash
cd ~/wiki-farmacias
git pull origin main
npm install --production
npm run build
pm2 restart wiki-farmacias
```

### Backup do Banco de Dados

```bash
# Criar backup
cp wiki.db wiki.db.backup-$(date +%Y%m%d)

# Agendar backup diário (crontab)
crontab -e

# Adicionar linha:
0 2 * * * cp ~/wiki-farmacias/wiki.db ~/backups/wiki.db.backup-$(date +\%Y\%m\%d)
```

### Ver Logs

```bash
# Logs do PM2
pm2 logs wiki-farmacias

# Logs do sistema
tail -f ~/wiki-farmacias/logs/combined.log
```

---

## Troubleshooting

### Problema: Porta 3000 já em uso

```bash
# Encontrar processo
lsof -i :3000

# Matar processo
kill -9 <PID>
```

### Problema: Permissões

```bash
# Ajustar permissões
chmod -R 755 ~/wiki-farmacias
chown -R $USER:$USER ~/wiki-farmacias
```

### Problema: Banco de dados não criado

```bash
# Verificar se o arquivo existe
ls -la wiki.db

# Recriar banco
rm wiki.db
node server.js
# Ctrl+C após criar as tabelas
node importar-faq-final.js
node importar-queries-sql.js
```

---

## Estrutura de Arquivos no Servidor

```
~/wiki-farmacias/
├── dist/                 # Frontend buildado
├── node_modules/         # Dependências
├── public/              # Arquivos públicos
├── src/                 # Código fonte React
├── PastaFaqAlex/        # Documentos originais
├── server.js            # Servidor Express
├── wiki.db              # Banco SQLite
├── package.json
├── .htaccess
├── ecosystem.config.js
└── .env
```

---

## Checklist Final

- [ ] Node.js instalado
- [ ] Dependências instaladas (`npm install`)
- [ ] Frontend buildado (`npm run build`)
- [ ] Banco de dados inicializado
- [ ] PM2 configurado e rodando
- [ ] Proxy reverso configurado
- [ ] SSL/HTTPS ativo
- [ ] Domínio apontando para o servidor
- [ ] Backup automático configurado
- [ ] Logs funcionando

---

## Suporte

Para problemas específicos da Hostinger, consulte:
- https://support.hostinger.com/
- Chat ao vivo no painel da Hostinger

---

## Informações Importantes

🔐 **Usuário Padrão**:
- Email: admin@farmacia.com
- Senha: admin123

⚠️ **Importante**: Altere a senha padrão após o primeiro acesso!

📊 **Recursos**:
- Memória: ~100-200MB
- CPU: Baixo uso
- Disco: ~50MB + documentos

🚀 **Performance**:
- Tempo de resposta: <100ms
- Suporta ~100 usuários simultâneos
- Cache de assets habilitado
