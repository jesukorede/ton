import React, { useState, useEffect } from 'react';
import { MetaverseProvider, useMetaverse } from './components/MetaverseContext/MetaverseContext';
import VirtualRoom from './components/VirtualRoom/VirtualRoom';
import CartDrawer from './components/CartDrawer/CartDrawer';
import ProductCard from './components/ProductCard/ProductCard';
import Navigation from './components/Navigation/Navigation';
import './App.css';

// Mock product data
const products = [
  {
    id: 1,
    name: "TON Crystal Wallet",
    price: 49.99,
    image: "https://via.placeholder.com/150",
    category: "accessories",
    metaverse: {
      model3d: "wallet_3d.glb",
      virtualTryOn: true
    }
  },
  {
    id: 2,
    name: "TON NFT Collection",
    price: 299.99,
    image: "https://via.placeholder.com/150",
    category: "digital",
    metaverse: {
      gallery: "virtual_gallery_1",
      interactive: true
    }
  },
  {
    id: 3,
    name: "TON Mining Kit",
    price: 899.99,
    image: "https://via.placeholder.com/150",
    category: "hardware",
    metaverse: {
      tutorial3d: "mining_tutorial.glb",
      liveDemo: true
    }
  }
];

const categories = ["All", "Accessories", "Digital", "Hardware", "Merchandise", "Metaverse"];

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMetaverseMode, setIsMetaverseMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { activeRoom, joinRoom, leaveRoom } = useMetaverse();

  useEffect(() => {
    // Initialize Telegram WebApp
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    tg.ready();
    tg.expand();

    // Configure Telegram WebApp
    tg.MainButton.setText('Pay with TON');
    tg.MainButton.hide();

    const handleMainButtonClick = () => {
      if (cart.length > 0) {
        tg.sendData(JSON.stringify({
          cart,
          total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
          currency: 'TON'
        }));
      }
    };

    tg.MainButton.onClick(handleMainButtonClick);
    return () => tg.MainButton.offClick(handleMainButtonClick);
  }, [cart]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    updateMainButton();
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
    updateMainButton();
  };

  const updateMainButton = () => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;
    
    if (cart.length > 0) {
      tg.MainButton.show();
    } else {
      tg.MainButton.hide();
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "All" || 
                          product.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`app-container ${isMetaverseMode ? 'metaverse-mode' : ''}`}>
      <header className="header">
        <h1>TON Commerce</h1>
        <div className="header-controls">
          <button
            className="metaverse-toggle"
            onClick={() => setIsMetaverseMode(!isMetaverseMode)}
          >
            {isMetaverseMode ? '🌍 Exit Metaverse' : '🌐 Enter Metaverse'}
          </button>
          <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
            🛒
            {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
          </div>
        </div>
      </header>

      <Navigation
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main>
        {isMetaverseMode ? (
          <div className="metaverse-container">
            {activeRoom ? (
              <VirtualRoom
                roomId={activeRoom}
                onExit={leaveRoom}
                products={filteredProducts}
                selectedProduct={selectedProduct}
              />
            ) : (
              <div className="virtual-rooms">
                <button onClick={() => joinRoom(`room_${Date.now()}`)}>
                  Join Virtual Shopping Room
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                onView3D={() => {
                  setIsMetaverseMode(true);
                  setSelectedProduct(product);
                }}
              />
            ))}
          </div>
        )}
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemove={removeFromCart}
        total={cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
      />
    </div>
  );
}

function AppWrapper() {
  return (
    <MetaverseProvider>
      <App />
    </MetaverseProvider>
  );
}

export default AppWrapper;