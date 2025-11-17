const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const db = new Database('conhecimento.db');

// Mapeamento de categorias
const categoriasMap = {
  'Relatórios': 3, // Sistema/ERP
  'Cadastros': 3,  // Sistema/ERP
  'NFE': 2,        // Fiscal
  'NFCE': 2,       // Fiscal
  'NFSE': 2,       // Fiscal
  'Fiscal': 2,     // Fiscal
  'SNGPC': 2,      // Fiscal
  'Farmácia Popular': 3, // Sistema/ERP
  'FP': 3,         // Sistema/ERP
  'Integração': 4, // Integrações
  'E-commerce': 1, // E-commerce
  'Banco': 5,      // Banco de Dados
  'SQL': 5         // Banco de Dados
};

function detectarCategoria(nomeArquivo) {
  const nome = nomeArquivo.toLowerCase();
  
  if (nome.includes('nfe') || nome.includes('nfce') || nome.includes('nfse') || nome.includes('fiscal')) {
    return 2; // Fiscal
  }
  if (nome.includes('relatorio') || nome.includes('relatório')) {
    return 3; // Sistema/ERP
  }
  if (nome.includes('cadastro')) {
    return 3; // Sistema/ERP
  }
  if (nome.includes('sngpc') || nome.includes('controlado')) {
    return 2; // Fiscal
  }
  if (nome.includes('farmacia popular') || nome.includes('farmácia popular') || nome.includes('_fp')) {
    return 3; // Sistema/ERP
  }
  if (nome.includes('integra') || nome.includes('sincxml') || nome.includes('vidalink') || nome.includes('pharmalink')) {
    return 4; // Integrações
  }
  if (nome.includes('sql') || nome.includes('banco') || nome.includes('dbeaver')) {
    return 5; // Banco de Dados
  }
  
  return 3; // Sistema/ERP (padrão)
}

function extrairTags(nomeArquivo) {
  const tags = [];
  const nome = nomeArquivo.toLowerCase();
  
  if (nome.includes('nfe')) tags.push('nfe');
  if (nome.includes('nfce')) tags.push('nfce');
  if (nome.includes('nfse')) tags.push('nfse');
  if (nome.includes('erro')) tags.push('erro');
  if (nome.includes('tutorial')) tags.push('tutorial');
  if (nome.includes('manual')) tags.push('manual');
  if (nome.includes('configuração') || nome.includes('configuracao')) tags.push('configuração');
  if (nome.includes('cadastro')) tags.push('cadastro');
  if (nome.includes('relatório') || nome.includes('relatorio')) tags.push('relatório');
  if (nome.includes('sngpc')) tags.push('sngpc');
  if (nome.includes('farmacia popular') || nome.includes('farmácia popular')) tags.push('farmacia-popular');
  if (nome.includes('devolução') || nome.includes('devolucao')) tags.push('devolução');
  if (nome.includes('boleto')) tags.push('boleto');
  if (nome.includes('convênio') || nome.includes('convenio')) tags.push('convênio');
  if (nome.includes('estoque')) tags.push('estoque');
  if (nome.includes('venda')) tags.push('venda');
  if (nome.includes('controlado')) tags.push('controlado');
  
  return tags.join(', ');
}

function limparNomeArquivo(nomeArquivo) {
  return nomeArquivo
    .replace(/\.pdf$/i, '')
    .replace(/\.docx?$/i, '')
    .replace(/\.txt$/i, '')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function importarArquivos(diretorio, subpasta = '') {
  const arquivos = fs.readdirSync(diretorio);
  let contador = 0;
  
  arquivos.forEach(arquivo => {
    const caminhoCompleto = path.join(diretorio, arquivo);
    const stats = fs.statSync(caminhoCompleto);
    
    if (stats.isDirectory()) {
      // Recursivamente importar subpastas
      console.log(`📁 Entrando na pasta: ${arquivo}`);
      importarArquivos(caminhoCompleto, arquivo);
    } else {
      // Processar apenas PDFs, DOCs e TXTs
      const ext = path.extname(arquivo).toLowerCase();
      if (['.pdf', '.doc', '.docx', '.txt'].includes(ext)) {
        const titulo = limparNomeArquivo(arquivo);
        const categoriaId = detectarCategoria(arquivo);
        const tags = extrairTags(arquivo);
        const caminhoRelativo = path.relative('PastaFaqAlex/PastaFaqAlex/Faq-Alex', caminhoCompleto);
        
        const conteudo = `📄 Documento: ${arquivo}
📂 Localização: ${caminhoRelativo}
📝 Tipo: ${ext.toUpperCase()}

${subpasta ? `Categoria: ${subpasta}\n\n` : ''}Este é um documento de referência do sistema ERP.

Para acessar o documento completo, consulte o arquivo em:
${caminhoCompleto}`;
        
        try {
          // Verificar se já existe
          const existe = db.prepare('SELECT id FROM artigos WHERE titulo = ?').get(titulo);
          
          if (!existe) {
            db.prepare(`
              INSERT INTO artigos (titulo, conteudo, categoria_id, tags, autor_id)
              VALUES (?, ?, ?, ?, 1)
            `).run(titulo, conteudo, categoriaId, tags);
            
            console.log(`✅ Importado: ${titulo}`);
            contador++;
          } else {
            console.log(`⏭️  Já existe: ${titulo}`);
          }
        } catch (erro) {
          console.error(`❌ Erro ao importar ${arquivo}:`, erro.message);
        }
      }
    }
  });
  
  return contador;
}

// Executar importação
console.log('🚀 Iniciando importação da FAQ...\n');

const pastaFaq = 'PastaFaqAlex/PastaFaqAlex/Faq-Alex';

if (!fs.existsSync(pastaFaq)) {
  console.error('❌ Pasta FAQ não encontrada:', pastaFaq);
  process.exit(1);
}

const total = importarArquivos(pastaFaq);

console.log(`\n✨ Importação concluída! ${total} artigos importados.`);

db.close();
