const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const db = new Database('wiki.db');

// Criar tabelas se não existirem
db.exec(`
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
    autor_id INTEGER DEFAULT 1,
    visualizacoes INTEGER DEFAULT 0,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
  );
`);

// Inserir categoria SQL se não existir
db.prepare('INSERT OR IGNORE INTO categorias (id, nome, cor) VALUES (?, ?, ?)').run(6, 'Queries SQL', '#ec4899');

// Categoria para Queries SQL
const CATEGORIA_SQL = 6;

console.log('📊 Importando Queries SQL...\n');

// Limpar queries antigas
db.prepare('DELETE FROM artigos WHERE categoria_id = ?').run(CATEGORIA_SQL);

// Query 1: Anotações SPA - Queries úteis
const anotacoesSPA = fs.readFileSync('PastaFaqAlex/PastaFaqAlex/Úteis/Anotações SPA.sql', 'utf-8');

const titulo1 = 'Anotações SPA - Queries e Comandos Úteis';
const conteudo1 = `# Anotações SPA - Queries e Comandos Úteis

## Atalhos do Sistema
- **CTRL+M**: Liberar venda bloqueada sendo autorizada por outra pessoa (necessita senha gerente)

## Senhas de Servidores

### Rede@9311
Senha servidor LVD (Camaquã)

### Hamburguesa
- Senha servidor matriz: \`v00l1vr&\`
- Senha servidores: \`fH@m91673\`
- Senha estações: \`fha07cpd\`

### Vione Matriz
- Usuário: Administrador
- Senha: \`Ttysnord2020!\`

### Botânica Filial
- Usuário: Administrador
- Senha: \`00478A#20\`

---

## Queries SQL Úteis

### Remover Promoção (Tabloide)
Quando é feita alteração e não atualiza:

\`\`\`sql
-- Verificar se existe "sujeira" dentro da tabela
SELECT * FROM promo_i WHERE numero = xxx;
SELECT * FROM promo_m WHERE numero = xxx;

-- Deletar a "sujeira"
DELETE FROM promo_i WHERE numero = xxx;
DELETE FROM promo_m WHERE numero = xxx;
\`\`\`

### Remover Crédito Gerado por Devolução
Cliente tem que dar autorização, anotar nome da pessoa que fez o pedido:

\`\`\`sql
-- Verificar venda
SELECT * FROM arqdevol WHERE numvenda = 238705;

-- Ajustar o crédito para 0
UPDATE arqdevol SET credito = '00.00' WHERE numvenda = 238705;
\`\`\`

### Ajustar ADM Não Autorizado
Mensagem de erro: computador não autorizado a abrir o ADM:

\`\`\`sql
-- ADM: verificar os códigos
SELECT codigo, cod_assoc, senha_wsfa FROM empresa;

-- PDV: verificar os códigos
SELECT codigo, cod_assoc, senha_wsfa FROM empresas;

-- PDV: replicar o dado do PDV para o ADM
UPDATE empresa SET cod_assoc = xxxx, senha_wsfa = 1234 WHERE codigo = x;
\`\`\`

### Venda de Tele com PBM que Precisa ser Estornada

\`\`\`sql
UPDATE vendasm SET tele_ent = 'VE' WHERE numvenda = '';
\`\`\`

### NFCE Pendente com Erro de Emissão

\`\`\`sql
UPDATE nfce_cab SET situacao = 'T' WHERE numero = xxxx;
\`\`\`

### Consultar Produto no Banco

\`\`\`bash
mysqldump -u result -p resultadm produto -h 192.168.25.200 > produto.sql
\`\`\`

### Acessar o Banco pelo CMD

\`\`\`bash
mysql -u result -p resultpdv -h 0.0.0.0
\`\`\`

### Alterar Data de Venda de Produtos Controlados

\`\`\`sql
SELECT * FROM mov_contr WHERE num_seq = numero_da_sequencia;
UPDATE mov_contr SET data = 'inserir_data_desejada' WHERE num_seq = numero_da_sequencia;
\`\`\`

### Verificar Venda no Caixa

\`\`\`sql
SELECT st_caixa FROM vendasm WHERE numvenda = xx;
\`\`\`

### Destravar Impressora

\`\`\`sql
SELECT * FROM spooler_nfce WHERE situacao = 'P';
UPDATE spooler_nfce SET situacao = 'F' WHERE situacao = 'P';
\`\`\`

### Habilitar Visualização do Preço de Custo

\`\`\`sql
UPDATE empresas SET ver_custo = 'S';
\`\`\`

### Ajustar FP Devolvida

\`\`\`sql
-- Verificar
SELECT numvenda, fciapop, st_caixa, vlr_dev FROM vendasm WHERE numvenda = xxxx;

-- Atualizar
UPDATE vendasm SET st_caixa = 'PA', vlr_dev = 0, fciapop = 'S' WHERE numvenda IN (xxxx);
UPDATE vendasi SET qt_dev = 0, vlr_dev = 0 WHERE numvenda IN (xxxx);

-- Limpar devolução
SELECT * FROM arqdevol WHERE numvenda = xxx;
DELETE FROM arqdevol WHERE numvenda = xxx;
\`\`\`

### Remessas Presas com Status 'U'

\`\`\`sql
SELECT * FROM remes_m WHERE numero = xxxxx;
UPDATE remes_m SET status = 'P' WHERE numero = xxxxx;
\`\`\`

### Rejeição Cupom Numeração Inválida

\`\`\`sql
UPDATE nfce_cab SET cod_nf = cod_nf + 1 WHERE situacao = 'G';
\`\`\`

### Validar Notas Pendentes (Duplicidade)

\`\`\`sql
UPDATE nfce_cab SET situacao = 'T' WHERE numero = xxxx;
\`\`\`

### Verificar Venda no Painel NFCe

\`\`\`sql
SELECT * FROM nfce_cab WHERE numvenda = 597879;
\`\`\`

### Atualizar Situação da Venda no Caixa

\`\`\`sql
UPDATE vendasm SET st_caixa = 'ES' WHERE numvenda = 597879;
\`\`\`

### Descobrir Senhas no Banco

\`\`\`sql
-- Senha Master
SELECT sen_mas FROM empresas;

-- Senha Gerente
SELECT sen_ger FROM empresas;
\`\`\`

### Ajustar Validade de Controlados

\`\`\`sql
UPDATE lotes SET validade = 'aaaa-mm-dd' WHERE produto = XXXX AND lote = 'XXXX';
UPDATE mov_contr SET data_v = 'aaaa-mm-dd' WHERE num_seq = XXXX;
\`\`\`

### Limpar Fila de Impressão

\`\`\`sql
TRUNCATE spooler;
TRUNCATE spooler_item;

SELECT * FROM spooler WHERE tabela = 'cpvenda';
DELETE FROM spooler WHERE tabela = 'cpvenda';
\`\`\`

### Deletar Produtos Não Controlados do SNGPC

\`\`\`sql
SELECT * FROM mov_contr WHERE stat_anv = 'N' AND lote = '';
DELETE FROM mov_contr WHERE stat_anv = 'N' AND lote = '';
\`\`\`

### Ajustar Tipo de Documento do Comprador

\`\`\`sql
SELECT COUNT(*) FROM venda_rec_cab WHERE tipo_doc = '' AND nro_doc <> '';
UPDATE venda_rec_cab SET tipo_doc = 2 WHERE tipo_doc = '' AND nro_doc <> '';
\`\`\`

### Estornar Vendas

\`\`\`sql
-- Verificar
SELECT * FROM caixa_mov WHERE numvenda = xxx;
SELECT * FROM nfce_cab WHERE numvenda = xxx;

-- Caso tenha emitido cupom
UPDATE vendasm SET st_caixa = 'PA' WHERE numvenda = xxx;

-- Se não emitiu
UPDATE vendasm SET st_caixa = 'CO' WHERE numvenda = xxx;
\`\`\`

---

## Comandos de Manutenção

### Reparos de Tabelas

\`\`\`bash
mysqlcheck -A --auto-repair -u root -p
mysqlcheck -u result --password=res2003 --auto-repair --check --all-databases -h IP
\`\`\`

### Criar Tabela para Tele Entrega

\`\`\`sql
CREATE TABLE vendasv (
  num_seq BIGINT(10) NOT NULL AUTO_INCREMENT,
  seq_itv BIGINT(10) NOT NULL,
  lote VARCHAR(15) NOT NULL,
  dt_valid DATE DEFAULT '0000-00-00',
  quantid DECIMAL(12,4) DEFAULT 0,
  PRIMARY KEY(num_seq)
);
\`\`\`

### Atualização para Validação das Tele Entregas

\`\`\`sql
UPDATE empresas SET ctrl_valid = 'S';
\`\`\`

---

## Abertura de Chamados via WhatsApp

Para abertura de chamados é necessário:

1. CNPJ da loja solicitante
2. Responsável pelo contato
3. Telefone fixo/celular (atualizado)
4. Detalhar a dúvida/problema de forma escrita (com prints se necessário)
`;

