import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('wiki_favorites');
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  const toggleFavorite = (articleId) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(articleId)
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId];
      
      localStorage.setItem('wiki_favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (articleId) => {
    return favorites.includes(articleId);
  };

  return { favorites, toggleFavorite, isFavorite };
}
