import { useState, useEffect } from 'react';
import './Stats.css';

function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  const carregarEstatisticas = async () => {
    try {
      const response = await fetch('/api/estatisticas');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando estatísticas...</p>
      </div>
    );
  }

  if (!stats) {
    return <div className="empty-state">Erro ao carregar estatísticas</div>;
  }

  return (
    <div className="stats-container">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.total_artigos}</h3>
            <p className="stat-label">Documentos</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💻</div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.total_scripts}</h3>
            <p className="stat-label">Scripts</p>
          </div>
        </div>
      </div>

      <div className="stats-lists">
        <div className="stat-list-card">
          <h3 className="list-title">📊 Documentos Mais Acessados</h3>
          <ul className="stat-list">
            {stats.artigos_populares.map((artigo) => (
              <li key={artigo.id} className="stat-list-item">
                <span className="list-item-title">{artigo.titulo}</span>
                <span className="list-item-value">{artigo.visualizacoes} views</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="stat-list-card">
          <h3 className="list-title">🆕 Documentos Recentes</h3>
          <ul className="stat-list">
            {stats.artigos_recentes.map((artigo) => (
              <li key={artigo.id} className="stat-list-item">
                <span className="list-item-title">{artigo.titulo}</span>
                <span className="list-item-value">
                  {new Date(artigo.criado_em).toLocaleDateString('pt-BR')}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Stats;
