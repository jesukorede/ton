import React from 'react';

const SellerSection = ({ newProduct, setNewProduct, categories }) => {
  return (
    <div className="seller-section">
      <div className="post-product-form">
        <h3>Post New Product</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("New product: ", newProduct);
          }}
        >
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price in TON"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
          />
          <select
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
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
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
          />
          <button type="submit">Post Product</button>
        </form>
      </div>
    </div>
  );
};

export default SellerSection;