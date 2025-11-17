import { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    // Validação simples (você pode melhorar com API)
    if (usuario === 'associadas' && senha === '2003') {
      localStorage.setItem('wiki_auth', 'true');
      localStorage.setItem('wiki_user', usuario);
      onLogin();
    } else {
      setErro('Usuário ou senha incorretos');
    }
    
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-shape"></div>
        <div className="login-shape"></div>
      </div>
      
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <span className="logo-icon">📚</span>
          </div>
          <h1>Base de Conhecimento</h1>
          <p>Farmácias Associadas</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="usuario">
              <span className="label-icon">👤</span>
              Usuário
            </label>
            <input
              type="text"
              id="usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Digite seu usuário"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">
              <span className="label-icon">🔒</span>
              Senha
            </label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </div>

          {erro && (
            <div className="login-erro">
              <span className="erro-icon">⚠️</span>
              {erro}
            </div>
          )}

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Entrando...
              </>
            ) : (
              <>
                <span>Entrar</span>
                <span className="button-icon">→</span>
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>🔐 Acesso restrito a colaboradores</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
