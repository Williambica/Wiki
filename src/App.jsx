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
  // Autenticação
  const [autenticado, setAutenticado] = useState(false);
  const [usuario, setUsuario] = useState('');

  // Estados principais
  const [showLanding, setShowLanding] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const [artigos, setArtigos] = useState([]);
  const [categoriaAtual, setCategoriaAtual] = useState(null);
  const [busca, setBusca] = useState('');
  const [artigoSelecionado, setArtigoSelecionado] = useState(null);
  const [tab, setTab] = useState('artigos');
  const [loading, setLoading] = useState(true);
  
  // Modais
  const [mostrarModalArtigo, setMostrarModalArtigo] = useState(false);
  const [mostrarModalScript, setMostrarModalScript] = useState(false);
  
  // Hooks
  const { favorites, toggleFavorite } = useFavorites();
  const { toast, showToast, hideToast } = useToast();

  // Verificar autenticação
  useEffect(() => {
    const auth = localStorage.getItem('wiki_auth');
    const user = localStorage.getItem('wiki_user');
    if (auth === 'true') {
      setAutenticado(true);
      setUsuario(user || 'Usuário');
    }
  }, []);

  useEffect(() => {
    if (autenticado) {
      carregarCategorias();
      carregarArtigos();
    }
  }, [autenticado]);

  useEffect(() => {
    if (autenticado) {
      carregarArtigos();
    }
  }, [busca, categoriaAtual, autenticado]);

  const handleLogin = () => {
    setAutenticado(true);
    setUsuario(localStorage.getItem('wiki_user') || 'Usuário');
    showToast('Login realizado com sucesso!', 'success');
  };

  const carregarCategorias = async () => {
    try {
      const response = await fetch('/api/categorias');
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
      const data = await response.json();
      setArtigos(data);
    } catch (error) {
      console.error('Erro ao carregar artigos:', error);
      showToast('Erro ao carregar artigos', 'error');
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
      showToast('Erro ao carregar artigo', 'error');
    }
  };

  const handleSalvarArtigo = async (dados) => {
    try {
      const response = await fetch('/api/artigos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
      
      if (response.ok) {
        showToast('Artigo criado com sucesso!', 'success');
        carregarArtigos();
        setMostrarModalArtigo(false);
      } else {
        throw new Error('Erro ao salvar artigo');
      }
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
        body: JSON.stringify(dados)
      });
      
      if (response.ok) {
        showToast('Script criado com sucesso!', 'success');
        setMostrarModalScript(false);
      } else {
        throw new Error('Erro ao salvar script');
      }
    } catch (error) {
      console.error('Erro ao salvar script:', error);
      showToast('Erro ao salvar script', 'error');
      throw error;
    }
  };

  // Se não autenticado, mostrar login
  if (!autenticado) {
    return <Login onLogin={handleLogin} />;
  }

  // Se autenticado mas na landing page
  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

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
                { label: tab === 'artigos' ? 'Documentos' : tab === 'favoritos' ? 'Favoritos' : tab === 'queries' ? 'Queries SQL' : 'Estatísticas' },
                ...(categoriaAtual ? [{ label: categorias.find(c => c.id === categoriaAtual)?.nome || '' }] : [])
              ]}
            />
            
            {tab !== 'estatisticas' && <SearchBar busca={busca} setBusca={setBusca} />}

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
                  <h1 className="content-title">📊 Estatísticas</h1>
                  <p className="content-subtitle">Visão geral da base de conhecimento</p>
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
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}

      <ScrollToTop />
    </div>
  );
}

export default App;
