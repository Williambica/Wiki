function Logo({ size = 50, showText = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <img 
        src="/logo-farmacias-associadas.png" 
        alt="Farmácias Associadas" 
        style={{ 
          height: size * 1.2, 
          width: 'auto',
          filter: 'brightness(0) invert(1)',
          transition: 'all 0.3s'
        }}
        onError={(e) => {
          // Fallback para SVG se a imagem não carregar
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'none' }}
      >
        <rect x="35" y="10" width="30" height="80" rx="5" fill="white"/>
        <rect x="10" y="35" width="80" height="30" rx="5" fill="white"/>
        <circle cx="50" cy="50" r="20" fill="#1db89f"/>
        <rect x="47" y="40" width="6" height="20" rx="2" fill="white"/>
        <rect x="40" y="47" width="20" height="6" rx="2" fill="white"/>
      </svg>
      
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'inherit' }}>
            Farmácias
          </span>
          <span style={{ fontSize: '1rem', fontWeight: 600, color: 'inherit', opacity: 0.9 }}>
            Associadas
          </span>
        </div>
      )}
    </div>
  );
}

export default Logo;
