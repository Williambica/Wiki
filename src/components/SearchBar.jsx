import './SearchBar.css';

function SearchBar({ busca, setBusca }) {
  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Buscar manuais, tutoriais, soluções..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        {busca && (
          <button
            className="clear-button"
            onClick={() => setBusca('')}
            aria-label="Limpar busca"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
