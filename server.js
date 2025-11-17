const express = require('express');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos do build do Vite
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  console.log('✅ Servindo build de produção do Vite');
} else {
  // Fallback para desenvolvimento
  app.use(express.static('public'));
  console.log('⚠️  Servindo arquivos públicos (modo desenvolvimento)');
}

// Inicializar banco de dados
const dbPath = process.env.DB_PATH || path.join(__dirname, 'conhecimento.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
console.log(`📊 Banco de dados: ${dbPath}`);

// Criar tabelas
db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    area TEXT NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    cor TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS artigos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    conteudo TEXT NOT NULL,
    categoria_id INTEGER,
    tags TEXT,
    autor_id INTEGER,
    visualizacoes INTEGER DEFAULT 0,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    FOREIGN KEY (autor_id) REFERENCES usuarios(id)
  );

  CREATE TABLE IF NOT EXISTS scripts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    descricao TEXT,
    codigo TEXT NOT NULL,
    linguagem TEXT NOT NULL,
    categoria_id INTEGER,
    autor_id INTEGER,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    FOREIGN KEY (autor_id) REFERENCES usuarios(id)
  );
`);

// Inserir categorias padrão
const insertCategoria = db.prepare('INSERT OR IGNORE INTO categorias (id, nome, cor) VALUES (?, ?, ?)');
insertCategoria.run(1, 'E-commerce', '#3b82f6');
insertCategoria.run(2, 'Fiscal', '#10b981');
insertCategoria.run(3, 'Sistema/ERP', '#f59e0b');
insertCategoria.run(4, 'Integrações', '#8b5cf6');
insertCategoria.run(5, 'Banco de Dados', '#ef4444');
insertCategoria.run(6, 'Queries SQL', '#ec4899');

// Criar usuário admin padrão (senha: admin123)
const checkAdmin = db.prepare('SELECT * FROM usuarios WHERE email = ?').get('admin@farmacia.com');
if (!checkAdmin) {
  const senhaHash = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO usuarios (nome, email, senha, area) VALUES (?, ?, ?, ?)').run(
    'Administrador',
    'admin@farmacia.com',
    senhaHash,
    'Suporte'
  );
}

// ROTAS - Categorias
app.get('/api/categorias', (req, res) => {
  try {
    const categorias = db.prepare('SELECT * FROM categorias').all();
    res.json(categorias);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ erro: 'Erro ao buscar categorias' });
  }
});

// ROTAS - Artigos (COM PAGINAÇÃO)
app.get('/api/artigos', (req, res) => {
  try {
    const { busca, categoria, page = 1, limit = 50, orderBy = 'recentes' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    let query = `
      SELECT a.*, c.nome as categoria_nome, c.cor as categoria_cor, u.nome as autor_nome
      FROM artigos a
      LEFT JOIN categorias c ON a.categoria_id = c.id
      LEFT JOIN usuarios u ON a.autor_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (busca) {
      query += ` AND (a.titulo LIKE ? OR a.conteudo LIKE ? OR a.tags LIKE ?)`;
      params.push(`%${busca}%`, `%${busca}%`, `%${busca}%`);
    }

    if (categoria) {
      query += ` AND a.categoria_id = ?`;
      params.push(categoria);
    }

    // Ordenação
    switch (orderBy) {
      case 'populares':
        query += ` ORDER BY a.visualizacoes DESC`;
        break;
      case 'alfabetica':
        query += ` ORDER BY a.titulo ASC`;
        break;
      case 'antigas':
        query += ` ORDER BY a.criado_em ASC`;
        break;
      default: // recentes
        query += ` ORDER BY a.criado_em DESC`;
    }

    // Paginação
    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const artigos = db.prepare(query).all(...params);
    
    // Total de artigos (para paginação)
    let countQuery = `SELECT COUNT(*) as total FROM artigos WHERE 1=1`;
    const countParams = [];
    
    if (busca) {
      countQuery += ` AND (titulo LIKE ? OR conteudo LIKE ? OR tags LIKE ?)`;
      countParams.push(`%${busca}%`, `%${busca}%`, `%${busca}%`);
    }
    
    if (categoria) {
      countQuery += ` AND categoria_id = ?`;
      countParams.push(categoria);
    }
    
    const { total } = db.prepare(countQuery).get(...countParams);
    
    res.json({
      artigos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erro ao buscar artigos:', error);
    res.status(500).json({ erro: 'Erro ao buscar artigos' });
  }
});

