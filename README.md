# 📚 Wiki Farmácias Associadas

Sistema de documentação e base de conhecimento para suporte técnico interno.

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![React](https://img.shields.io/badge/React-19.2-blue)
![SQLite](https://img.shields.io/badge/SQLite-3-lightgrey)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🚀 Funcionalidades

- ✅ **Landing Page Moderna** com animações e design profissional
- 📄 **Gestão de Artigos** com categorias e tags
- 🔍 **Busca Avançada** em tempo real
- ⭐ **Sistema de Favoritos** com localStorage
- 💾 **Queries SQL** organizadas e prontas para uso
- 📊 **Estatísticas** de uso e visualizações
- 🎨 **Design Responsivo** para desktop e mobile
- 🔐 **Sistema de Autenticação** (preparado para expansão)

## 📦 Tecnologias

### Backend
- Node.js + Express
- SQLite (better-sqlite3)
- bcrypt para senhas

### Frontend
- React 19
- Vite
- CSS moderno com gradientes

## 🛠️ Instalação Local

### Pré-requisitos
- Node.js 18.x ou superior
- npm ou yarn

### Passos

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/wiki-farmacias.git
cd wiki-farmacias
```

2. Instale as dependências:
```bash
npm install
```

3. Importe os dados iniciais:
```bash
npm run setup
```

4. Inicie o servidor de desenvolvimento:
```bash
# Terminal 1 - Backend
npm start

# Terminal 2 - Frontend
npm run dev
```

5. Acesse: http://localhost:5173

## 🚀 Deploy na Hostinger

### Deploy Automático

```bash
ssh usuario@seu-dominio.com
cd ~/public_html
git clone https://github.com/seu-usuario/wiki-farmacias.git
cd wiki-farmacias
chmod +x deploy.sh
./deploy.sh
```

### Deploy Manual

Veja o guia completo em [DEPLOY-HOSTINGER.md](DEPLOY-HOSTINGER.md)

## 📁 Estrutura do Projeto

```
wiki-farmacias/
├── src/                    # Frontend React
│   ├── components/         # Componentes React
│   ├── hooks/             # Custom hooks
│   └── App.jsx            # Componente principal
├── public/                # Arquivos públicos
├── PastaFaqAlex/          # Documentos originais
├── server.js              # Servidor Express
├── wiki.db                # Banco SQLite
├── importar-*.js          # Scripts de importação
├── ecosystem.config.js    # Configuração PM2
└── deploy.sh              # Script de deploy
```

## 🎯 Scripts Disponíveis

```bash
npm start          # Inicia servidor backend
npm run dev        # Inicia servidor de desenvolvimento
npm run build      # Build de produção
npm run setup      # Importa dados iniciais
npm run prod       # Inicia em modo produção
npm run pm2:start  # Inicia com PM2
npm run pm2:logs   # Ver logs do PM2
```

## 📊 Categorias

1. 🛒 **E-commerce** - Integrações e pedidos online
2. 📋 **Fiscal** - Notas fiscais e documentos
3. 💻 **Sistema/ERP** - Configurações e processos
4. 🔗 **Integrações** - APIs e conexões externas
5. 💾 **Banco de Dados** - Queries e manutenção
6. 💾 **Queries SQL** - Comandos SQL úteis

## 🔐 Acesso Padrão

- **Email**: admin@farmacia.com
- **Senha**: admin123

⚠️ Altere a senha após o primeiro acesso!

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com o time de TI.

## 🎉 Agradecimentos

Desenvolvido com ❤️ para Farmácias Associadas

---

**Versão**: 1.0.0  
**Última atualização**: 2024
