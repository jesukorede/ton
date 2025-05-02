import React from 'react';
import './ProductCard.css';

function ProductCard({ product, onAddToCart, onView3D }) {
  return (
    <div className="product-card">
      <img 
        src={product.image} 
        alt={product.name} 
        className="product-image" 
      />
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-price">{product.price} TON</p>
        <button
          className="add-to-cart-btn"
          onClick={() => onAddToCart(product)}
        >
          Add to Cart
        </button>
        {product.metaverse && (
          <button
            className="view-in-3d-btn"
            onClick={() => onView3D(product)}
          >
            View in 3D
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;