const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Configuração
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Arquivo de dados JSON
const DB_FILE = 'database.json';

// Inicializar banco de dados
let db = {
  usuarios: [],
  categorias: [],
  artigos: [],
  scripts: []
};

// Carregar dados do arquivo
if (fs.existsSync(DB_FILE)) {
  try {
    db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (e) {
    console.log('Criando novo banco de dados...');
  }
}

// Salvar dados no arquivo
function salvarDB() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// Inicializar dados padrão
if (db.categorias.length === 0) {
  db.categorias = [
    { id: 1, nome: 'E-commerce', cor: '#3b82f6' },
    { id: 2, nome: 'Fiscal', cor: '#10b981' },
    { id: 3, nome: 'Sistema/ERP', cor: '#f59e0b' },
    { id: 4, nome: 'Integrações', cor: '#8b5cf6' },
    { id: 5, nome: 'Banco de Dados', cor: '#ef4444' }
  ];
}

if (db.usuarios.length === 0) {
  db.usuarios = [{
    id: 1,
    nome: 'Administrador',
    email: 'admin@farmacia.com',
    area: 'Suporte',
    criado_em: new Date().toISOString()
  }];
}

// Adicionar alguns artigos de exemplo
if (db.artigos.length === 0) {
  db.artigos = [
    {
      id: 1,
      titulo: 'Como resolver erro de NF-e rejeitada',
      conteudo: `Quando uma NF-e é rejeitada, siga estes passos:

1. Verifique o código de erro retornado pela SEFAZ
2. Consulte a tabela de erros no manual da NF-e
3. Corrija os dados conforme indicado
4. Reenvie a nota

Erros comuns:
- 539: CNPJ do destinatário inválido
- 204: Duplicidade de NF-e
- 215: Falha no schema XML

Sempre mantenha backup dos XMLs enviados!`,
      categoria_id: 2,
      tags: 'nfe, fiscal, erro, sefaz',
      autor_id: 1,
      visualizacoes: 45,
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString()
    },
    {
      id: 2,
      titulo: 'Integração com E-commerce - Pedidos não sincronizam',
      conteudo: `Problema: Pedidos do e-commerce não estão sendo importados para o ERP.

Solução:
1. Verifique se o serviço de integração está rodando
2. Confira as credenciais da API
3. Valide se há erros no log de integração
4. Teste a conexão manualmente

Comando para verificar status:
SELECT * FROM integracao_log WHERE data >= CURRENT_DATE ORDER BY id DESC LIMIT 50;

Se persistir, reinicie o serviço de integração.`,
      categoria_id: 1,
      tags: 'ecommerce, integração, pedidos, api',
      autor_id: 1,
      visualizacoes: 32,
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString()
    },
    {
      id: 3,
      titulo: 'Lentidão no sistema - Diagnóstico',
      conteudo: `Quando o sistema está lento, verifique:

1. Uso de CPU e memória no servidor
2. Queries lentas no banco de dados
3. Conexões abertas em excesso
4. Espaço em disco

Queries úteis:
- Ver processos: SELECT * FROM pg_stat_activity;
- Queries lentas: SELECT * FROM pg_stat_statements ORDER BY total_time DESC;

Ações imediatas:
- Limpar cache do sistema
- Reiniciar serviços se necessário
- Verificar logs de erro`,
      categoria_id: 3,
      tags: 'performance, lentidão, banco, servidor',
      autor_id: 1,
      visualizacoes: 67,
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString()
    }
  ];
}

if (db.scripts.length === 0) {
  db.scripts = [
    {
      id: 1,
      titulo: 'Consultar vendas do dia',
      descricao: 'Query para ver todas as vendas realizadas hoje',
      codigo: `SELECT 
  v.id,
  v.numero_venda,
  c.nome as cliente,
  v.valor_total,
  v.data_hora
FROM vendas v
INNER JOIN clientes c ON v.cliente_id = c.id
WHERE DATE(v.data_hora) = CURRENT_DATE
ORDER BY v.data_hora DESC;`,
      linguagem: 'sql',
      categoria_id: 3,
      autor_id: 1,
      criado_em: new Date().toISOString()
    },
    {
      id: 2,
      titulo: 'Limpar cache do sistema',
      descricao: 'Script PowerShell para limpar cache temporário',
      codigo: `# Limpar cache do ERP
Remove-Item -Path "C:\\ERP\\temp\\*" -Recurse -Force
Remove-Item -Path "C:\\ERP\\cache\\*" -Recurse -Force

# Reiniciar serviço
Restart-Service -Name "ERPService"

Write-Host "Cache limpo com sucesso!"`,
      linguagem: 'powershell',
      categoria_id: 3,
      autor_id: 1,
      criado_em: new Date().toISOString()
    }
  ];
}

salvarDB();

// ROTAS - Categorias
app.get('/api/categorias', (req, res) => {
  res.json(db.categorias);
});

// ROTAS - Artigos
app.get('/api/artigos', (req, res) => {
  const { busca, categoria } = req.query;
  let artigos = db.artigos.map(a => {
    const cat = db.categorias.find(c => c.id === a.categoria_id);
    const autor = db.usuarios.find(u => u.id === a.autor_id);
    return {
      ...a,
      categoria_nome: cat?.nome,
      categoria_cor: cat?.cor,
      autor_nome: autor?.nome
    };
  });

  if (busca) {
    const termo = busca.toLowerCase();
    artigos = artigos.filter(a =>
      a.titulo.toLowerCase().includes(termo) ||
      a.conteudo.toLowerCase().includes(termo) ||
      (a.tags && a.tags.toLowerCase().includes(termo))
    );
  }

  if (categoria) {
    artigos = artigos.filter(a => a.categoria_id === parseInt(categoria));
  }

  artigos.sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em));
  res.json(artigos);
});

