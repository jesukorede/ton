import React, { useState, useEffect } from 'react';
import { useMetaverse } from './components/MetaverseContext';
import VirtualRoom from './components/VirtualRoom';
import CartDrawer from './components/CartDrawer';
import SellerSection from './components/SellerSection';
import ReelsComponent from './components/ReelsComponent';
import './App.css';

// Mock product data with metaverse features
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

// Add mock data for seller products and reels
const sellerProducts = [
  {
    id: 1,
    sellerId: "seller1",
    name: "Custom TON Wallet",
    price: 59.99,
    image: "https://via.placeholder.com/150",
    category: "accessories",
    description: "Handcrafted TON wallet with custom designs"
  }
];

const productReels = [
  {
    id: 1,
    productId: 1,
    sellerId: "seller1",
    videoUrl: "https://example.com/video1.mp4",
    thumbnail: "https://via.placeholder.com/300",
    likes: 150,
    views: 1000,
    description: "Check out this amazing TON wallet!"
  }
];

function App() {
  // State declarations
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMetaverseMode, setIsMetaverseMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [assistantResponse, setAssistantResponse] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isSellerMode, setIsSellerMode] = useState(false);
  const [showReels, setShowReels] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    category: "",
    description: "",
    image: null,
  });
  const [newReel, setNewReel] = useState({
    productId: null,
    video: null,
    description: ""
  });
  
  const { activeRoom, joinRoom, leaveRoom } = useMetaverse();

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Utility functions
  const fetchRecommendations = async (productId) => {
    try {
      const response = await fetch('http://localhost:5000/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ product_id: productId })
      });
      const data = await response.json();
      if (data.success) {
        setRecommendations(data.recommendations);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const chatWithAssistant = async (query, productContext) => {
    try {
      const response = await fetch('http://localhost:5000/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          query: query,
          context: productContext
        })
      });
      const data = await response.json();
      if (data.success) {
        setAssistantResponse(data.response);
      }
    } catch (error) {
      console.error('Error chatting with assistant:', error);
    }
  };

  useEffect(() => {
    // Initialize Telegram WebApp
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    tg.ready();
    tg.expand();

    // Set TON theme colors
    tg.setHeaderColor('#0088CC');
    tg.setBackgroundColor('#FFFFFF');

    // Configure main button for TON payments
    tg.MainButton.setText('Pay with TON');
    tg.MainButton.hide();

    // Initialize metaverse features
    initializeMetaverse();

    // Handle main button click for TON payment
    const handleMainButtonClick = () => {
      if (isMetaverseMode) {
        joinVirtualShoppingRoom();
      } else {
        tg.sendData(
          JSON.stringify({
            cart,
            total: cartTotal,
            currency: 'TON',
            metaverseSession: activeRoom
          })
        );
      }
    };

    tg.MainButton.onClick(handleMainButtonClick);

    return () => {
      tg.MainButton.offClick(handleMainButtonClick);
    };
  }, [cart, isMetaverseMode, activeRoom, cartTotal]);

  // Cart and product management functions
  const initializeMetaverse = () => {
    console.log("Initializing metaverse features...");
  };

  const joinVirtualShoppingRoom = () => {
    const roomId = `room_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    joinRoom(roomId);
  };

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
    const matchesCategory =
      selectedCategory === "All" ||
      product.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`app-container ${isMetaverseMode ? 'metaverse-mode' : ''}`}>
      <header className="header">
        <h1>TonCommerce</h1>
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

      <main className="main-content">
        {isMetaverseMode ? (
          <div className="metaverse-container">
            {activeRoom ? (
              <VirtualRoom
                roomId={activeRoom}
                onExit={() => leaveRoom()}
                products={filteredProducts}
                selectedProduct={selectedProduct}
              />
            ) : (
              <>
                <h2>Virtual Shopping Experience</h2>
                <div className="virtual-rooms">
                  <div className="room-preview">
                    <h3>Shopping Room #1</h3>
                    <button onClick={joinVirtualShoppingRoom}>Join Room</button>
                  </div>
                  <div className="room-preview">
                    <h3>Shopping Room #2</h3>
                    <button onClick={joinVirtualShoppingRoom}>Join Room</button>
                  </div>
                </div>
                <div className="virtual-avatar-customization">
                  <h3>Customize Your Avatar</h3>
                  <div className="avatar-options">
                    <button className="avatar-option">Style 1</button>
                    <button className="avatar-option">Style 2</button>
                    <button className="avatar-option">Style 3</button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search TON products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="categories">
              {categories.map(category => (
                <button
                  key={category}
                  className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="product-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card">
                  <img src={product.image} alt={product.name} className="product-image" />
                  <div className="product-info">
                    <h3 className="product-title">{product.name}</h3>
                    <p className="product-price">{product.price} TON</p>
                    <button
                      className="add-to-cart-btn"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                    {product.metaverse && (
                      <button
                        className="view-in-3d-btn"
                        onClick={() => {
                          setIsMetaverseMode(true);
                          setSelectedProduct(product);
                        }}
                      >
                        View in 3D
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <button onClick={() => setIsCartOpen(false)}>✕</button>
        </div>
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} width="50" height="50" />
              <div>
                <h3>{item.name}</h3>
                <p>
                  {item.price} TON × {item.quantity}
                </p>
              </div>
              <button onClick={() => removeFromCart(item.id)}>Remove</button>
            </div>
          ))}
        </div>
        <div className="cart-total">
          <h3>Total: {cartTotal.toFixed(2)} TON</h3>
        </div>
      </div>

      <div className="ai-features">
        <div className="shopping-assistant">
          <h3>Shopping Assistant</h3>
          <input
            type="text"
            placeholder="Ask about products..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                chatWithAssistant(e.target.value, selectedProduct?.name);
              }
            }}
          />
          {assistantResponse && (
            <div className="assistant-response">
              {assistantResponse}
            </div>
          )}
        </div>

        {recommendations.length > 0 && (
          <div className="recommendations">
            <h3>Recommended Products</h3>
            <div className="recommended-products">
              {recommendations.map(productId => {
                const product = products.find(p => p.id === productId);
                return (
                  <div key={productId} className="recommended-product">
                    <img src={product.image} alt={product.name} />
                    <h4>{product.name}</h4>
                    <p>{product.price} TON</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add Seller and Reels Controls */}
      <div className="feature-controls">
        <button
          className="seller-mode-toggle"
          onClick={() => setIsSellerMode(!isSellerMode)}
        >
          {isSellerMode ? '🏪 Exit Seller Mode' : '📝 Become a Seller'}
        </button>
        <button
          className="reels-toggle"
          onClick={() => setShowReels(!showReels)}
        >
          {showReels ? '🏪 Back to Shop' : '📱 Watch Reels'}
        </button>
      </div>

      {/* Seller Section */}
      {isSellerMode && (
        <div className="seller-section">
          <div className="post-product-form">
            <h3>Post New Product</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Handle product submission logic here
                console.log("New product: ", newProduct);
              }}
            >
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Price in TON"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    price: parseFloat(e.target.value)
                  })
                }
              />
              <select
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <textarea
                placeholder="Product Description"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    description: e.target.value
                  })
                }
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, image: e.target.files[0] })
                }
              />
              <button type="submit">Post Product</button>
            </form>
          </div>
        </div>
      )}

      {/* Reels Section */}
      {showReels && (
        <div className="reels-container">
          <div className="reels-feed">
            {productReels.map(reel => (
              <div key={reel.id} className="reel-card">
                <video poster={reel.thumbnail} controls className="reel-video">
                  <source src={reel.videoUrl} type="video/mp4" />
                </video>
                <div className="reel-info">
                  <h4>
                    {products.find(p => p.id === reel.productId)?.name}
                  </h4>
                  <p>{reel.description}</p>
                  <div className="reel-stats">
                    <span>❤️ {reel.likes}</span>
                    <span>👁️ {reel.views}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {isSellerMode && (
            <div className="post-reel-form">
              <h3>Post New Reel</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // Handle reel submission logic here
                  console.log("New reel: ", newReel);
                }}
              >
                <select
                  value={newReel.productId || ''}
                  onChange={(e) =>
                    setNewReel({
                      ...newReel,
                      productId: parseInt(e.target.value)
                    })
                  }
                >
                  <option value="">Select Product</option>
                  {sellerProducts.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) =>
                    setNewReel({ ...newReel, video: e.target.files[0] })
                  }
                />
                <textarea
                  placeholder="Reel Description"
                  value={newReel.description}
                  onChange={(e) =>
                    setNewReel({ ...newReel, description: e.target.value })
                  }
                />
                <button type="submit">Post Reel</button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;