import './LandingPage.css';

function LandingPage({ onEnter }) {
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="header-container">
          <div className="header-logo">
            <img 
              src="/logo-farmacias-associadas.png" 
              alt="Farmácias Associadas" 
              className="logo-image"
            />
          </div>
          <nav className="header-nav">
            <a href="#inicio" className="nav-link active">Início</a>
            <a href="#recursos" className="nav-link">Recursos</a>
            <a href="#categorias" className="nav-link">Categorias</a>
            <a href="#sobre" className="nav-link">Sobre</a>
          </nav>
          <button className="btn-access" onClick={onEnter}>
            Acessar Wiki
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero" id="inicio">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-logo-container">
              <img 
                src="/logo-farmacias-associadas.png" 
                alt="Farmácias Associadas" 
                className="hero-logo-img"
              />
            </div>
            
            <h1 className="hero-title">
              Sua <span className="hero-highlight">Base de Conhecimento</span> completa para gestão farmacêutica
            </h1>
            
            <div className="hero-features">
              <div className="feature-item">✓ Documentação completa do sistema</div>
              <div className="feature-item">✓ Tutoriais passo a passo</div>
              <div className="feature-item">✓ Suporte técnico integrado</div>
              <div className="feature-item">✓ Base de conhecimento sempre atualizada</div>
            </div>
            
            <div className="hero-actions">
              <button className="btn-primary-large" onClick={onEnter}>
                Acessar Documentação →
              </button>
              <button 
                className="btn-secondary-large"
                onClick={() => window.open('https://wa.me/5511999999999?text=Olá, preciso de suporte!', '_blank')}
              >
                📞 Falar com Suporte
              </button>
            </div>
          </div>
          
          <div className="hero-image">
            <div className="illustration">
              <div className="illustration-card card-1">
                <div className="card-icon">📚</div>
                <div className="card-text">95+ Documentos</div>
              </div>
              <div className="illustration-card card-2">
                <div className="card-icon">📊</div>
                <div className="card-text">Relatórios</div>
              </div>
              <div className="illustration-card card-3">
                <div className="card-icon">⚙️</div>
                <div className="card-text">Configurações</div>
              </div>
              <div className="illustration-card card-4">
                <div className="card-icon">🔗</div>
                <div className="card-text">Integrações</div>
              </div>
              <div className="illustration-center">
                <div className="center-avatar">👩‍💼</div>
                <div className="center-text">Sua parceira digital</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="resources" id="recursos">
        <div className="resources-container">
          <div className="section-header">
            <h2 className="section-title">O que você encontra aqui</h2>
            <p className="section-subtitle">
              Recursos completos para facilitar seu trabalho diário
            </p>
          </div>

          <div className="resources-grid">
            <div className="resource-card">
              <div className="resource-icon">📚</div>
              <h3 className="resource-title">Manuais Completos</h3>
              <p className="resource-description">
                Documentação detalhada de todos os processos e funcionalidades do sistema
              </p>
            </div>

            <div className="resource-card">
              <div className="resource-icon">🎓</div>
              <h3 className="resource-title">Tutoriais Práticos</h3>
              <p className="resource-description">
                Guias passo a passo para realizar operações específicas
              </p>
            </div>

            <div className="resource-card">
              <div className="resource-icon">⚠️</div>
              <h3 className="resource-title">Solução de Problemas</h3>
              <p className="resource-description">
                Respostas rápidas para erros e problemas comuns
              </p>
            </div>

            <div className="resource-card">
              <div className="resource-icon">🔍</div>
              <h3 className="resource-title">Busca Inteligente</h3>
              <p className="resource-description">
                Encontre rapidamente o que precisa com nossa busca avançada
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories" id="categorias">
        <div className="categories-container">
          <div className="section-header">
            <h2 className="section-title">Categorias Disponíveis</h2>
            <p className="section-subtitle">
              Documentação organizada por área de atuação
            </p>
          </div>

          <div className="categories-grid">
            <div className="category-card">
              <div className="category-icon">💼</div>
              <h4 className="category-title">E-commerce</h4>
              <p className="category-desc">Integração e gestão de vendas online</p>
            </div>

            <div className="category-card">
              <div className="category-icon">📋</div>
              <h4 className="category-title">Fiscal</h4>
              <p className="category-desc">NFe, NFCe, SNGPC e documentos fiscais</p>
            </div>

            <div className="category-card">
              <div className="category-icon">⚙️</div>
              <h4 className="category-title">Sistema/ERP</h4>
              <p className="category-desc">Configurações e operações do sistema</p>
            </div>

            <div className="category-card">
              <div className="category-icon">🔗</div>
              <h4 className="category-title">Integrações</h4>
              <p className="category-desc">Conexões com sistemas externos</p>
            </div>

            <div className="category-card">
              <div className="category-icon">💾</div>
              <h4 className="category-title">Banco de Dados</h4>
              <p className="category-desc">Scripts SQL e manutenção de dados</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta" id="sobre">
        <div className="cta-container">
          <h2 className="cta-title">Pronto para começar?</h2>
          <p className="cta-subtitle">
            Acesse agora toda a documentação e melhore sua produtividade
          </p>
          <button className="btn-cta-large" onClick={onEnter}>
            Acessar Base de Conhecimento →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-logo">
            <img 
              src="/logo-farmacias-associadas.png" 
              alt="Farmácias Associadas" 
              className="footer-logo-img"
            />
          </div>
          <p className="footer-text">© 2025 Farmácias Associadas - Base de Conhecimento</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
