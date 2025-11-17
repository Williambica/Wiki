# 📝 Instruções Git - Deploy Automatizado

## 🚀 Processo Completo em 3 Passos

### Passo 1: Setup Git Local

Execute:
```bash
git-setup.bat
```

Isso vai:
- ✅ Inicializar repositório Git
- ✅ Adicionar todos os arquivos
- ✅ Criar commit inicial
- ✅ Configurar branch main

---

### Passo 2: Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Preencha:
   - **Nome**: `wiki-farmacias-associadas`
   - **Visibilidade**: Privado (recomendado)
   - **NÃO** marque "Initialize with README"
3. Clique em **Create repository**

---

### Passo 3: Push para GitHub

Execute:
```bash
git-push.bat
```

Digite seu usuário do GitHub quando solicitado.

---

### Passo 4: Deploy na Hostinger

Execute:
```bash
deploy-hostinger.bat
```

Forneça:
- Usuário SSH (ex: u123456789)
- Domínio (ex: seudominio.com)
- Usuário GitHub

O script vai:
1. Conectar ao servidor via SSH
2. Clonar o repositório
3. Instalar dependências
4. Fazer build
5. Importar dados
6. Iniciar com PM2

---

## 🔧 Comandos Manuais (Alternativa)

Se preferir fazer manualmente:

### 1. Inicializar Git
```bash
git init
git add .
git commit -m "feat: Wiki Farmacias Associadas completa"
git branch -M main
```

### 2. Conectar ao GitHub
```bash
git remote add origin https://github.com/SEU-USUARIO/wiki-farmacias-associadas.git
git push -u origin main
```

### 3. Deploy SSH Manual
```bash
ssh usuario@seudominio.com
cd ~/public_html
git clone https://github.com/SEU-USUARIO/wiki-farmacias-associadas.git
cd wiki-farmacias-associadas
chmod +x deploy.sh
./deploy.sh
```

---

## 🔐 Configurar Credenciais Git

Primeira vez usando Git? Configure:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

---

## 📦 Estrutura de Commits

Para futuras atualizações:

```bash
# Adicionar mudanças
git add .

# Commit com mensagem descritiva
git commit -m "feat: adiciona nova funcionalidade"

# Push para GitHub
git push origin main

# Deploy na Hostinger
ssh usuario@dominio.com
cd ~/public_html/wiki-farmacias-associadas
git pull
npm install
npm run build
pm2 restart wiki-farmacias
```

---

## 🆘 Troubleshooting

### Erro: "Permission denied (publickey)"

Configure SSH key:
```bash
ssh-keygen -t ed25519 -C "seu@email.com"
cat ~/.ssh/id_ed25519.pub
```

Adicione a chave em: https://github.com/settings/keys

### Erro: "Repository not found"

Verifique:
1. Repositório foi criado no GitHub?
2. Nome está correto?
3. Você tem acesso ao repositório?

### Erro: "Failed to connect to github.com"

Verifique sua conexão com internet ou use HTTPS:
```bash
git remote set-url origin https://github.com/usuario/repo.git
```

---

## ✅ Checklist

- [ ] Git instalado
- [ ] Repositório criado no GitHub
- [ ] Commit inicial feito
- [ ] Push para GitHub concluído
- [ ] Acesso SSH à Hostinger configurado
- [ ] Deploy executado com sucesso
- [ ] Site acessível no navegador

---

## 📞 Suporte

Problemas? Verifique:
- Git: https://git-scm.com/doc
- GitHub: https://docs.github.com
- Hostinger: https://support.hostinger.com

---

**Pronto!** Seu projeto está versionado e deployado! 🎉
