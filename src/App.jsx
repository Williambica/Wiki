import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import ArticleGrid from './components/ArticleGrid';
import ArticleModal from './components/ArticleModal';
import Stats from './components/Stats';
import Breadcrumbs from './components/Breadcrumbs';
import ScrollToTop from './components/ScrollToTop';
import { useFavorites } from './hooks/useFavorites';
import './App.css';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const [artigos, setArtigos] = useState([]);
  const [categoriaAtual, setCategoriaAtual] = useState(null);
  const [busca, setBusca] = useState('');
  const [artigoSelecionado, setArtigoSelecionado] = useState(null);
  const [tab, setTab] = useState('artigos');
  const [loading, setLoading] = useState(true);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    carregarCategorias();
    carregarArtigos();
  }, []);

  useEffect(() => {
    carregarArtigos();
  }, [busca, categoriaAtual]);

  const carregarCategorias = async () => {
    try {
      const response = await fetch('/api/categorias');
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const carregarArtigos = async () => {
    setLoading(true);
    try {
      let url = '/api/artigos?';
      if (busca) url += `busca=${encodeURIComponent(busca)}&`;
      if (categoriaAtual) url += `categoria=${categoriaAtual}`;
      
      const response = await fetch(url);
      const data = await response.json();
      setArtigos(data);
    } catch (error) {
      console.error('Erro ao carregar artigos:', error);
    } finally {
      setLoading(false);
    }
  };

  const visualizarArtigo = async (id) => {
    try {
      const response = await fetch(`/api/artigos/${id}`);
      const data = await response.json();
      setArtigoSelecionado(data);
    } catch (error) {
      console.error('Erro ao carregar artigo:', error);
    }
  };

  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  return (
    <div className="app">
      <Header onBackToHome={() => setShowLanding(true)} />
      
      <div className="wiki-layout">
        {/* Sidebar */}
        <aside className="wiki-sidebar">
          <div className="sidebar-content">
            <div className="sidebar-section">
              <h3 className="sidebar-title">📚 Navegação</h3>
              <nav className="sidebar-nav">
                <button
                  className={`sidebar-link ${tab === 'artigos' ? 'active' : ''}`}
                  onClick={() => setTab('artigos')}
                >
                  <span className="link-icon">📄</span>
                  <span>Todos os Artigos</span>
                </button>
                <button
                  className={`sidebar-link ${tab === 'favoritos' ? 'active' : ''}`}
                  onClick={() => setTab('favoritos')}
                >
                  <span className="link-icon">⭐</span>
                  <span>Favoritos</span>
                  {favorites.length > 0 && (
                    <span className="link-count">{favorites.length}</span>
                  )}
                </button>
                <button
                  className={`sidebar-link ${tab === 'queries' ? 'active' : ''}`}
                  onClick={() => { setTab('queries'); setCategoriaAtual(6); }}
                >
                  <span className="link-icon">💾</span>
                  <span>Queries SQL</span>
                </button>
                <button
                  className={`sidebar-link ${tab === 'estatisticas' ? 'active' : ''}`}
                  onClick={() => setTab('estatisticas')}
                >
                  <span className="link-icon">📊</span>
                  <span>Estatísticas</span>
                </button>
              </nav>
            </div>

            <div className="sidebar-section">
              <h3 className="sidebar-title">🗂️ Categorias</h3>
              <nav className="sidebar-nav">
                <button
                  className={`sidebar-link ${categoriaAtual === null ? 'active' : ''}`}
                  onClick={() => setCategoriaAtual(null)}
                >
                  <span className="link-icon">📋</span>
                  <span>Todas</span>
                  <span className="link-count">{artigos.length}</span>
                </button>
                {categorias.map((cat) => (
                  <button
                    key={cat.id}
                    className={`sidebar-link ${categoriaAtual === cat.id ? 'active' : ''}`}
                    onClick={() => setCategoriaAtual(cat.id)}
                  >
                    <span className="link-icon">•</span>
                    <span>{cat.nome}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="sidebar-section">
              <h3 className="sidebar-title">ℹ️ Informações</h3>
              <div className="sidebar-info">
                <div className="info-item">
                  <span className="info-label">Total de Artigos:</span>
                  <span className="info-value">{artigos.length}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Categorias:</span>
                  <span className="info-value">{categorias.length}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="wiki-main">
          <div className="wiki-content">
            <Breadcrumbs 
              items={[
                { label: 'Início', onClick: () => setShowLanding(true) },
                { label: tab === 'artigos' ? 'Documentos' : 'Estatísticas' },
                ...(categoriaAtual ? [{ label: categorias.find(c => c.id === categoriaAtual)?.nome || '' }] : [])
              ]}
            />
            
            <SearchBar busca={busca} setBusca={setBusca} />

            {tab === 'artigos' && (
              <>
                <div className="content-header">
                  <h1 className="content-title">
                    {categoriaAtual 
                      ? categorias.find(c => c.id === categoriaAtual)?.nome 
                      : 'Todos os Artigos'}
                  </h1>
                  <p className="content-subtitle">
                    {artigos.length} {artigos.length === 1 ? 'artigo encontrado' : 'artigos encontrados'}
                  </p>
                </div>

                <ArticleGrid
                  artigos={artigos}
                  loading={loading}
                  onVisualizarArtigo={visualizarArtigo}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                />
              </>
            )}

            {tab === 'favoritos' && (
              <>
                <div className="content-header">
                  <h1 className="content-title">⭐ Meus Favoritos</h1>
                  <p className="content-subtitle">
                    {favorites.length} {favorites.length === 1 ? 'artigo favoritado' : 'artigos favoritados'}
                  </p>
                </div>

                <ArticleGrid
                  artigos={artigos.filter(a => favorites.includes(a.id))}
                  loading={loading}
                  onVisualizarArtigo={visualizarArtigo}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                />
              </>
            )}

            {tab === 'queries' && (
              <>
                <div className="content-header">
                  <h1 className="content-title">💾 Queries SQL</h1>
                  <p className="content-subtitle">
                    Comandos e queries SQL úteis para manutenção do sistema
                  </p>
                </div>

                <ArticleGrid
                  artigos={artigos.filter(a => a.categoria_id === 6)}
                  loading={loading}
                  onVisualizarArtigo={visualizarArtigo}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                />
              </>
            )}

            {tab === 'estatisticas' && (
              <>
                <div className="content-header">
                  <h1 className="content-title">Estatísticas</h1>
                  <p className="content-subtitle">Visão geral da base de conhecimento</p>
                </div>
                <Stats />
              </>
            )}
          </div>
        </main>
      </div>

      {artigoSelecionado && (
        <ArticleModal
          artigo={artigoSelecionado}
          onClose={() => setArtigoSelecionado(null)}
        />
      )}

      <ScrollToTop />
    </div>
  );
}

export default App;
