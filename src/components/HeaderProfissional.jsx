import { useState } from 'react';
import './HeaderProfissional.css';

function HeaderProfissional({ onNovoArtigo, onNovoScript, usuario }) {
  const [menuAberto, setMenuAberto] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('wiki_auth');
    localStorage.removeItem('wiki_user');
    window.location.reload();
  };

  return (
    <header className="header-pro">
      <div className="header-pro-container">
        <div className="header-pro-left">
          <div className="logo-badge">
            <span className="logo-icon">📚</span>
          </div>
          <div className="logo-text">
            <h1>Base de Conhecimento</h1>
            <p>Farmácias Associadas</p>
          </div>
        </div>
        
        <div className="header-pro-right">
          <button className="btn-pro btn-primary-pro" onClick={onNovoArtigo}>
            <span>📄</span>
            Novo Artigo
          </button>
          <button className="btn-pro btn-secondary-pro" onClick={onNovoScript}>
            <span>💻</span>
            Novo Script
          </button>
          
          <div className="user-menu-pro">
            <button 
              className="user-button-pro"
              onClick={() => setMenuAberto(!menuAberto)}
            >
              <div className="user-avatar-pro">
                {(usuario || 'A').charAt(0).toUpperCase()}
              </div>
              <span className="user-name-pro">{usuario || 'Usuário'}</span>
              <span className="dropdown-icon-pro">▼</span>
            </button>
            
            {menuAberto && (
              <div className="user-dropdown-pro">
                <div className="dropdown-header-pro">
                  <div className="user-avatar-large-pro">
                    {(usuario || 'A').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="dropdown-user-pro">{usuario || 'Usuário'}</div>
                    <div className="dropdown-role-pro">Administrador</div>
                  </div>
                </div>
                <button className="dropdown-item-pro" onClick={handleLogout}>
                  <span>🚪</span>
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default HeaderProfissional;
