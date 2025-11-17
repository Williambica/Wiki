import './CategoryFilter.css';

function CategoryFilter({ categorias, categoriaAtual, setCategoriaAtual }) {
  return (
    <div className="category-filter">
      <button
        className={`category-btn ${categoriaAtual === null ? 'active' : ''}`}
        onClick={() => setCategoriaAtual(null)}
      >
        Todas
      </button>
      {categorias.map((cat) => (
        <button
          key={cat.id}
          className={`category-btn ${categoriaAtual === cat.id ? 'active' : ''}`}
          style={{
            '--category-color': cat.cor,
          }}
          onClick={() => setCategoriaAtual(cat.id)}
        >
          {cat.nome}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
