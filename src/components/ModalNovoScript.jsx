import { useState } from 'react';
import './ModalNovoScript.css';

function ModalNovoScript({ onClose, onSalvar, categorias }) {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    linguagem: 'sql',
    categoria_id: '',
    codigo: ''
  });
  const [salvando, setSalvando] = useState(false);

  const linguagens = [
    { value: 'sql', label: 'SQL', icon: '🗄️' },
    { value: 'javascript', label: 'JavaScript', icon: '🟨' },
    { value: 'python', label: 'Python', icon: '🐍' },
    { value: 'bash', label: 'Bash', icon: '💻' },
    { value: 'powershell', label: 'PowerShell', icon: '⚡' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    
    try {
      await onSalvar(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="modal-overlay-script" onClick={onClose}>
      <div className="modal-card-script" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-script" onClick={onClose}>
          ✕
        </button>

        <div className="modal-header-script">
          <div className="modal-icon-script">💻</div>
          <h2>Novo Script</h2>
          <p>Adicione um novo script útil à base de conhecimento</p>
        </div>

        <form onSubmit={handleSubmit} className="modal-form-script">
          <div className="form-group-script">
            <label htmlFor="titulo">
              <span className="label-icon-script">📝</span>
              Título do Script
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Ex: Query para buscar vendas do mês"
              required
              autoFocus
            />
          </div>

          <div className="form-group-script">
            <label htmlFor="descricao">
              <span className="label-icon-script">📄</span>
              Descrição
            </label>
            <input
              type="text"
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Breve descrição do que o script faz"
            />
          </div>

          <div className="form-row-script">
            <div className="form-group-script">
              <label htmlFor="linguagem">
                <span className="label-icon-script">🔤</span>
                Linguagem
              </label>
              <select
                id="linguagem"
                name="linguagem"
                value={formData.linguagem}
                onChange={handleChange}
                required
              >
                {linguagens.map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.icon} {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group-script">
              <label htmlFor="categoria_id">
                <span className="label-icon-script">🏷️</span>
                Categoria
              </label>
              <select
                id="categoria_id"
                name="categoria_id"
                value={formData.categoria_id}
                onChange={handleChange}
                required
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group-script">
            <label htmlFor="codigo">
              <span className="label-icon-script">⌨️</span>
              Código
            </label>
            <textarea
              id="codigo"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              placeholder="Cole seu código aqui..."
              rows="14"
              required
              className="code-editor"
            />
            <small>O código será formatado automaticamente</small>
          </div>

          <div className="modal-actions-script">
            <button 
              type="button" 
              className="btn-cancel-script"
              onClick={onClose}
              disabled={salvando}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-save-script"
              disabled={salvando}
            >
              {salvando ? (
                <>
                  <span className="spinner-script"></span>
                  Salvando...
                </>
              ) : (
                <>
                  <span>💾</span>
                  Salvar Script
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalNovoScript;
