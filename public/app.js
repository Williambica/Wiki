let categorias = [];
let categoriaAtual = null;

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    carregarCategorias();
    carregarArtigos();
});

// Carregar categorias
async function carregarCategorias() {
    const response = await fetch('/api/categorias');
    categorias = await response.json();
    
    const categoriasDiv = document.getElementById('categorias');
    const artigoSelect = document.getElementById('artigo-categoria');
    const scriptSelect = document.getElementById('script-categoria');
    
    categorias.forEach(cat => {
        // Botões de filtro
        const btn = document.createElement('button');
        btn.className = 'categoria-btn';
        btn.textContent = cat.nome;
        btn.style.borderColor = cat.cor;
        btn.onclick = () => filtrarCategoria(cat.id);
        categoriasDiv.appendChild(btn);
        
        // Selects dos formulários
        const option1 = document.createElement('option');
        option1.value = cat.id;
        option1.textContent = cat.nome;
        artigoSelect.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = cat.id;
        option2.textContent = cat.nome;
        scriptSelect.appendChild(option2);
    });
}

// Filtrar por categoria
function filtrarCategoria(categoriaId) {
    categoriaAtual = categoriaId;
    
    // Atualizar botões ativos
    document.querySelectorAll('.categoria-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (categoriaId === null) {
        document.querySelector('.categoria-btn').classList.add('active');
    } else {
        event.target.classList.add('active');
    }
    
    carregarArtigos();
}

// Buscar artigos
function buscarArtigos() {
    carregarArtigos();
}

// Carregar artigos
async function carregarArtigos() {
    const busca = document.getElementById('busca').value;
    let url = '/api/artigos?';
    
    if (busca) url += `busca=${encodeURIComponent(busca)}&`;
    if (categoriaAtual) url += `categoria=${categoriaAtual}`;
    
    const response = await fetch(url);
    const artigos = await response.json();
    
    const lista = document.getElementById('artigos-lista');
    lista.innerHTML = '';
    
    if (artigos.length === 0) {
        lista.innerHTML = '<p style="text-align:center;color:#999;padding:40px;">Nenhum artigo encontrado</p>';
        return;
    }
    
    artigos.forEach(artigo => {
        const card = document.createElement('div');
        card.className = 'artigo-card';
        card.onclick = () => visualizarArtigo(artigo.id);
        
        const preview = artigo.conteudo.substring(0, 150) + '...';
        
        card.innerHTML = `
            <span class="categoria-tag" style="background:${artigo.categoria_cor}">${artigo.categoria_nome}</span>
            <h3>${artigo.titulo}</h3>
            <p class="preview">${preview}</p>
            <div class="meta">
                <span>👁️ ${artigo.visualizacoes} visualizações</span>
                <span>📅 ${formatarData(artigo.criado_em)}</span>
            </div>
        `;
        
        lista.appendChild(card);
    });
}

// Visualizar artigo completo
async function visualizarArtigo(id) {
    const response = await fetch(`/api/artigos/${id}`);
    const artigo = await response.json();
    
    const detalhes = document.getElementById('artigo-detalhes');
    detalhes.innerHTML = `
        <span class="categoria-tag" style="background:${artigo.categoria_cor}">${artigo.categoria_nome}</span>
        <h2 style="margin:15px 0;">${artigo.titulo}</h2>
        <div style="color:#999;font-size:0.9em;margin-bottom:20px;">
            Por ${artigo.autor_nome} • ${formatarData(artigo.criado_em)} • ${artigo.visualizacoes} visualizações
        </div>
        ${artigo.tags ? `<div style="margin-bottom:20px;">
            ${artigo.tags.split(',').map(tag => `<span style="background:#f0f0f0;padding:4px 10px;border-radius:12px;font-size:0.85em;margin-right:5px;">#${tag.trim()}</span>`).join('')}
        </div>` : ''}
        <div style="line-height:1.8;">${formatarConteudo(artigo.conteudo)}</div>
        <div style="margin-top:30px;padding-top:20px;border-top:2px solid #e0e0e0;">
            <button class="btn btn-primary" onclick="editarArtigo(${artigo.id})">✏️ Editar</button>
            <button class="btn btn-secondary" onclick="excluirArtigo(${artigo.id})" style="margin-left:10px;">🗑️ Excluir</button>
        </div>
    `;
    
    document.getElementById('modalVisualizarArtigo').style.display = 'block';
}