db.prepare(`
  INSERT INTO artigos (titulo, conteudo, categoria_id, tags, autor_id)
  VALUES (?, ?, ?, ?, 1)
`).run(titulo1, conteudo1, CATEGORIA_SQL, 'sql, queries, comandos, spa, sistema');

console.log('✅ Importado: Anotações SPA');

// Query 2: Queries de Manutenção de Menu
const titulo2 = 'Queries de Manutenção - Configuração de Menu ADM/PDV';
const conteudo2 = `# Queries de Manutenção - Configuração de Menu ADM/PDV

## Descrição
Queries SQL para manutenção e configuração de menus do sistema ADM e PDV. Útil para resolver problemas de restrições de usuário e configurações de menu.

## Problema Comum
**ADM não mostra configuração de restrições de usuário**

Quando o sistema ADM não exibe corretamente as configurações de menu ou restrições de usuário, pode ser necessário recriar as tabelas de menu.

---

## Estrutura das Tabelas

### Tabela: cad_menu (ADM)

\`\`\`sql
CREATE TABLE cad_menu (
  num_seq INT(6) NOT NULL AUTO_INCREMENT,
  sistema CHAR(3) NOT NULL DEFAULT '',
  item_top VARCHAR(30) NOT NULL DEFAULT '',
  item_down VARCHAR(60) NOT NULL DEFAULT '',
  desc_sist VARCHAR(40) DEFAULT NULL,
  desc_usu VARCHAR(40) DEFAULT '',
  url VARCHAR(60) DEFAULT NULL,
  titulo_web CHAR(1) DEFAULT 'N',
  visivel CHAR(1) NOT NULL DEFAULT 'N',
  status CHAR(1) DEFAULT NULL,
  PRIMARY KEY (num_seq)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
\`\`\`

### Tabela: cad_menu_pdv (ADM)

\`\`\`sql
CREATE TABLE cad_menu_pdv (
  num_seq INT(6) NOT NULL AUTO_INCREMENT,
  sistema CHAR(3) DEFAULT 'PDV',
  codigo VARCHAR(12) DEFAULT '',
  item_top VARCHAR(30) DEFAULT '',
  item_down VARCHAR(60) DEFAULT '',
  sub_menu VARCHAR(60) DEFAULT '',
  desc_sist VARCHAR(40) DEFAULT '',
  visivel CHAR(1) DEFAULT 'N',
  status CHAR(1) DEFAULT 'N',
  PRIMARY KEY (num_seq)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
\`\`\`

### Tabela: cad_menu (PDV)

\`\`\`sql
CREATE TABLE cad_menu (
  num_seq INT(6) NOT NULL AUTO_INCREMENT,
  sistema CHAR(3) NOT NULL DEFAULT '',
  codigo VARCHAR(12) DEFAULT '',
  item_top VARCHAR(30) NOT NULL DEFAULT '',
  item_down VARCHAR(60) NOT NULL DEFAULT '',
  sub_menu VARCHAR(60) DEFAULT '',
  desc_sist VARCHAR(40) DEFAULT NULL,
  visivel CHAR(1) NOT NULL DEFAULT 'N',
  status CHAR(1) DEFAULT NULL,
  PRIMARY KEY (num_seq)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
\`\`\`

---

## Queries de Consulta

### Verificar Menus Visíveis no ADM

\`\`\`sql
SELECT * FROM cad_menu WHERE sistema = 'ADM' AND visivel = 'S' ORDER BY num_seq;
\`\`\`

### Verificar Menus Visíveis no PDV

\`\`\`sql
SELECT * FROM cad_menu WHERE sistema = 'PDV' AND visivel = 'S' ORDER BY num_seq;
\`\`\`

### Listar Todos os Menus por Sistema

\`\`\`sql
SELECT sistema, item_top, item_down, visivel, status 
FROM cad_menu 
WHERE sistema = 'ADM' 
ORDER BY item_top, item_down;
\`\`\`

---

## Queries de Manutenção

### Tornar Todos os Menus Visíveis (ADM)

\`\`\`sql
UPDATE cad_menu SET visivel = 'S' WHERE sistema = 'ADM';
\`\`\`

### Tornar Todos os Menus Visíveis (PDV)

\`\`\`sql
UPDATE cad_menu SET visivel = 'S' WHERE sistema = 'PDV';
\`\`\`

### Ocultar Menu Específico

\`\`\`sql
UPDATE cad_menu SET visivel = 'N' WHERE desc_sist = 'nome_do_menu';
\`\`\`

### Ativar Menu Específico

\`\`\`sql
UPDATE cad_menu SET status = 'S' WHERE desc_sist = 'nome_do_menu';
\`\`\`

---

## Solução de Problemas

### Problema: Menu não aparece no ADM

**Passo 1**: Verificar se o menu existe
\`\`\`sql
SELECT * FROM cad_menu WHERE desc_sist = 'nome_do_menu';
\`\`\`

**Passo 2**: Tornar visível
\`\`\`sql
UPDATE cad_menu SET visivel = 'S' WHERE desc_sist = 'nome_do_menu';
\`\`\`

### Problema: Restrições de usuário não funcionam

**Solução**: Recriar as tabelas de menu usando os dumps SQL fornecidos nos arquivos:
- \`ADM_cad_menu.sql\`
- \`ADM_cad_menu_pdv.sql\`
- \`PDV_cad_menu.sql\`

---

## Backup e Restore

### Fazer Backup da Tabela

\`\`\`bash
mysqldump -u result -p resultadm cad_menu > backup_cad_menu.sql
mysqldump -u result -p resultpdv cad_menu > backup_cad_menu_pdv.sql
\`\`\`

### Restaurar Tabela

\`\`\`bash
mysql -u result -p resultadm < ADM_cad_menu.sql
mysql -u result -p resultadm < ADM_cad_menu_pdv.sql
mysql -u result -p resultpdv < PDV_cad_menu.sql
\`\`\`

---

## Observações Importantes

⚠️ **Atenção**: Sempre faça backup antes de executar queries de UPDATE ou DELETE

⚠️ **Importante**: As tabelas de menu controlam o acesso e visibilidade de funcionalidades do sistema

⚠️ **Nota**: Após alterações nas tabelas de menu, pode ser necessário reiniciar o sistema
`;

