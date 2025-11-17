const express = require('express');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const PORT = 3000;

// Configuração
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Inicializar banco de dados
const db = new Database('conhecimento.db');
db.pragma('journal_mode = WAL');

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
  const categorias = db.prepare('SELECT * FROM categorias').all();
  res.json(categorias);
});

// ROTAS - Artigos
app.get('/api/artigos', (req, res) => {
  const { busca, categoria } = req.query;
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

  query += ` ORDER BY a.criado_em DESC`;

  const artigos = db.prepare(query).all(...params);
  res.json(artigos);
});

app.get('/api/artigos/:id', (req, res) => {
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
});

app.post('/api/artigos', (req, res) => {
  const { titulo, conteudo, categoria_id, tags } = req.body;
  const autor_id = 1; // Por enquanto usa admin

  const result = db.prepare(`
    INSERT INTO artigos (titulo, conteudo, categoria_id, tags, autor_id)
    VALUES (?, ?, ?, ?, ?)
  `).run(titulo, conteudo, categoria_id, tags, autor_id);

  res.json({ id: result.lastInsertRowid, mensagem: 'Artigo criado com sucesso!' });
});

app.put('/api/artigos/:id', (req, res) => {
  const { titulo, conteudo, categoria_id, tags } = req.body;
  
  db.prepare(`
    UPDATE artigos 
    SET titulo = ?, conteudo = ?, categoria_id = ?, tags = ?, atualizado_em = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(titulo, conteudo, categoria_id, tags, req.params.id);

  res.json({ mensagem: 'Artigo atualizado com sucesso!' });
});

app.delete('/api/artigos/:id', (req, res) => {
  db.prepare('DELETE FROM artigos WHERE id = ?').run(req.params.id);
  res.json({ mensagem: 'Artigo excluído com sucesso!' });
});

// ROTAS - Scripts
app.get('/api/scripts', (req, res) => {
  const scripts = db.prepare(`
    SELECT s.*, c.nome as categoria_nome, c.cor as categoria_cor, u.nome as autor_nome
    FROM scripts s
    LEFT JOIN categorias c ON s.categoria_id = c.id
    LEFT JOIN usuarios u ON s.autor_id = u.id
    ORDER BY s.criado_em DESC
  `).all();
  res.json(scripts);
});

app.post('/api/scripts', (req, res) => {
  const { titulo, descricao, codigo, linguagem, categoria_id } = req.body;
  const autor_id = 1;

  const result = db.prepare(`
    INSERT INTO scripts (titulo, descricao, codigo, linguagem, categoria_id, autor_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(titulo, descricao, codigo, linguagem, categoria_id, autor_id);

  res.json({ id: result.lastInsertRowid, mensagem: 'Script criado com sucesso!' });
});

// ROTAS - Estatísticas
app.get('/api/estatisticas', (req, res) => {
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
});

// Servir página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Base de Conhecimento rodando em http://localhost:${PORT}`);
  console.log(`📚 Usuário padrão: admin@farmacia.com / Senha: admin123`);
});
