const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

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
  if (nome.includes('pdv')) tags.push('pdv');
  if (nome.includes('caixa')) tags.push('caixa');
  if (nome.includes('inventario') || nome.includes('inventário')) tags.push('inventário');
  
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

function criarConteudoProfissional(arquivo, caminhoRelativo, subpasta) {
  const titulo = limparNomeArquivo(arquivo);
  const ext = path.extname(arquivo).toLowerCase();
  
  let conteudo = `# ${titulo}\n\n`;
  
  if (subpasta) {
    conteudo += `**📂 Categoria:** ${subpasta}\n\n`;
  }
  
  conteudo += `**📄 Tipo de Documento:** ${ext.toUpperCase()}\n\n`;
  conteudo += `---\n\n`;
  
  // Adicionar descrição baseada no nome do arquivo
  if (titulo.toLowerCase().includes('manual')) {
    conteudo += `## 📖 Manual de Procedimento\n\n`;
    conteudo += `Este é um manual completo que contém instruções passo a passo para realizar as operações descritas.\n\n`;
  } else if (titulo.toLowerCase().includes('tutorial')) {
    conteudo += `## 🎓 Tutorial Passo a Passo\n\n`;
    conteudo += `Este tutorial fornece orientações detalhadas para executar o procedimento descrito.\n\n`;
  } else if (titulo.toLowerCase().includes('erro')) {
    conteudo += `## ⚠️ Solução de Problema\n\n`;
    conteudo += `Este documento contém a solução para o erro ou problema descrito no título.\n\n`;
  } else if (titulo.toLowerCase().includes('configuração') || titulo.toLowerCase().includes('configuracao')) {
    conteudo += `## ⚙️ Guia de Configuração\n\n`;
    conteudo += `Este guia contém as configurações necessárias para o sistema funcionar corretamente.\n\n`;
  } else if (titulo.toLowerCase().includes('relatório') || titulo.toLowerCase().includes('relatorio')) {
    conteudo += `## 📊 Emissão de Relatório\n\n`;
    conteudo += `Este documento explica como emitir e configurar o relatório descrito.\n\n`;
  }
  
  conteudo += `## 📥 Documento Original\n\n`;
  conteudo += `Para visualizar o documento completo com imagens e formatação original:\n\n`;
  conteudo += `**Localização:** \`${caminhoRelativo}\`\n\n`;
  conteudo += `---\n\n`;
  conteudo += `## 💡 Informações Adicionais\n\n`;
  
  // Adicionar informações contextuais baseadas nas tags
  const tags = extrairTags(arquivo);
  if (tags.includes('nfe') || tags.includes('nfce')) {
    conteudo += `### Notas Fiscais Eletrônicas\n\n`;
    conteudo += `Este documento trata de procedimentos relacionados a Notas Fiscais Eletrônicas (NFe/NFCe). `;
    conteudo += `Certifique-se de que o certificado digital está válido e as configurações fiscais estão corretas.\n\n`;
  }
  
  if (tags.includes('sngpc')) {
    conteudo += `### SNGPC - Produtos Controlados\n\n`;
    conteudo += `Este documento aborda o Sistema Nacional de Gerenciamento de Produtos Controlados. `;
    conteudo += `É fundamental seguir rigorosamente os procedimentos para manter a conformidade legal.\n\n`;
  }
  
  if (tags.includes('farmacia-popular')) {
    conteudo += `### Farmácia Popular\n\n`;
    conteudo += `Este documento contém procedimentos específicos do programa Farmácia Popular. `;
    conteudo += `Atenção especial deve ser dada aos requisitos e validações do programa.\n\n`;
  }
  
  if (tags.includes('devolução')) {
    conteudo += `### Devoluções\n\n`;
    conteudo += `Procedimento de devolução requer atenção aos aspectos fiscais e de estoque. `;
    conteudo += `Verifique sempre as notas fiscais relacionadas antes de prosseguir.\n\n`;
  }
  
  conteudo += `---\n\n`;
  conteudo += `*📅 Documento importado automaticamente da base de conhecimento*\n`;
  conteudo += `*📁 Arquivo: ${arquivo}*`;
  
  return conteudo;
}

function importarArquivos(diretorio, subpasta = '') {
  const arquivos = fs.readdirSync(diretorio);
  let contador = 0;
  
  arquivos.forEach(arquivo => {
    const caminhoCompleto = path.join(diretorio, arquivo);
    const stats = fs.statSync(caminhoCompleto);
    
    if (stats.isDirectory()) {
      console.log(`\n📁 Pasta: ${arquivo}`);
      contador += importarArquivos(caminhoCompleto, arquivo);
    } else {
      const ext = path.extname(arquivo).toLowerCase();
      if (['.pdf', '.doc', '.docx', '.txt'].includes(ext)) {
        const titulo = limparNomeArquivo(arquivo);
        
        // Verificar se já existe
        const existe = db.prepare('SELECT id FROM artigos WHERE titulo = ?').get(titulo);
        
        if (existe) {
          console.log(`   ⏭️  ${titulo}`);
          return;
        }
        
        const categoriaId = detectarCategoria(arquivo);
        const tags = extrairTags(arquivo);
        const caminhoRelativo = path.relative('PastaFaqAlex/PastaFaqAlex/Faq-Alex', caminhoCompleto);
        const conteudo = criarConteudoProfissional(arquivo, caminhoRelativo, subpasta);
        
        try {
          db.prepare(`
            INSERT INTO artigos (titulo, conteudo, categoria_id, tags, autor_id)
            VALUES (?, ?, ?, ?, 1)
          `).run(titulo, conteudo, categoriaId, tags);
          
          console.log(`   ✅ ${titulo}`);
          contador++;
        } catch (erro) {
          console.error(`   ❌ Erro: ${titulo}`);
        }
      }
    }
  });
  
  return contador;
}

// Executar
console.log('🚀 Importação Profissional da Base de Conhecimento\n');
console.log('═'.repeat(60));

const pastaFaq = 'PastaFaqAlex/PastaFaqAlex/Faq-Alex';

if (!fs.existsSync(pastaFaq)) {
  console.error('\n❌ Pasta não encontrada:', pastaFaq);
  process.exit(1);
}

// Limpar artigos antigos
console.log('\n🗑️  Limpando base de dados...');
db.prepare('DELETE FROM artigos').run();

console.log('\n📚 Importando documentos...\n');
const total = importarArquivos(pastaFaq);

console.log('\n' + '═'.repeat(60));
console.log(`\n✨ Concluído! ${total} documentos importados com sucesso.`);
console.log('\n💡 Acesse http://localhost:3000 para visualizar\n');

db.close();
