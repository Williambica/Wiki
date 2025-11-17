import './ArticleGrid.css';

function ArticleGrid({ artigos, loading, onVisualizarArtigo, favorites, onToggleFavorite }) {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando documentos...</p>
      </div>
    );
  }

  if (artigos.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">📭</span>
        <h3>Nenhum documento encontrado</h3>
        <p>Tente ajustar os filtros ou buscar por outros termos</p>
      </div>
    );
  }

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const calcularTempoLeitura = (conteudo) => {
    const palavras = conteudo.split(/\s+/).length;
    const minutos = Math.ceil(palavras / 200); // 200 palavras por minuto
    return minutos;
  };

  const isNovo = (data) => {
    const dias = Math.floor((new Date() - new Date(data)) / (1000 * 60 * 60 * 24));
    return dias <= 7;
  };

  const isPopular = (views) => {
    return views > 50;
  };

  return (
    <div className="article-grid">
      {artigos.map((artigo) => (
        <div
          key={artigo.id}
          className="article-card fade-in"
          onClick={() => onVisualizarArtigo(artigo.id)}
        >
          <button
            className="favorite-btn"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(artigo.id);
            }}
            aria-label={favorites?.includes(artigo.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            {favorites?.includes(artigo.id) ? '⭐' : '☆'}
          </button>
          
          <div className="article-header">
            <span
              className="category-tag"
              style={{ background: artigo.categoria_cor }}
            >
              {artigo.categoria_nome}
            </span>
            <div className="article-badges">
              {isNovo(artigo.criado_em) && (
                <span className="badge badge-new">✨ Novo</span>
              )}
              {isPopular(artigo.visualizacoes) && (
                <span className="badge badge-popular">🔥 Popular</span>
              )}
            </div>
          </div>
          
          <h3 className="article-title">{artigo.titulo}</h3>
          <p className="article-preview">
            {artigo.conteudo.substring(0, 120)}...
          </p>
          
          <div className="article-meta">
            <span className="meta-item">
              <span className="meta-icon">⏱️</span>
              {calcularTempoLeitura(artigo.conteudo)} min
            </span>
            <span className="meta-item">
              <span className="meta-icon">👁️</span>
              {artigo.visualizacoes}
            </span>
            <span className="meta-item">
              <span className="meta-icon">📅</span>
              {formatarData(artigo.criado_em)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ArticleGrid;
