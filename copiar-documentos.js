const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const db = new Database('conhecimento.db');

// Adicionar coluna para caminho do arquivo se não existir
try {
    db.exec(`ALTER TABLE artigos ADD COLUMN arquivo_path TEXT`);
    console.log('✅ Coluna arquivo_path adicionada');
} catch (erro) {
    // Coluna já existe
}

function detectarCategoria(nomeArquivo) {
    const nome = nomeArquivo.toLowerCase();
    
    if (nome.includes('nfe') || nome.includes('nfce') || nome.includes('nfse') || nome.includes('fiscal')) {
        return 2;
    }
    if (nome.includes('relatorio') || nome.includes('relatório')) {
        return 3;
    }
    if (nome.includes('cadastro')) {
        return 3;
    }
    if (nome.includes('sngpc') || nome.includes('controlado')) {
        return 2;
    }
    if (nome.includes('farmacia popular') || nome.includes('farmácia popular') || nome.includes('_fp')) {
        return 3;
    }
    if (nome.includes('integra') || nome.includes('sincxml') || nome.includes('vidalink') || nome.includes('pharmalink')) {
        return 4;
    }
    if (nome.includes('sql') || nome.includes('banco') || nome.includes('dbeaver')) {
        return 5;
    }
    
    return 3;
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

function criarConteudoComLink(arquivo, subpasta, arquivoWeb) {
    const titulo = limparNomeArquivo(arquivo);
    const ext = path.extname(arquivo).toLowerCase();
    
    let conteudo = `# ${titulo}\n\n`;
    
    if (subpasta) {
        conteudo += `**📂 Categoria:** ${subpasta}\n\n`;
    }
    
    conteudo += `**📄 Tipo:** ${ext.toUpperCase()}\n\n`;
    conteudo += `---\n\n`;
    
    // Adicionar descrição baseada no tipo
    if (titulo.toLowerCase().includes('manual')) {
        conteudo += `## 📖 Manual de Procedimento\n\n`;
        conteudo += `Este manual contém instruções detalhadas passo a passo.\n\n`;
    } else if (titulo.toLowerCase().includes('tutorial')) {
        conteudo += `## 🎓 Tutorial\n\n`;
        conteudo += `Tutorial com orientações práticas para executar o procedimento.\n\n`;
    } else if (titulo.toLowerCase().includes('erro')) {
        conteudo += `## ⚠️ Solução de Problema\n\n`;
        conteudo += `Documento com a solução para o erro descrito.\n\n`;
    } else if (titulo.toLowerCase().includes('configuração') || titulo.toLowerCase().includes('configuracao')) {
        conteudo += `## ⚙️ Guia de Configuração\n\n`;
        conteudo += `Guia com as configurações necessárias do sistema.\n\n`;
    } else if (titulo.toLowerCase().includes('relatório') || titulo.toLowerCase().includes('relatorio')) {
        conteudo += `## 📊 Emissão de Relatório\n\n`;
        conteudo += `Instruções para emitir e configurar relatórios.\n\n`;
    }
    
    conteudo += `## 📥 Visualizar Documento\n\n`;
    conteudo += `[📄 Abrir Documento (${ext.toUpperCase()})](${arquivoWeb})\n\n`;
    conteudo += `[⬇️ Baixar Documento](${arquivoWeb})\n\n`;
    conteudo += `---\n\n`;
    
    // Informações contextuais
    const tags = extrairTags(arquivo);
    if (tags.includes('nfe') || tags.includes('nfce')) {
        conteudo += `### 📋 Notas Fiscais Eletrônicas\n\n`;
        conteudo += `Procedimentos relacionados a NFe/NFCe. Certifique-se de que o certificado digital está válido.\n\n`;
    }
    
    if (tags.includes('sngpc')) {
        conteudo += `### 💊 SNGPC - Produtos Controlados\n\n`;
        conteudo += `Sistema Nacional de Gerenciamento de Produtos Controlados. Siga rigorosamente os procedimentos.\n\n`;
    }
    
    if (tags.includes('farmacia-popular')) {
        conteudo += `### 🏥 Farmácia Popular\n\n`;
        conteudo += `Procedimentos específicos do programa Farmácia Popular.\n\n`;
    }
    
    return conteudo;
}

function copiarArquivos(diretorio, subpasta = '') {
    const arquivos = fs.readdirSync(diretorio);
    let contador = 0;
    
    arquivos.forEach(arquivo => {
        const caminhoCompleto = path.join(diretorio, arquivo);
        const stats = fs.statSync(caminhoCompleto);
        
        if (stats.isDirectory()) {
            console.log(`\n📁 ${arquivo}`);
            contador += copiarArquivos(caminhoCompleto, arquivo);
        } else {
            const ext = path.extname(arquivo).toLowerCase();
            if (['.pdf', '.doc', '.docx'].includes(ext)) {
                const titulo = limparNomeArquivo(arquivo);
                
                // Criar nome de arquivo seguro para web
                const nomeArquivoWeb = arquivo
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
                    .replace(/[^a-zA-Z0-9.-]/g, '_');
                
                const destino = path.join('public', 'documentos', nomeArquivoWeb);
                const arquivoWeb = `/documentos/${nomeArquivoWeb}`;
                
                // Copiar arquivo
                try {
                    fs.copyFileSync(caminhoCompleto, destino);
                    
                    // Verificar se já existe no banco
                    const existe = db.prepare('SELECT id FROM artigos WHERE titulo = ?').get(titulo);
                    
                    const categoriaId = detectarCategoria(arquivo);
                    const tags = extrairTags(arquivo);
                    const conteudo = criarConteudoComLink(arquivo, subpasta, arquivoWeb);
                    
                    if (existe) {
                        // Atualizar
                        db.prepare(`
                            UPDATE artigos 
                            SET conteudo = ?, arquivo_path = ?, categoria_id = ?, tags = ?
                            WHERE id = ?
                        `).run(conteudo, arquivoWeb, categoriaId, tags, existe.id);
                        console.log(`   ✅ ${titulo}`);
                    } else {
                        // Inserir novo
                        db.prepare(`
                            INSERT INTO artigos (titulo, conteudo, categoria_id, tags, autor_id, arquivo_path)
                            VALUES (?, ?, ?, ?, 1, ?)
                        `).run(titulo, conteudo, categoriaId, tags, arquivoWeb);
                        console.log(`   ✅ ${titulo}`);
                    }
                    
                    contador++;
                } catch (erro) {
                    console.error(`   ❌ Erro: ${titulo} - ${erro.message}`);
                }
            }
        }
    });
    
    return contador;
}

// Executar
console.log('🚀 Copiando Documentos para o Site\n');
console.log('═'.repeat(60));

const pastaFaq = 'PastaFaqAlex/PastaFaqAlex/Faq-Alex';

if (!fs.existsSync(pastaFaq)) {
    console.error('\n❌ Pasta não encontrada:', pastaFaq);
    process.exit(1);
}

// Limpar pasta de documentos
const pastaDoc = path.join('public', 'documentos');
if (fs.existsSync(pastaDoc)) {
    const arquivosAntigos = fs.readdirSync(pastaDoc);
    arquivosAntigos.forEach(f => {
        fs.unlinkSync(path.join(pastaDoc, f));
    });
}

// Limpar artigos antigos
console.log('\n🗑️  Limpando base de dados...');
db.prepare('DELETE FROM artigos').run();

console.log('\n📚 Copiando e importando documentos...\n');
const total = copiarArquivos(pastaFaq);

console.log('\n' + '═'.repeat(60));
console.log(`\n✨ Concluído! ${total} documentos disponibilizados.`);
console.log('\n💡 Acesse http://localhost:3000 para visualizar\n');

db.close();
