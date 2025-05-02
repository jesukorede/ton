import React from 'react';
import './Navigation.css';

function Navigation({ categories, selectedCategory, onSelectCategory, searchQuery, onSearchChange }) {
  return (
    <nav className="navigation">
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search TON products..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="categories">
        {categories.map(category => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default Navigation;