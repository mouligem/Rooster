

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Product.css'; // Use the same CSS file
import rooster from '../assets/rooster.png'; 
import wow from '../assets/omg.webp'

const Product = () => {
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [availability, setAvailability] = useState(1); // Default to Available (1)
  const [category, setCategory] = useState(''); // New state for category
  const [editMode, setEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Handle form submit for adding/editing a product
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('availability', availability);
    formData.append('category', category); // Append category to form data
    if (image) formData.append('image', image);

    try {
      if (editMode) {
        // Edit product
        await axios.put(`http://localhost:3001/api/products/${editProductId}`, formData);
        setEditMode(false);
        setEditProductId(null);
      } else {
        // Add new product
        await axios.post('http://localhost:3001/api/products', formData);
      }
      fetchProducts(); // Refresh the product list
      resetForm(); // Reset form fields
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  // Handle delete product
  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:3001/api/products/${productId}`);
      fetchProducts(); // Refresh the product list
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Handle edit product
  const handleEdit = (product) => {
    setTitle(product.title);
    setPrice(product.price);
    setAvailability(product.availability);
    setCategory(product.category); // Set category for editing
    setEditMode(true);
    setEditProductId(product._id);
  };

  // Reset form fields
  const resetForm = () => {
    setTitle('');
    setPrice('');
    setImage(null);
    setAvailability(1);
    setCategory(''); // Reset category
    setEditMode(false);
  };

  // Filter products based on the search term
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='abg'>
      <div className='product-management-container'>
        <div className='place'>
          <img src={rooster} width={100} height={100} alt='Rooster Logo' />
          <h2 className=''>Product Management</h2>
        </div>
        <hr />
        <br />

        {/* Product Form */}
        <div className='for'>
        <div className="form-container">
          <form onSubmit={handleFormSubmit}>
            <h1>Add a New Product</h1>
            <div>
              <label>Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className='ip'
              />
            </div>
            <div>
              <label>Price:</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className='ip'
              />
            </div>
            <div>
              <label>Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select a category</option>
                <option value="Soup">Soup</option>
                <option value="Starters">Starters</option>
                <option value="Gravy">Gravy</option>
                <option value="Biryani">Biryani</option>
                {/* <option value="Non-Veg Gravy">Non-Veg Gravy</option> */}
                <option value="Poratta">Poratta</option>
                {/* <option value="Soft Drinks">Soft Drinks</option> */}
                <option value="Fried Foods">Fried Foods</option>
              </select>
            </div>
            <div>
              <label>Image:</label>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            <div>
              <label>Availability (Available, Not Available):</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(parseInt(e.target.value, 10))}
              >
                <option value={1}>Available</option>
                <option value={0}>Not Available</option>
              </select>
            </div>
            <button type="submit" className='btns'>
              {editMode ? 'Update Product' : 'Add Product'}
            </button>
            {editMode && <button onClick={resetForm} className='btns'>Cancel</button>}
          </form>
          
        </div>
        <img src={wow} width={700} height={550}/>
        </div>
        {/* Product List */}
        <h1>Product List</h1>
        <div className="table-container"><center>
          <input
            className="search-bar ip"
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          /></center>
          <table className='orders-table'>
            <thead>
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Image</th>
                <th>Availability</th>
                <th>Category</th> {/* Added Category Column */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td>{product.title}</td>
                  <td>₹{product.price}</td>
                  <td>
                    {product.imageUrl && (
                      <img
                        src={`http://localhost:3001/${product.imageUrl}`}
                        alt={product.title}
                        style={{ width: '50px', height: '50px' }}
                      />
                    )}
                  </td>
                  <td>{product.availability === 1 ? 'Available' : 'Not Available'}</td>
                  <td>{product.category}</td> {/* Display Category */}
                  <td>
                    <button onClick={() => handleEdit(product)} className='btns'>Edit</button>
                    <button onClick={() => handleDelete(product._id)} className='btns'>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Product;