app.get('/api/artigos/:id', (req, res) => {
  const artigo = db.artigos.find(a => a.id === parseInt(req.params.id));
  
  if (artigo) {
    artigo.visualizacoes++;
    salvarDB();
    
    const cat = db.categorias.find(c => c.id === artigo.categoria_id);
    const autor = db.usuarios.find(u => u.id === artigo.autor_id);
    
    res.json({
      ...artigo,
      categoria_nome: cat?.nome,
      categoria_cor: cat?.cor,
      autor_nome: autor?.nome
    });
  } else {
    res.status(404).json({ erro: 'Artigo não encontrado' });
  }
});

app.post('/api/artigos', (req, res) => {
  const { titulo, conteudo, categoria_id, tags } = req.body;
  const novoId = db.artigos.length > 0 ? Math.max(...db.artigos.map(a => a.id)) + 1 : 1;
  
  const novoArtigo = {
    id: novoId,
    titulo,
    conteudo,
    categoria_id: parseInt(categoria_id),
    tags,
    autor_id: 1,
    visualizacoes: 0,
    criado_em: new Date().toISOString(),
    atualizado_em: new Date().toISOString()
  };
  
  db.artigos.push(novoArtigo);
  salvarDB();
  
  res.json({ id: novoId, mensagem: 'Artigo criado com sucesso!' });
});

app.put('/api/artigos/:id', (req, res) => {
  const { titulo, conteudo, categoria_id, tags } = req.body;
  const artigo = db.artigos.find(a => a.id === parseInt(req.params.id));
  
  if (artigo) {
    artigo.titulo = titulo;
    artigo.conteudo = conteudo;
    artigo.categoria_id = parseInt(categoria_id);
    artigo.tags = tags;
    artigo.atualizado_em = new Date().toISOString();
    salvarDB();
    res.json({ mensagem: 'Artigo atualizado com sucesso!' });
  } else {
    res.status(404).json({ erro: 'Artigo não encontrado' });
  }
});

app.delete('/api/artigos/:id', (req, res) => {
  const index = db.artigos.findIndex(a => a.id === parseInt(req.params.id));
  if (index !== -1) {
    db.artigos.splice(index, 1);
    salvarDB();
    res.json({ mensagem: 'Artigo excluído com sucesso!' });
  } else {
    res.status(404).json({ erro: 'Artigo não encontrado' });
  }
});

// ROTAS - Scripts
app.get('/api/scripts', (req, res) => {
  const scripts = db.scripts.map(s => {
    const cat = db.categorias.find(c => c.id === s.categoria_id);
    const autor = db.usuarios.find(u => u.id === s.autor_id);
    return {
      ...s,
      categoria_nome: cat?.nome,
      categoria_cor: cat?.cor,
      autor_nome: autor?.nome
    };
  });
  
  scripts.sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em));
  res.json(scripts);
});

app.post('/api/scripts', (req, res) => {
  const { titulo, descricao, codigo, linguagem, categoria_id } = req.body;
  const novoId = db.scripts.length > 0 ? Math.max(...db.scripts.map(s => s.id)) + 1 : 1;
  
  const novoScript = {
    id: novoId,
    titulo,
    descricao,
    codigo,
    linguagem,
    categoria_id: parseInt(categoria_id),
    autor_id: 1,
    criado_em: new Date().toISOString()
  };
  
  db.scripts.push(novoScript);
  salvarDB();
  
  res.json({ id: novoId, mensagem: 'Script criado com sucesso!' });
});

// ROTAS - Estatísticas
app.get('/api/estatisticas', (req, res) => {
  const artigosOrdenados = [...db.artigos].sort((a, b) => b.visualizacoes - a.visualizacoes);
  const artigosRecentes = [...db.artigos].sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em));
  
  const stats = {
    total_artigos: db.artigos.length,
    total_scripts: db.scripts.length,
    artigos_populares: artigosOrdenados.slice(0, 5).map(a => ({
      id: a.id,
      titulo: a.titulo,
      visualizacoes: a.visualizacoes
    })),
    artigos_recentes: artigosRecentes.slice(0, 5).map(a => ({
      id: a.id,
      titulo: a.titulo,
      criado_em: a.criado_em
    }))
  };
  
  res.json(stats);
});

// Servir página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 Base de Conhecimento rodando em http://localhost:${PORT}`);
  console.log(`📚 Sistema pronto para uso!`);
  console.log(`💾 Dados salvos em: ${DB_FILE}\n`);
});