db.prepare(`
  INSERT INTO artigos (titulo, conteudo, categoria_id, tags, autor_id)
  VALUES (?, ?, ?, ?, 1)
`).run(titulo2, conteudo2, CATEGORIA_SQL, 'sql, menu, adm, pdv, configuração, restrições');

console.log('✅ Importado: Queries de Manutenção de Menu');

// Query 3: Queries de Performance e Diagnóstico
const titulo3 = 'Queries de Performance e Diagnóstico de Banco de Dados';
const conteudo3 = `# Queries de Performance e Diagnóstico de Banco de Dados

## Descrição
Queries SQL para diagnóstico de performance, análise de processos e otimização do banco de dados.

---

## PostgreSQL - Diagnóstico

### Ver Processos Ativos

\`\`\`sql
SELECT * FROM pg_stat_activity;
\`\`\`

### Queries Lentas

\`\`\`sql
SELECT * FROM pg_stat_statements 
ORDER BY total_time DESC 
LIMIT 50;
\`\`\`

### Conexões Ativas por Banco

\`\`\`sql
SELECT datname, count(*) as connections
FROM pg_stat_activity
GROUP BY datname
ORDER BY connections DESC;
\`\`\`

### Matar Processo Específico

\`\`\`sql
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE pid = <process_id>;
\`\`\`

### Tamanho dos Bancos de Dados

\`\`\`sql
SELECT 
  pg_database.datname,
  pg_size_pretty(pg_database_size(pg_database.datname)) AS size
FROM pg_database
ORDER BY pg_database_size(pg_database.datname) DESC;
\`\`\`

---

## MySQL - Diagnóstico

### Ver Processos Ativos

\`\`\`sql
SHOW PROCESSLIST;
\`\`\`

### Matar Processo

\`\`\`sql
KILL <process_id>;
\`\`\`

### Ver Variáveis do Sistema

\`\`\`sql
SHOW VARIABLES LIKE '%max_connections%';
SHOW VARIABLES LIKE '%buffer%';
\`\`\`

### Status do Servidor

\`\`\`sql
SHOW STATUS;
SHOW STATUS LIKE 'Threads%';
SHOW STATUS LIKE 'Connections';
\`\`\`

### Tamanho das Tabelas

\`\`\`sql
SELECT 
  table_schema AS 'Database',
  table_name AS 'Table',
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
ORDER BY (data_length + index_length) DESC
LIMIT 20;
\`\`\`

### Verificar Índices

\`\`\`sql
SHOW INDEX FROM nome_tabela;
\`\`\`

### Analisar Tabela

\`\`\`sql
ANALYZE TABLE nome_tabela;
\`\`\`

### Otimizar Tabela

\`\`\`sql
OPTIMIZE TABLE nome_tabela;
\`\`\`

---

## Queries de Vendas

### Consultar Vendas do Dia

\`\`\`sql
SELECT 
  v.id,
  v.numero_venda,
  c.nome AS cliente,
  v.valor_total,
  v.data_hora
FROM vendas v
INNER JOIN clientes c ON v.cliente_id = c.id
WHERE DATE(v.data_hora) = CURRENT_DATE
ORDER BY v.data_hora DESC;
\`\`\`

### Vendas por Período

\`\`\`sql
SELECT 
  DATE(data_hora) AS data,
  COUNT(*) AS total_vendas,
  SUM(valor_total) AS faturamento
FROM vendas
WHERE data_hora BETWEEN '2024-01-01' AND '2024-12-31'
GROUP BY DATE(data_hora)
ORDER BY data DESC;
\`\`\`

### Top 10 Produtos Mais Vendidos

\`\`\`sql
SELECT 
  p.nome,
  SUM(vi.quantidade) AS total_vendido,
  SUM(vi.valor_total) AS faturamento
FROM vendas_itens vi
INNER JOIN produtos p ON vi.produto_id = p.id
WHERE vi.data_venda >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
GROUP BY p.id, p.nome
ORDER BY total_vendido DESC
LIMIT 10;
\`\`\`

### Vendas por Vendedor

\`\`\`sql
SELECT 
  v.vendedor_nome,
  COUNT(*) AS total_vendas,
  SUM(v.valor_total) AS faturamento,
  AVG(v.valor_total) AS ticket_medio
FROM vendas v
WHERE DATE(v.data_hora) = CURRENT_DATE
GROUP BY v.vendedor_nome
ORDER BY faturamento DESC;
\`\`\`

---

## Queries de Estoque

### Produtos com Estoque Baixo

\`\`\`sql
SELECT 
  codigo,
  nome,
  estoque_atual,
  estoque_minimo
FROM produtos
WHERE estoque_atual <= estoque_minimo
  AND ativo = 'S'
ORDER BY estoque_atual ASC;
\`\`\`

### Produtos Sem Movimento (Sem Giro)

\`\`\`sql
SELECT 
  p.codigo,
  p.nome,
  p.estoque_atual,
  p.ultima_venda
FROM produtos p
WHERE p.ultima_venda < DATE_SUB(CURRENT_DATE, INTERVAL 90 DAY)
  AND p.estoque_atual > 0
ORDER BY p.ultima_venda ASC;
\`\`\`

### Produtos Vencidos ou Próximos ao Vencimento

\`\`\`sql
SELECT 
  p.codigo,
  p.nome,
  l.lote,
  l.validade,
  l.quantidade
FROM lotes l
INNER JOIN produtos p ON l.produto_id = p.id
WHERE l.validade <= DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY)
  AND l.quantidade > 0
ORDER BY l.validade ASC;
\`\`\`

---

## Queries de Integração

### Verificar Log de Integração E-commerce

\`\`\`sql
SELECT * 
FROM integracao_log 
WHERE data >= CURRENT_DATE 
ORDER BY id DESC 
LIMIT 50;
\`\`\`

### Pedidos Pendentes de Sincronização

\`\`\`sql
SELECT 
  id,
  numero_pedido,
  status,
  data_criacao,
  tentativas_sync
FROM pedidos_ecommerce
WHERE status = 'pendente'
  AND tentativas_sync < 3
ORDER BY data_criacao ASC;
\`\`\`

---

## Queries de Manutenção

### Limpar Logs Antigos

\`\`\`sql
DELETE FROM logs 
WHERE data_log < DATE_SUB(CURRENT_DATE, INTERVAL 90 DAY);
\`\`\`

### Reindexar Tabela (PostgreSQL)

\`\`\`sql
REINDEX TABLE nome_tabela;
\`\`\`

### Vacuum (PostgreSQL)

\`\`\`sql
VACUUM ANALYZE nome_tabela;
\`\`\`

### Verificar Fragmentação (MySQL)

\`\`\`sql
SELECT 
  table_name,
  data_free,
  ROUND(data_free / 1024 / 1024, 2) AS data_free_mb
FROM information_schema.tables
WHERE table_schema = 'nome_banco'
  AND data_free > 0
ORDER BY data_free DESC;
\`\`\`

---

## Dicas de Performance

### Criar Índice

\`\`\`sql
CREATE INDEX idx_nome ON tabela(coluna);
CREATE INDEX idx_composto ON tabela(coluna1, coluna2);
\`\`\`

### Remover Índice

\`\`\`sql
DROP INDEX idx_nome ON tabela;
\`\`\`

### Analisar Plano de Execução (MySQL)

\`\`\`sql
EXPLAIN SELECT * FROM tabela WHERE condicao;
\`\`\`

### Analisar Plano de Execução (PostgreSQL)

\`\`\`sql
EXPLAIN ANALYZE SELECT * FROM tabela WHERE condicao;
\`\`\`

---

## Observações

⚠️ **Importante**: Sempre teste queries em ambiente de desenvolvimento antes de executar em produção

⚠️ **Backup**: Faça backup antes de executar queries de DELETE ou UPDATE em massa

⚠️ **Performance**: Use LIMIT em queries de consulta para evitar sobrecarga

⚠️ **Índices**: Crie índices nas colunas mais consultadas para melhorar performance
`;

