import React from 'react';
import './CartDrawer.css';

function CartDrawer({ isOpen, onClose, items, onRemove, total }) {
  return (
    <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
      <div className="cart-header">
        <h2>Shopping Cart</h2>
        <button onClick={onClose} className="close-button">✕</button>
      </div>
      <div className="cart-items">
        {items.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} className="cart-item-image" />
            <div className="cart-item-details">
              <h3>{item.name}</h3>
              <p>{item.price} TON</p>
              <p>Quantity: {item.quantity}</p>
            </div>
            <button 
              onClick={() => onRemove(item.id)}
              className="remove-button"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="cart-footer">
        <div className="cart-total">
          <h3>Total:</h3>
          <p>{total} TON</p>
        </div>
        <button className="checkout-button">
          Checkout with TON
        </button>
      </div>
    </div>
  );
}

export default CartDrawer;