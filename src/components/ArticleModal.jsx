import { useEffect } from 'react';
import './ArticleModal.css';

function ArticleModal({ artigo, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarConteudo = (texto) => {
    if (!texto) return '';

    const linhas = texto.split('\n');
    let html = '';
    let emLista = false;

    for (let linha of linhas) {
      if (linha.startsWith('### ')) {
        html += `<h3>${linha.substring(4)}</h3>`;
      } else if (linha.startsWith('## ')) {
        html += `<h2>${linha.substring(3)}</h2>`;
      } else if (linha.startsWith('# ')) {
        html += `<h1>${linha.substring(2)}</h1>`;
      } else if (linha.trim() === '---') {
        html += '<hr>';
      } else if (linha.match(/^[\-\*] /)) {
        if (!emLista) {
          html += '<ul>';
          emLista = true;
        }
        html += `<li>${linha.substring(2)}</li>`;
      } else if (linha.trim() === '') {
        if (emLista) {
          html += '</ul>';
          emLista = false;
        }
        html += '<br>';
      } else {
        if (emLista) {
          html += '</ul>';
          emLista = false;
        }

        // Processar links markdown
        linha = linha.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, texto, url) => {
          if (url.match(/\.(pdf|doc|docx)$/i)) {
            return `<a href="${url}" target="_blank" class="btn-documento">${texto}</a>`;
          }
          return `<a href="${url}" target="_blank">${texto}</a>`;
        });

        // Bold e código
        linha = linha.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        linha = linha.replace(/`([^`]+)`/g, '<code>$1</code>');

        html += `<p>${linha}</p>`;
      }
    }

    if (emLista) html += '</ul>';
    return html;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="modal-header">
          <span
            className="category-tag-large"
            style={{ background: artigo.categoria_cor }}
          >
            {artigo.categoria_nome}
          </span>
          <h2 className="modal-title">{artigo.titulo}</h2>
          <div className="modal-meta">
            <span>Por {artigo.autor_nome}</span>
            <span>•</span>
            <span>{formatarData(artigo.criado_em)}</span>
            <span>•</span>
            <span>{artigo.visualizacoes} visualizações</span>
          </div>
          {artigo.tags && (
            <div className="tags-container">
              {artigo.tags.split(',').map((tag, index) => (
                <span key={index} className="tag">
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        <div
          className="modal-body"
          dangerouslySetInnerHTML={{ __html: formatarConteudo(artigo.conteudo) }}
        />
      </div>
    </div>
  );
}

export default ArticleModal;
