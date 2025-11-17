import { useState, useEffect } from 'react';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import HeaderProfissional from './components/HeaderProfissional';
import SearchBar from './components/SearchBar';
import ArticleGrid from './components/ArticleGrid';
import ArticleModal from './components/ArticleModal';
import ModalNovoArtigo from './components/ModalNovoArtigo';
import ModalNovoScript from './components/ModalNovoScript';
import Stats from './components/Stats';
import Breadcrumbs from './components/Breadcrumbs';
import ScrollToTop from './components/ScrollToTop';
import Toast from './components/Toast';
import { useFavorites } from './hooks/useFavorites';
import { useToast } from './hooks/useToast';
import './App.css';

function App() {
  // Estados de autenticação
  const [autenticado, setAutenticado] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [showLanding, setShowLanding] = useState(true);

  // Estados de dados
  const [categorias, setCategorias] = useState([]);
  const [artigos, setArtigos] = useState([]);
  const [categoriaAtual, setCategoriaAtual] = useState(null);
  const [busca, setBusca] = useState('');
  const [artigoSelecionado, setArtigoSelecionado] = useState(null);
  const [tab, setTab] = useState('artigos');
  const [loading, setLoading] = useState(false);

  // Estados de modais
  const [mostrarModalArtigo, setMostrarModalArtigo] = useState(false);
  const [mostrarModalScript, setMostrarModalScript] = useState(false);

  // Hooks customizados
  const { favorites, toggleFavorite } = useFavorites();
  const { toast, showToast, hideToast } = useToast();

  // Limpar autenticação ao iniciar (sempre pedir login)
  useEffect(() => {
    localStorage.removeItem('wiki_auth');
    localStorage.removeItem('wiki_user');
  }, []);

  // Carregar dados quando autenticado
  useEffect(() => {
    if (autenticado && !showLanding) {
      carregarCategorias();
      carregarArtigos();
    }
  }, [autenticado, showLanding]);

  // Recarregar artigos quando busca ou categoria mudar
  useEffect(() => {
    if (autenticado && !showLanding) {
      carregarArtigos();
    }
  }, [busca, categoriaAtual]);

  // Funções de API
  const carregarCategorias = async () => {
    try {
      const response = await fetch('/api/categorias');
      if (!response.ok) throw new Error('Erro ao carregar categorias');
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      showToast('Erro ao carregar categorias', 'error');
    }
  };

  const carregarArtigos = async () => {
    setLoading(true);
    try {
      let url = '/api/artigos?';
      if (busca) url += `busca=${encodeURIComponent(busca)}&`;
      if (categoriaAtual) url += `categoria=${categoriaAtual}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Erro ao carregar artigos');
      const data = await response.json();
      
      // A API pode retornar { artigos: [...], pagination: {...} } ou array direto
      if (data.artigos && Array.isArray(data.artigos)) {
        setArtigos(data.artigos);
      } else if (Array.isArray(data)) {
        setArtigos(data);
      } else {
        setArtigos([]);
      }
    } catch (error) {
      console.error('Erro ao carregar artigos:', error);
      showToast('Erro ao carregar artigos', 'error');
      setArtigos([]);
    } finally {
      setLoading(false);
    }
  };

  const visualizarArtigo = async (id) => {
    try {
      const response = await fetch(`/api/artigos/${id}`);
      if (!response.ok) throw new Error('Erro ao carregar artigo');
      const data = await response.json();
      setArtigoSelecionado(data);
    } catch (error) {
      console.error('Erro ao carregar artigo:', error);
      showToast('Erro ao carregar artigo', 'error');
    }
  };

  const handleSalvarArtigo = async (dados) => {
    try {
      const response = await fetch('/api/artigos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });

      if (!response.ok) throw new Error('Erro ao salvar artigo');

      showToast('Artigo criado com sucesso!', 'success');
      await carregarArtigos();
      setMostrarModalArtigo(false);
    } catch (error) {
      console.error('Erro ao salvar artigo:', error);
      showToast('Erro ao salvar artigo', 'error');
      throw error;
    }
  };

  const handleSalvarScript = async (dados) => {
    try {
      const response = await fetch('/api/scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });

      if (!response.ok) throw new Error('Erro ao salvar script');

      showToast('Script criado com sucesso!', 'success');
      setMostrarModalScript(false);
    } catch (error) {
      console.error('Erro ao salvar script:', error);
      showToast('Erro ao salvar script', 'error');
      throw error;
    }
  };

  // Handlers de navegação
  const handleLogin = () => {
    const user = localStorage.getItem('wiki_user') || 'Usuário';
    setAutenticado(true);
    setUsuario(user);
    showToast(`Bem-vindo, ${user}!`, 'success');
  };

  const handleEntrarWiki = () => {
    setShowLanding(false);
  };

  const handleVoltarHome = () => {
    setShowLanding(true);
  };

  // Renderização condicional
  if (!autenticado) {
    return <Login onLogin={handleLogin} />;
  }

  if (showLanding) {
    return <LandingPage onEnter={handleEntrarWiki} />;
  }

  // Página principal da Wiki
  return (
    <div className="app">
      <HeaderProfissional
        onNovoArtigo={() => setMostrarModalArtigo(true)}
        onNovoScript={() => setMostrarModalScript(true)}
        usuario={usuario}
      />

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
                  onClick={() => {
                    setTab('queries');
                    setCategoriaAtual(6);
                  }}
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
                { label: 'Início', onClick: handleVoltarHome },
                {
                  label:
                    tab === 'artigos'
                      ? 'Documentos'
                      : tab === 'favoritos'
                      ? 'Favoritos'
                      : tab === 'queries'
                      ? 'Queries SQL'
                      : 'Estatísticas',
                },
                ...(categoriaAtual
                  ? [
                      {
                        label:
                          categorias.find((c) => c.id === categoriaAtual)
                            ?.nome || '',
                      },
                    ]
                  : []),
              ]}
            />

            {tab !== 'estatisticas' && (
              <SearchBar busca={busca} setBusca={setBusca} />
            )}

            {tab === 'artigos' && (
              <>
                <div className="content-header">
                  <h1 className="content-title">
                    {categoriaAtual
                      ? categorias.find((c) => c.id === categoriaAtual)?.nome
                      : 'Todos os Artigos'}
                  </h1>
                  <p className="content-subtitle">
                    {artigos.length}{' '}
                    {artigos.length === 1
                      ? 'artigo encontrado'
                      : 'artigos encontrados'}
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
                    {favorites.length}{' '}
                    {favorites.length === 1
                      ? 'artigo favoritado'
                      : 'artigos favoritados'}
                  </p>
                </div>

                <ArticleGrid
                  artigos={artigos.filter((a) => favorites.includes(a.id))}
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
                  artigos={artigos.filter((a) => a.categoria_id === 6)}
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
                  <h1 className="content-title">📊 Estatísticas</h1>
                  <p className="content-subtitle">
                    Visão geral da base de conhecimento
                  </p>
                </div>
                <Stats />
              </>
            )}
          </div>
        </main>
      </div>

      {/* Modais */}
      {artigoSelecionado && (
        <ArticleModal
          artigo={artigoSelecionado}
          onClose={() => setArtigoSelecionado(null)}
        />
      )}

      {mostrarModalArtigo && (
        <ModalNovoArtigo
          onClose={() => setMostrarModalArtigo(false)}
          onSalvar={handleSalvarArtigo}
          categorias={categorias}
        />
      )}

      {mostrarModalScript && (
        <ModalNovoScript
          onClose={() => setMostrarModalScript(false)}
          onSalvar={handleSalvarScript}
          categorias={categorias}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <ScrollToTop />
    </div>
  );
}

export default App;
