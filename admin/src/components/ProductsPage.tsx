import React, { useState, useEffect } from 'react';
import { Edit2, Plus, X } from 'lucide-react';
import { Product } from '../types';
import { getProducts, saveProducts } from '../data';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    image: '',
    price: 0,
    quantity: 0,
    category: 'bread'
  });

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
  };

  const handleSave = (id: string, updates: Partial<Product>) => {
    const updatedProducts = products.map(p => 
      p.id === id ? { ...p, ...updates } : p
    );
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
    setEditingId(null);
  };

  const handleAddProduct = () => {
    const newId = crypto.randomUUID();
    const updatedProducts = [...products, { id: newId, ...newProduct }];
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
    setShowAddModal(false);
    setNewProduct({
      name: '',
      image: '',
      price: 0,
      quantity: 0,
      category: 'bread'
    });
  };

  const formatPrice = (value: number) => {
    return value.toFixed(2);
  };

  const handlePriceChange = (id: string, value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    const parts = numericValue.split('.');
    if (parts.length > 2) return; // Don't allow multiple decimal points
    if (parts[1]?.length > 2) return; // Don't allow more than 2 decimal places
    
    const price = parseFloat(numericValue) || 0;
    handleSave(id, { price });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Products</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-black text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors"
        >
          <Plus size={20} />
          <span>Add Product</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-[2fr,1fr,1fr,1fr] gap-4 p-4 border-b font-medium text-gray-500">
          <div>PRODUCT</div>
          <div>CATEGORY</div>
          <div>PRICE</div>
          <div>QUANTITY</div>
        </div>

        {products.map(product => (
          <div 
            key={product.id} 
            className="grid grid-cols-[2fr,1fr,1fr,1fr] gap-4 p-4 border-b items-center"
            onMouseEnter={() => setHoveredId(product.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="flex items-center space-x-4">
              <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
              {editingId === product.id ? (
                <input
                  type="text"
                  value={product.name}
                  onChange={e => handleSave(product.id, { name: e.target.value })}
                  className="border rounded px-2 py-1"
                  autoFocus
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <span>{product.name}</span>
                  {hoveredId === product.id && (
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                </div>
              )}
            </div>
            
            <div>
              {editingId === product.id ? (
                <select
                  value={product.category}
                  onChange={e => handleSave(product.id, { category: e.target.value as Product['category'] })}
                  className="border rounded px-2 py-1"
                >
                  <option value="bread">bread</option>
                  <option value="cookies">cookies</option>
                  <option value="pastries">pastries</option>
                </select>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>{product.category}</span>
                  {hoveredId === product.id && (
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                </div>
              )}
            </div>
            
            <div>
              {editingId === product.id ? (
                <div className="relative">
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2">$</span>
                  <input
                    type="text"
                    value={formatPrice(product.price)}
                    onChange={e => handlePriceChange(product.id, e.target.value)}
                    className="border rounded px-6 py-1 w-24"
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>${formatPrice(product.price)}</span>
                  {hoveredId === product.id && (
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                </div>
              )}
            </div>
            
            <div>
              {editingId === product.id ? (
                <input
                  type="number"
                  value={product.quantity}
                  onChange={e => handleSave(product.id, { quantity: parseInt(e.target.value) })}
                  className="border rounded px-2 py-1 w-24"
                  min="0"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <span>{product.quantity}</span>
                  {hoveredId === product.id && (
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-[500px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add New Product</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={e => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={newProduct.image}
                  onChange={e => setNewProduct(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter image URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newProduct.category}
                  onChange={e => setNewProduct(prev => ({ ...prev, category: e.target.value as Product['category'] }))}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="bread">bread</option>
                  <option value="cookies">cookies</option>
                  <option value="pastries">pastries</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                  <input
                    type="text"
                    value={formatPrice(newProduct.price)}
                    onChange={e => {
                      const value = e.target.value.replace(/[^0-9.]/g, '');
                      const price = parseFloat(value) || 0;
                      setNewProduct(prev => ({ ...prev, price }));
                    }}
                    className="w-full border rounded px-7 py-2"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  value={newProduct.quantity}
                  onChange={e => setNewProduct(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                  className="w-full border rounded px-3 py-2"
                  min="0"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProduct}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                  disabled={!newProduct.name || !newProduct.image}
                >
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;