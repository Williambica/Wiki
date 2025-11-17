const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const pdf = require('pdf-parse');

const db = new Database('conhecimento.db');

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

function extrairTags(nomeArquivo, conteudo = '') {
  const tags = [];
  const texto = (nomeArquivo + ' ' + conteudo).toLowerCase();
  
  if (texto.includes('nfe')) tags.push('nfe');
  if (texto.includes('nfce')) tags.push('nfce');
  if (texto.includes('nfse')) tags.push('nfse');
  if (texto.includes('erro')) tags.push('erro');
  if (texto.includes('tutorial')) tags.push('tutorial');
  if (texto.includes('manual')) tags.push('manual');
  if (texto.includes('configuração') || texto.includes('configuracao')) tags.push('configuração');
  if (texto.includes('cadastro')) tags.push('cadastro');
  if (texto.includes('relatório') || texto.includes('relatorio')) tags.push('relatório');
  if (texto.includes('sngpc')) tags.push('sngpc');
  if (texto.includes('farmacia popular') || texto.includes('farmácia popular')) tags.push('farmacia-popular');
  if (texto.includes('devolução') || texto.includes('devolucao')) tags.push('devolução');
  if (texto.includes('boleto')) tags.push('boleto');
  if (texto.includes('convênio') || texto.includes('convenio')) tags.push('convênio');
  if (texto.includes('estoque')) tags.push('estoque');
  if (texto.includes('venda')) tags.push('venda');
  if (texto.includes('controlado')) tags.push('controlado');
  if (texto.includes('pdv')) tags.push('pdv');
  if (texto.includes('caixa')) tags.push('caixa');
  
  return [...new Set(tags)].join(', ');
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

function limparTexto(texto) {
  return texto
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s+/g, ' ')
    .replace(/\n /g, '\n')
    .trim();
}

async function extrairTextoPDF(caminhoArquivo) {
  try {
    const dataBuffer = fs.readFileSync(caminhoArquivo);
    const data = await pdf(dataBuffer);
    return limparTexto(data.text);
  } catch (erro) {
    console.error(`   ⚠️  Erro ao ler PDF: ${erro.message}`);
    return null;
  }
}

function lerTextoSimples(caminhoArquivo) {
  try {
    return fs.readFileSync(caminhoArquivo, 'utf8');
  } catch (erro) {
    console.error(`   ⚠️  Erro ao ler arquivo: ${erro.message}`);
    return null;
  }
}

async function importarArquivos(diretorio, subpasta = '') {
  const arquivos = fs.readdirSync(diretorio);
  let contador = 0;
  
  for (const arquivo of arquivos) {
    const caminhoCompleto = path.join(diretorio, arquivo);
    const stats = fs.statSync(caminhoCompleto);
    
    if (stats.isDirectory()) {
      console.log(`\n📁 Entrando na pasta: ${arquivo}`);
      contador += await importarArquivos(caminhoCompleto, arquivo);
    } else {
      const ext = path.extname(arquivo).toLowerCase();
      if (['.pdf', '.txt', '.doc', '.docx'].includes(ext)) {
        const titulo = limparNomeArquivo(arquivo);
        
        // Verificar se já existe
        const existe = db.prepare('SELECT id FROM artigos WHERE titulo = ?').get(titulo);
        
        if (existe) {
          console.log(`⏭️  Já existe: ${titulo}`);
          continue;
        }
        
        console.log(`📄 Processando: ${arquivo}`);
        
        let conteudo = '';
        
        // Extrair conteúdo baseado no tipo
        if (ext === '.pdf') {
          conteudo = await extrairTextoPDF(caminhoCompleto);
        } else if (ext === '.txt') {
          conteudo = lerTextoSimples(caminhoCompleto);
        } else {
          conteudo = `Este é um documento ${ext.toUpperCase()} que requer software específico para visualização.`;
        }
        
        if (!conteudo || conteudo.length < 50) {
          conteudo = `📄 ${titulo}

Este documento está disponível no formato ${ext.toUpperCase()}.

${subpasta ? `Categoria: ${subpasta}\n` : ''}
Para visualizar o conteúdo completo, consulte o arquivo original em:
${caminhoCompleto}`;
        } else {
          // Adicionar cabeçalho ao conteúdo extraído
          conteudo = `# ${titulo}

${subpasta ? `**Categoria:** ${subpasta}\n` : ''}
---

${conteudo}

---
*Documento extraído automaticamente de: ${arquivo}*`;
        }
        
        const categoriaId = detectarCategoria(arquivo);
        const tags = extrairTags(arquivo, conteudo);
        
        try {
          db.prepare(`
            INSERT INTO artigos (titulo, conteudo, categoria_id, tags, autor_id)
            VALUES (?, ?, ?, ?, 1)
          `).run(titulo, conteudo, categoriaId, tags);
          
          console.log(`   ✅ Importado com sucesso!`);
          contador++;
        } catch (erro) {
          console.error(`   ❌ Erro ao salvar: ${erro.message}`);
        }
      }
    }
  }
  
  return contador;
}

// Executar importação
(async () => {
  console.log('🚀 Iniciando importação completa da FAQ...\n');
  console.log('📖 Extraindo conteúdo dos PDFs (pode demorar alguns minutos)...\n');
  
  const pastaFaq = 'PastaFaqAlex/PastaFaqAlex/Faq-Alex';
  
  if (!fs.existsSync(pastaFaq)) {
    console.error('❌ Pasta FAQ não encontrada:', pastaFaq);
    process.exit(1);
  }
  
  // Limpar artigos antigos (opcional)
  const resposta = 'sim'; // Você pode mudar para 'nao' se quiser manter os antigos
  if (resposta === 'sim') {
    console.log('🗑️  Limpando artigos antigos...\n');
    db.prepare('DELETE FROM artigos').run();
  }
  
  const total = await importarArquivos(pastaFaq);
  
  console.log(`\n✨ Importação concluída!`);
  console.log(`📊 Total: ${total} artigos importados com conteúdo completo.`);
  
  db.close();
})();