app.get('/api/artigos/:id', (req, res) => {
  try {
    const artigo = db.prepare(`
      SELECT a.*, c.nome as categoria_nome, c.cor as categoria_cor, u.nome as autor_nome
      FROM artigos a
      LEFT JOIN categorias c ON a.categoria_id = c.id
      LEFT JOIN usuarios u ON a.autor_id = u.id
      WHERE a.id = ?
    `).get(req.params.id);

    if (artigo) {
      // Incrementar visualizações
      db.prepare('UPDATE artigos SET visualizacoes = visualizacoes + 1 WHERE id = ?').run(req.params.id);
      artigo.visualizacoes += 1;
      res.json(artigo);
    } else {
      res.status(404).json({ erro: 'Artigo não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao buscar artigo:', error);
    res.status(500).json({ erro: 'Erro ao buscar artigo' });
  }
});

app.post('/api/artigos', (req, res) => {
  try {
    const { titulo, conteudo, categoria_id, tags } = req.body;
    const autor_id = 1; // Por enquanto usa admin

    if (!titulo || !conteudo) {
      return res.status(400).json({ erro: 'Título e conteúdo são obrigatórios' });
    }

    const result = db.prepare(`
      INSERT INTO artigos (titulo, conteudo, categoria_id, tags, autor_id)
      VALUES (?, ?, ?, ?, ?)
    `).run(titulo, conteudo, categoria_id, tags, autor_id);

    res.json({ id: result.lastInsertRowid, mensagem: 'Artigo criado com sucesso!' });
  } catch (error) {
    console.error('Erro ao criar artigo:', error);
    res.status(500).json({ erro: 'Erro ao criar artigo' });
  }
});

app.put('/api/artigos/:id', (req, res) => {
  try {
    const { titulo, conteudo, categoria_id, tags } = req.body;
    
    db.prepare(`
      UPDATE artigos 
      SET titulo = ?, conteudo = ?, categoria_id = ?, tags = ?, atualizado_em = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(titulo, conteudo, categoria_id, tags, req.params.id);

    res.json({ mensagem: 'Artigo atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar artigo:', error);
    res.status(500).json({ erro: 'Erro ao atualizar artigo' });
  }
});

app.delete('/api/artigos/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM artigos WHERE id = ?').run(req.params.id);
    res.json({ mensagem: 'Artigo excluído com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir artigo:', error);
    res.status(500).json({ erro: 'Erro ao excluir artigo' });
  }
});

// ROTAS - Scripts
app.get('/api/scripts', (req, res) => {
  try {
    const scripts = db.prepare(`
      SELECT s.*, c.nome as categoria_nome, c.cor as categoria_cor, u.nome as autor_nome
      FROM scripts s
      LEFT JOIN categorias c ON s.categoria_id = c.id
      LEFT JOIN usuarios u ON s.autor_id = u.id
      ORDER BY s.criado_em DESC
    `).all();
    res.json(scripts);
  } catch (error) {
    console.error('Erro ao buscar scripts:', error);
    res.status(500).json({ erro: 'Erro ao buscar scripts' });
  }
});

app.post('/api/scripts', (req, res) => {
  try {
    const { titulo, descricao, codigo, linguagem, categoria_id } = req.body;
    const autor_id = 1;

    if (!titulo || !codigo || !linguagem) {
      return res.status(400).json({ erro: 'Título, código e linguagem são obrigatórios' });
    }

    const result = db.prepare(`
      INSERT INTO scripts (titulo, descricao, codigo, linguagem, categoria_id, autor_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(titulo, descricao, codigo, linguagem, categoria_id, autor_id);

    res.json({ id: result.lastInsertRowid, mensagem: 'Script criado com sucesso!' });
  } catch (error) {
    console.error('Erro ao criar script:', error);
    res.status(500).json({ erro: 'Erro ao criar script' });
  }
});

// ROTAS - Estatísticas
app.get('/api/estatisticas', (req, res) => {
  try {
    const stats = {
      total_artigos: db.prepare('SELECT COUNT(*) as count FROM artigos').get().count,
      total_scripts: db.prepare('SELECT COUNT(*) as count FROM scripts').get().count,
      artigos_populares: db.prepare(`
        SELECT id, titulo, visualizacoes 
        FROM artigos 
        ORDER BY visualizacoes DESC 
        LIMIT 5
      `).all(),
      artigos_recentes: db.prepare(`
        SELECT id, titulo, criado_em 
        FROM artigos 
        ORDER BY criado_em DESC 
        LIMIT 5
      `).all()
    };
    res.json(stats);
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ erro: 'Erro ao buscar estatísticas' });
  }
});

// Servir página principal (SPA - todas as rotas retornam index.html)
app.get('*', (req, res) => {
  const indexPath = fs.existsSync(distPath) 
    ? path.join(distPath, 'index.html')
    : path.join(__dirname, 'public', 'index.html');
  res.sendFile(indexPath);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Base de Conhecimento rodando em http://localhost:${PORT}`);
  console.log(`📚 Usuário padrão: admin@farmacia.com / Senha: admin123`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
