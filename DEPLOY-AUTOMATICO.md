# 🚀 Deploy Automático - Wiki Farmácias Associadas

## ⚡ Início Rápido (3 Cliques)

### 1️⃣ Execute o Setup
```
COMECE-AQUI.bat
```

Escolha opção **1** (Setup Completo)

### 2️⃣ Crie o Repositório no GitHub
- Acesse: https://github.com/new
- Nome: `wiki-farmacias-associadas`
- Visibilidade: **Privado**
- Clique em **Create repository**

### 3️⃣ Execute Novamente
```
COMECE-AQUI.bat
```

Escolha opção **3** (Push para GitHub)  
Depois escolha opção **4** (Deploy Hostinger)

---

## 📋 O que cada script faz?

### `COMECE-AQUI.bat` 
Menu interativo com todas as opções

### `git-setup.bat`
- Inicializa repositório Git
- Adiciona todos os arquivos
- Cria commit inicial
- Configura branch main

### `git-push.bat`
- Conecta ao GitHub
- Faz push do código
- Valida credenciais

### `deploy-hostinger.bat`
- Conecta ao servidor via SSH
- Clona o repositório
- Instala dependências
- Faz build
- Importa dados
- Inicia com PM2

### `deploy.bat` (Windows Local)
- Setup completo local
- Testa a aplicação
- Prepara para produção

### `deploy.sh` (Linux/Hostinger)
- Deploy automático no servidor
- Configuração PM2
- Auto-start

---

## 🔧 Pré-requisitos

### No seu computador:
- ✅ Git instalado
- ✅ Node.js 18+ instalado
- ✅ Conta no GitHub

### Na Hostinger:
- ✅ Plano com Node.js habilitado
- ✅ Acesso SSH configurado
- ✅ Domínio apontando para o servidor

---

## 📦 Estrutura de Arquivos

```
wiki-farmacias-associadas/
├── COMECE-AQUI.bat           ← COMECE POR AQUI!
├── git-setup.bat             ← Setup Git
├── git-push.bat              ← Push GitHub
├── deploy-hostinger.bat      ← Deploy Hostinger
├── deploy.bat                ← Deploy Windows
├── deploy.sh                 ← Deploy Linux
├── INSTRUCOES-GIT.md         ← Guia Git
├── DEPLOY-HOSTINGER.md       ← Guia Hostinger
├── QUICK-START.md            ← Início rápido
└── README.md                 ← Documentação
```

---

## 🎯 Fluxo Completo

```
1. COMECE-AQUI.bat (Opção 1)
   ↓
2. Criar repo no GitHub
   ↓
3. COMECE-AQUI.bat (Opção 3)
   ↓
4. COMECE-AQUI.bat (Opção 4)
   ↓
5. Acesse seu site!
```

---

## ✅ Checklist

### Antes de começar:
- [ ] Git instalado
- [ ] Node.js instalado
- [ ] Conta GitHub criada
- [ ] Acesso SSH Hostinger configurado

### Durante o processo:
- [ ] Setup completo executado
- [ ] Repositório GitHub criado
- [ ] Push para GitHub concluído
- [ ] Deploy na Hostinger executado

### Após o deploy:
- [ ] Site acessível no navegador
- [ ] Login funciona
- [ ] Artigos carregam
- [ ] Busca funciona
- [ ] Queries SQL disponíveis
- [ ] Senha padrão alterada

---

## 🆘 Problemas Comuns

### "Git não é reconhecido"
**Solução**: Instale o Git em https://git-scm.com/download/win

### "Node não é reconhecido"
**Solução**: Instale o Node.js em https://nodejs.org

### "Permission denied (publickey)"
**Solução**: Configure SSH key no GitHub
```bash
ssh-keygen -t ed25519 -C "seu@email.com"
```

### "Repository not found"
**Solução**: Verifique se criou o repositório no GitHub

### "Port 3000 already in use"
**Solução**: 
```bash
pm2 delete wiki-farmacias
pm2 start ecosystem.config.js
```

---

## 📞 Suporte

### Documentação:
- Git: https://git-scm.com/doc
- GitHub: https://docs.github.com
- Node.js: https://nodejs.org/docs
- Hostinger: https://support.hostinger.com

### Contato:
- Email: suporte@farmacia.com
- WhatsApp: (XX) XXXXX-XXXX

---

## 🎉 Pronto!

Após seguir todos os passos, sua Wiki estará:

✅ Versionada no GitHub  
✅ Deployada na Hostinger  
✅ Acessível via HTTPS  
✅ Rodando com PM2  
✅ Com backup automático  

**URL**: https://seu-dominio.com  
**Login**: admin@farmacia.com  
**Senha**: admin123  

⚠️ **Lembre-se de alterar a senha!**

---

**Desenvolvido com ❤️ para Farmácias Associadas**
