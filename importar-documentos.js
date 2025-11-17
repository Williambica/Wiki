const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

console.log('📚 Importando Documentos para Base de Conhecimento');
console.log('═══════════════════════════════════════════════════\n');

// Conectar ao banco
const db = new Database('conhecimento.db');

// Mapeamento de categorias por palavras-chave
const categorizarPorNome = (nome) => {
  const nomeUpper = nome.toUpperCase();
  
  if (nomeUpper.includes('NFE') || nomeUpper.includes('NFC') || nomeUpper.includes('NOTA') || nomeUpper.includes('FISCAL') || nomeUpper.includes('SNGPC')) {
    return 2; // Fiscal
  }
  if (nomeUpper.includes('ECOMMERCE') || nomeUpper.includes('E-COMMERCE') || nomeUpper.includes('PEDIDO')) {
    return 1; // E-commerce
  }
  if (nomeUpper.includes('INTEGRACAO') || nomeUpper.includes('API') || nomeUpper.includes('PHARMALINK') || nomeUpper.includes('VIDALINK') || nomeUpper.includes('MYPHARMA') || nomeUpper.includes('FUNCIONALCARD')) {
    return 4; // Integrações
  }
  if (nomeUpper.includes('SQL') || nomeUpper.includes('BANCO') || nomeUpper.includes('QUERY') || nomeUpper.includes('DBEAVER')) {
    return 5; // Banco de Dados
  }
  if (nomeUpper.includes('RELATORIO') || nomeUpper.includes('ESTOQUE') || nomeUpper.includes('INVENTARIO') || nomeUpper.includes('VENDA') || nomeUpper.includes('PDV') || nomeUpper.includes('ADM') || nomeUpper.includes('CONFIGURACAO') || nomeUpper.includes('CADASTRO') || nomeUpper.includes('MANUAL')) {
    return 3; // Sistema/ERP
  }
  
  return 3; // Padrão: Sistema/ERP
};

// Extrair tags do nome do arquivo
const extrairTags = (nome) => {
  const tags = [];
  const nomeUpper = nome.toUpperCase();
  
  if (nomeUpper.includes('NFE') || nomeUpper.includes('NFC')) tags.push('nfe');
  if (nomeUpper.includes('FISCAL')) tags.push('fiscal');
  if (nomeUpper.includes('RELATORIO')) tags.push('relatorio');
  if (nomeUpper.includes('MANUAL')) tags.push('manual');
  if (nomeUpper.includes('TUTORIAL')) tags.push('tutorial');
  if (nomeUpper.includes('ESTOQUE')) tags.push('estoque');
  if (nomeUpper.includes('VENDA')) tags.push('venda');
  if (nomeUpper.includes('DEVOLUCAO')) tags.push('devolucao');
  if (nomeUpper.includes('ERRO')) tags.push('erro');
  if (nomeUpper.includes('CONFIGURACAO')) tags.push('configuracao');
  if (nomeUpper.includes('CADASTRO')) tags.push('cadastro');
  if (nomeUpper.includes('FARMACIA_POPULAR') || nomeUpper.includes('FP')) tags.push('farmacia-popular');
  if (nomeUpper.includes('CREDIARIO') || nomeUpper.includes('CONVENIO')) tags.push('financeiro');
  if (nomeUpper.includes('PDV')) tags.push('pdv');
  if (nomeUpper.includes('SNGPC')) tags.push('sngpc');
  if (nomeUpper.includes('CONTROLADO')) tags.push('controlado');
  
  return tags.length > 0 ? tags.join(', ') : 'documentacao';
};

// Formatar título do arquivo
const formatarTitulo = (nomeArquivo) => {
  return nomeArquivo
    .replace(/\.pdf$/i, '')
    .replace(/\.docx$/i, '')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

// Gerar descrição baseada no nome
const gerarDescricao = (titulo) => {
  const tituloUpper = titulo.toUpperCase();
  
  if (tituloUpper.includes('MANUAL')) {
    return `Manual completo sobre: ${titulo}`;
  }
  if (tituloUpper.includes('TUTORIAL')) {
    return `Tutorial passo a passo: ${titulo}`;
  }
  if (tituloUpper.includes('RELATORIO')) {
    return `Guia para emissão de relatório: ${titulo}`;
  }
  if (tituloUpper.includes('ERRO')) {
    return `Solução para erro: ${titulo}`;
  }
  if (tituloUpper.includes('CONFIGURACAO')) {
    return `Guia de configuração: ${titulo}`;
  }
  
  return `Documentação: ${titulo}`;
};

try {
  const pastaDocumentos = path.join(__dirname, 'public', 'documentos');
  
  if (!fs.existsSync(pastaDocumentos)) {
    console.log('❌ Pasta de documentos não encontrada!');
    process.exit(1);
  }
  
  const arquivos = fs.readdirSync(pastaDocumentos)
    .filter(f => f.endsWith('.pdf') || f.endsWith('.docx'));
  
  console.log(`📄 Encontrados ${arquivos.length} documentos\n`);
  
  let importados = 0;
  let erros = 0;
  
  const insertArtigo = db.prepare(`
    INSERT INTO artigos (titulo, conteudo, categoria_id, tags, autor_id)
    VALUES (?, ?, ?, ?, 1)
  `);
  
  arquivos.forEach((arquivo, index) => {
    try {
      const titulo = formatarTitulo(arquivo);
      const categoria = categorizarPorNome(arquivo);
      const tags = extrairTags(arquivo);
      const descricao = gerarDescricao(titulo);
      const linkDocumento = `/documentos/${arquivo}`;
      
      const conteudo = `${descricao}

## 📄 Documento

[📥 Baixar/Visualizar Documento](${linkDocumento})

## 📋 Informações

- **Tipo**: ${arquivo.endsWith('.pdf') ? 'PDF' : 'DOCX'}
- **Categoria**: ${['', 'E-commerce', 'Fiscal', 'Sistema/ERP', 'Integrações', 'Banco de Dados'][categoria]}
- **Tags**: ${tags}

## 💡 Como usar

1. Clique no link acima para visualizar o documento
2. Siga as instruções detalhadas no manual
3. Em caso de dúvidas, consulte o suporte técnico

---

*Documento importado automaticamente da base de conhecimento*`;
      
      insertArtigo.run(titulo, conteudo, categoria, tags);
      importados++;
      
      if ((index + 1) % 10 === 0) {
        console.log(`✅ Importados ${index + 1}/${arquivos.length} documentos...`);
      }
      
    } catch (error) {
      console.log(`❌ Erro ao importar ${arquivo}: ${error.message}`);
      erros++;
    }
  });
  
  console.log('\n═══════════════════════════════════════════════════');
  console.log(`✅ Importação concluída!`);
  console.log(`📊 Total: ${arquivos.length} documentos`);
  console.log(`✅ Importados: ${importados}`);
  console.log(`❌ Erros: ${erros}`);
  console.log('═══════════════════════════════════════════════════\n');
  
} catch (error) {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
} finally {
  db.close();
}