// Formatar conteúdo com markdown básico
function formatarConteudo(texto) {
    if (!texto) return '';
    
    // Escapar HTML
    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };
    
    // Processar linha por linha
    const linhas = texto.split('\n');
    let html = '';
    let emLista = false;
    
    for (let i = 0; i < linhas.length; i++) {
        let linha = linhas[i];
        
        // Headers
        if (linha.startsWith('### ')) {
            html += `<h3>${escapeHtml(linha.substring(4))}</h3>`;
        } else if (linha.startsWith('## ')) {
            html += `<h2>${escapeHtml(linha.substring(3))}</h2>`;
        } else if (linha.startsWith('# ')) {
            html += `<h1>${escapeHtml(linha.substring(2))}</h1>`;
        }
        // Separador
        else if (linha.trim() === '---') {
            html += '<hr>';
        }
        // Listas
        else if (linha.match(/^[\-\*] /)) {
            if (!emLista) {
                html += '<ul>';
                emLista = true;
            }
            html += `<li>${escapeHtml(linha.substring(2))}</li>`;
        }
        // Linha vazia
        else if (linha.trim() === '') {
            if (emLista) {
                html += '</ul>';
                emLista = false;
            }
            html += '<br>';
        }
        // Texto normal
        else {
            if (emLista) {
                html += '</ul>';
                emLista = false;
            }
            
            // Processar links markdown [texto](url)
            let linhaProcessada = linha;
            
            // Links
            linhaProcessada = linhaProcessada.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, texto, url) => {
                const textoEscapado = escapeHtml(texto);
                if (url.endsWith('.pdf') || url.endsWith('.doc') || url.endsWith('.docx')) {
                    return `<a href="${url}" target="_blank" class="btn-documento">${textoEscapado}</a>`;
                }
                return `<a href="${url}" target="_blank">${textoEscapado}</a>`;
            });
            
            // Escapar o resto
            linhaProcessada = linhaProcessada.replace(/([^<>]+)(?![^<]*>)/g, (match) => {
                return escapeHtml(match);
            });
            
            // Bold e código
            linhaProcessada = linhaProcessada.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
            linhaProcessada = linhaProcessada.replace(/`([^`]+)`/g, '<code>$1</code>');
            
            html += `<p>${linhaProcessada}</p>`;
        }
    }
    
    // Fechar lista se ainda estiver aberta
    if (emLista) {
        html += '</ul>';
    }
    
    return html;
}

// Editar artigo
async function editarArtigo(id) {
    const response = await fetch(`/api/artigos/${id}`);
    const artigo = await response.json();
    
    document.getElementById('artigo-id').value = artigo.id;
    document.getElementById('artigo-titulo').value = artigo.titulo;
    document.getElementById('artigo-categoria').value = artigo.categoria_id;
    document.getElementById('artigo-tags').value = artigo.tags || '';
    document.getElementById('artigo-conteudo').value = artigo.conteudo;
    
    fecharModal('modalVisualizarArtigo');
    document.getElementById('modalArtigo').style.display = 'block';
}

// Excluir artigo
async function excluirArtigo(id) {
    if (!confirm('Tem certeza que deseja excluir este artigo?')) return;
    
    await fetch(`/api/artigos/${id}`, { method: 'DELETE' });
    fecharModal('modalVisualizarArtigo');
    carregarArtigos();
    alert('Artigo excluído com sucesso!');
}

// Salvar artigo
async function salvarArtigo(event) {
    event.preventDefault();
    
    const id = document.getElementById('artigo-id').value;
    const dados = {
        titulo: document.getElementById('artigo-titulo').value,
        conteudo: document.getElementById('artigo-conteudo').value,
        categoria_id: document.getElementById('artigo-categoria').value,
        tags: document.getElementById('artigo-tags').value
    };
    
    if (id) {
        // Atualizar
        await fetch(`/api/artigos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
    } else {
        // Criar novo
        await fetch('/api/artigos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
    }
    
    fecharModal('modalArtigo');
    document.getElementById('formArtigo').reset();
    document.getElementById('artigo-id').value = '';
    carregarArtigos();
    alert('Artigo salvo com sucesso!');
}

