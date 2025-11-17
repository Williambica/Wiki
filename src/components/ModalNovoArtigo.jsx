import { useState, useEffect } from 'react';
import './ModalNovoArtigo.css';

function ModalNovoArtigo({ onClose, onSalvar, categorias }) {
  const [formData, setFormData] = useState({
    titulo: '',
    categoria_id: '',
    tags: '',
    conteudo: ''
  });
  const [salvando, setSalvando] = useState(false);

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
    <div className="modal-overlay-novo" onClick={onClose}>
      <div className="modal-card-novo" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-novo" onClick={onClose}>
          ✕
        </button>

        <div className="modal-header-novo">
          <div className="modal-icon-novo">📄</div>
          <h2>Novo Artigo</h2>
          <p>Adicione um novo artigo à base de conhecimento</p>
        </div>

        <form onSubmit={handleSubmit} className="modal-form-novo">
          <div className="form-group-novo">
            <label htmlFor="titulo">
              <span className="label-icon-novo">📝</span>
              Título do Artigo
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Ex: Como configurar NFe no sistema"
              required
              autoFocus
            />
          </div>

          <div className="form-row-novo">
            <div className="form-group-novo">
              <label htmlFor="categoria_id">
                <span className="label-icon-novo">🏷️</span>
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

            <div className="form-group-novo">
              <label htmlFor="tags">
                <span className="label-icon-novo">🔖</span>
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="nfe, fiscal, configuracao"
              />
              <small>Separe as tags por vírgula</small>
            </div>
          </div>

          <div className="form-group-novo">
            <label htmlFor="conteudo">
              <span className="label-icon-novo">📋</span>
              Conteúdo
            </label>
            <textarea
              id="conteudo"
              name="conteudo"
              value={formData.conteudo}
              onChange={handleChange}
              placeholder="Digite o conteúdo do artigo...

Você pode usar Markdown:
# Título
## Subtítulo
- Lista
**Negrito**
*Itálico*"
              rows="12"
              required
            />
            <small>Suporta formatação Markdown</small>
          </div>

          <div className="modal-actions-novo">
            <button 
              type="button" 
              className="btn-cancel-novo"
              onClick={onClose}
              disabled={salvando}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-save-novo"
              disabled={salvando}
            >
              {salvando ? (
                <>
                  <span className="spinner-novo"></span>
                  Salvando...
                </>
              ) : (
                <>
                  <span>💾</span>
                  Salvar Artigo
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalNovoArtigo;
