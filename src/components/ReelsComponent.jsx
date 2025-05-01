import React from 'react';

const ReelsComponent = ({ productReels, products, isSellerMode, newReel, setNewReel, sellerProducts }) => {
  return (
    <div className="reels-container">
      <div className="reels-feed">
        {productReels.map(reel => (
          <div key={reel.id} className="reel-card">
            <video poster={reel.thumbnail} controls className="reel-video">
              <source src={reel.videoUrl} type="video/mp4" />
            </video>
            <div className="reel-info">
              <h4>{products.find(p => p.id === reel.productId)?.name}</h4>
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
              console.log("New reel: ", newReel);
            }}
          >
            <select
              value={newReel.productId || ''}
              onChange={(e) => setNewReel({ ...newReel, productId: parseInt(e.target.value) })}
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
              onChange={(e) => setNewReel({ ...newReel, video: e.target.files[0] })}
            />
            <textarea
              placeholder="Reel Description"
              value={newReel.description}
              onChange={(e) => setNewReel({ ...newReel, description: e.target.value })}
            />
            <button type="submit">Post Reel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ReelsComponent;