// Carregar scripts
async function carregarScripts() {
    const response = await fetch('/api/scripts');
    const scripts = await response.json();
    
    const lista = document.getElementById('scripts-lista');
    lista.innerHTML = '';
    
    if (scripts.length === 0) {
        lista.innerHTML = '<p style="text-align:center;color:#999;padding:40px;">Nenhum script cadastrado</p>';
        return;
    }
    
    scripts.forEach(script => {
        const item = document.createElement('div');
        item.className = 'script-item';
        
        item.innerHTML = `
            <span class="categoria-tag" style="background:${script.categoria_cor}">${script.categoria_nome}</span>
            <h3>${script.titulo}</h3>
            <div class="script-meta">
                ${script.linguagem.toUpperCase()} • Por ${script.autor_nome} • ${formatarData(script.criado_em)}
            </div>
            ${script.descricao ? `<p style="color:#666;margin:10px 0;">${script.descricao}</p>` : ''}
            <pre><code>${escapeHtml(script.codigo)}</code></pre>
            <button class="btn-copiar" onclick="copiarCodigo(${script.id})">📋 Copiar Código</button>
        `;
        
        lista.appendChild(item);
    });
}

// Salvar script
async function salvarScript(event) {
    event.preventDefault();
    
    const dados = {
        titulo: document.getElementById('script-titulo').value,
        descricao: document.getElementById('script-descricao').value,
        codigo: document.getElementById('script-codigo').value,
        linguagem: document.getElementById('script-linguagem').value,
        categoria_id: document.getElementById('script-categoria').value
    };
    
    await fetch('/api/scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });
    
    fecharModal('modalScript');
    document.getElementById('formScript').reset();
    carregarScripts();
    alert('Script salvo com sucesso!');
}

// Copiar código
function copiarCodigo(id) {
    fetch(`/api/scripts`)
        .then(r => r.json())
        .then(scripts => {
            const script = scripts.find(s => s.id === id);
            navigator.clipboard.writeText(script.codigo);
            alert('Código copiado para a área de transferência!');
        });
}

// Carregar estatísticas
async function carregarEstatisticas() {
    const response = await fetch('/api/estatisticas');
    const stats = await response.json();
    
    const container = document.getElementById('estatisticas');
    container.innerHTML = `
        <div class="stat-card">
            <h3>${stats.total_artigos}</h3>
            <p>Artigos Publicados</p>
        </div>
        <div class="stat-card">
            <h3>${stats.total_scripts}</h3>
            <p>Scripts Disponíveis</p>
        </div>
        <div class="stat-list">
            <h3>📊 Artigos Mais Populares</h3>
            <ul>
                ${stats.artigos_populares.map(a => `
                    <li onclick="visualizarArtigo(${a.id})" style="cursor:pointer;">
                        ${a.titulo} <span style="float:right;color:#999;">${a.visualizacoes} views</span>
                    </li>
                `).join('')}
            </ul>
        </div>
        <div class="stat-list">
            <h3>🆕 Artigos Recentes</h3>
            <ul>
                ${stats.artigos_recentes.map(a => `
                    <li onclick="visualizarArtigo(${a.id})" style="cursor:pointer;">
                        ${a.titulo} <span style="float:right;color:#999;">${formatarData(a.criado_em)}</span>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
}

// Mudar tab
function mudarTab(tab) {
    // Atualizar botões
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    // Atualizar conteúdo
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(`conteudo-${tab}`).classList.add('active');
    
    // Carregar dados
    if (tab === 'scripts') carregarScripts();
    if (tab === 'estatisticas') carregarEstatisticas();
}

// Modais
function mostrarModalNovoArtigo() {
    document.getElementById('formArtigo').reset();
    document.getElementById('artigo-id').value = '';
    document.getElementById('modalArtigo').style.display = 'block';
}

function mostrarModalNovoScript() {
    document.getElementById('formScript').reset();
    document.getElementById('modalScript').style.display = 'block';
}

function fecharModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Utilitários
function formatarData(data) {
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR');
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
