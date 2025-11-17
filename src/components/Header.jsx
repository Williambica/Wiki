import './Header.css';

function Header({ onBackToHome }) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo" onClick={onBackToHome} style={{ cursor: 'pointer' }}>
              <img 
                src="/logo-farmacias-associadas.png" 
                alt="Farmácias Associadas" 
                className="logo-img"
              />
            </div>
          </div>
          <div className="header-actions">
            <button className="btn-header btn-outline" onClick={onBackToHome}>
              <span>🏠</span> Início
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