db.prepare(`
  INSERT INTO artigos (titulo, conteudo, categoria_id, tags, autor_id)
  VALUES (?, ?, ?, ?, 1)
`).run(titulo3, conteudo3, CATEGORIA_SQL, 'sql, performance, diagnóstico, otimização, vendas, estoque');

console.log('✅ Importado: Queries de Performance e Diagnóstico');

// Query 4: Queries de Backup e Restore
const titulo4 = 'Comandos de Backup e Restore - MySQL';
const conteudo4 = `# Comandos de Backup e Restore - MySQL

## Descrição
Comandos essenciais para backup e restore de bancos de dados MySQL.

---

## Backup Completo

### Backup de Banco Específico

\`\`\`bash
mysqldump -u usuario -p nome_banco > backup_banco.sql
\`\`\`

### Backup com Host Remoto

\`\`\`bash
mysqldump -u result -p resultadm -h 192.168.25.200 > backup_resultadm.sql
\`\`\`

### Backup de Tabela Específica

\`\`\`bash
mysqldump -u result -p resultadm produto -h 192.168.25.200 > produto.sql
\`\`\`

### Backup de Múltiplas Tabelas

\`\`\`bash
mysqldump -u usuario -p nome_banco tabela1 tabela2 tabela3 > backup_tabelas.sql
\`\`\`

### Backup de Todos os Bancos

\`\`\`bash
mysqldump -u root -p --all-databases > backup_completo.sql
\`\`\`

### Backup Compactado

\`\`\`bash
mysqldump -u usuario -p nome_banco | gzip > backup_banco.sql.gz
\`\`\`

---

## Backup com Opções Avançadas

### Backup Apenas Estrutura (Sem Dados)

\`\`\`bash
mysqldump -u usuario -p --no-data nome_banco > estrutura.sql
\`\`\`

### Backup Apenas Dados (Sem Estrutura)

\`\`\`bash
mysqldump -u usuario -p --no-create-info nome_banco > dados.sql
\`\`\`

### Backup com Rotinas e Triggers

\`\`\`bash
mysqldump -u usuario -p --routines --triggers nome_banco > backup_completo.sql
\`\`\`

### Backup com Lock de Tabelas

\`\`\`bash
mysqldump -u usuario -p --lock-tables nome_banco > backup_locked.sql
\`\`\`

---

## Restore (Restauração)

### Restore de Banco Completo

\`\`\`bash
mysql -u usuario -p nome_banco < backup_banco.sql
\`\`\`

### Restore com Host Remoto

\`\`\`bash
mysql -u result -p resultadm -h 192.168.25.200 < backup_resultadm.sql
\`\`\`

### Restore de Arquivo Compactado

\`\`\`bash
gunzip < backup_banco.sql.gz | mysql -u usuario -p nome_banco
\`\`\`

### Restore Criando Banco Novo

\`\`\`bash
mysql -u root -p -e "CREATE DATABASE novo_banco;"
mysql -u root -p novo_banco < backup_banco.sql
\`\`\`

---

## Verificação e Reparo

### Verificar Todas as Tabelas

\`\`\`bash
mysqlcheck -u result -p --check --all-databases -h IP
\`\`\`

### Reparar Todas as Tabelas

\`\`\`bash
mysqlcheck -u result -p --auto-repair --check --all-databases -h IP
\`\`\`

### Reparar Banco Específico

\`\`\`bash
mysqlcheck -u usuario -p --auto-repair nome_banco
\`\`\`

### Otimizar Todas as Tabelas

\`\`\`bash
mysqlcheck -u usuario -p --optimize --all-databases
\`\`\`

### Analisar Tabelas

\`\`\`bash
mysqlcheck -u usuario -p --analyze nome_banco
\`\`\`

---

## Acesso ao Banco

### Conectar ao MySQL Local

\`\`\`bash
mysql -u result -p resultpdv
\`\`\`

### Conectar ao MySQL Remoto

\`\`\`bash
mysql -u result -p resultpdv -h 192.168.25.200
\`\`\`

### Conectar e Executar Query

\`\`\`bash
mysql -u usuario -p -e "SELECT * FROM tabela LIMIT 10;" nome_banco
\`\`\`

---

## Scripts de Backup Automatizado

### Script Bash para Backup Diário

\`\`\`bash
#!/bin/bash
DATA=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/mysql"
USUARIO="result"
SENHA="res2003"
BANCO="resultadm"

mysqldump -u $USUARIO -p$SENHA $BANCO > $BACKUP_DIR/backup_$BANCO_$DATA.sql

# Manter apenas últimos 7 dias
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
\`\`\`

### Script Windows (BAT) para Backup

\`\`\`batch
@echo off
set DATA=%date:~-4%%date:~3,2%%date:~0,2%
set HORA=%time:~0,2%%time:~3,2%
set BACKUP_DIR=C:\\backup\\mysql
set USUARIO=result
set SENHA=res2003
set BANCO=resultadm

mysqldump -u %USUARIO% -p%SENHA% %BANCO% > %BACKUP_DIR%\\backup_%BANCO%_%DATA%_%HORA%.sql
\`\`\`

---

## Migração de Dados

### Copiar Banco Entre Servidores

\`\`\`bash
# Servidor origem
mysqldump -u usuario -p banco_origem | mysql -u usuario -p -h servidor_destino banco_destino
\`\`\`

### Exportar e Importar com Compressão

\`\`\`bash
# Exportar
mysqldump -u usuario -p banco | gzip > backup.sql.gz

# Importar
gunzip < backup.sql.gz | mysql -u usuario -p banco
\`\`\`

---

## Dicas Importantes

⚠️ **Senha na Linha de Comando**: Evite usar \`-pSENHA\` (sem espaço) em produção por segurança

⚠️ **Backup Regular**: Configure backups automáticos diários

⚠️ **Teste de Restore**: Sempre teste seus backups periodicamente

⚠️ **Espaço em Disco**: Verifique espaço disponível antes de fazer backup

⚠️ **Permissões**: Certifique-se de ter permissões adequadas no banco

⚠️ **Lock de Tabelas**: Use \`--single-transaction\` para InnoDB sem lock

---

## Comandos Úteis MySQL

### Ver Bancos de Dados

\`\`\`sql
SHOW DATABASES;
\`\`\`

### Usar Banco Específico

\`\`\`sql
USE nome_banco;
\`\`\`

### Ver Tabelas

\`\`\`sql
SHOW TABLES;
\`\`\`

### Ver Estrutura da Tabela

\`\`\`sql
DESCRIBE nome_tabela;
SHOW CREATE TABLE nome_tabela;
\`\`\`

### Ver Usuários

\`\`\`sql
SELECT user, host FROM mysql.user;
\`\`\`
`;

db.prepare(`
  INSERT INTO artigos (titulo, conteudo, categoria_id, tags, autor_id)
  VALUES (?, ?, ?, ?, 1)
`).run(titulo4, conteudo4, CATEGORIA_SQL, 'sql, backup, restore, mysql, mysqldump, manutenção');

console.log('✅ Importado: Comandos de Backup e Restore');

console.log('\n✨ Importação concluída!');
console.log(`📊 Total: 4 artigos de Queries SQL importados\n`);

db.close();
