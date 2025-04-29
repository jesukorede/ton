import React from 'react';

const CartDrawer = ({ isOpen, onClose, cart, removeFromCart, cartTotal }) => {
  return (
    <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
      <div className="cart-header">
        <h2>Shopping Cart</h2>
        <button onClick={onClose}>✕</button>
      </div>
      <div className="cart-items">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} width="50" height="50" />
            <div>
              <h3>{item.name}</h3>
              <p>{item.price} TON × {item.quantity}</p>
            </div>
            <button onClick={() => removeFromCart(item.id)}>Remove</button>
          </div>
        ))}
      </div>
      <div className="cart-total">
        <h3>Total: {cartTotal.toFixed(2)} TON</h3>
      </div>
    </div>
  );
};

export default CartDrawer;