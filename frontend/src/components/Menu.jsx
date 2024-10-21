
import React, { useState, useEffect } from 'react';
import '../App.css';
import { FaShoppingCart } from 'react-icons/fa';  
import './menu.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Menu() {
  const [cart, setCart] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  const GST_RATE = 0.18;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvailableProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/products/available');
        setMenuItems(response.data);

        const uniqueCategories = [...new Set(response.data.map(item => item.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching available products:', error);
      }
    };

    fetchAvailableProducts();
  }, []);

  const handleAddToCart = (item) => {
    setCart(prevCart => {
      const updatedCart = { ...prevCart };
      if (updatedCart[item._id]) {
        updatedCart[item._id].quantity += 0.5;
      } else {
        updatedCart[item._id] = { ...item, quantity: 1 };
      }
      return updatedCart;
    });
  };

  const handleRemoveFromCart = (item) => {
    setCart(prevCart => {
      const updatedCart = { ...prevCart };
      if (updatedCart[item._id]) {
        if (updatedCart[item._id].quantity > 1) {
          updatedCart[item._id].quantity -= 1;
        } else {
          delete updatedCart[item._id];
        }
      }
      return updatedCart;
    });
  };

  const handlePayment = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleOrderType = (type) => {
    setIsModalOpen(false);
    const cartArray = Object.values(cart);
    const totalPrice = cartArray.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const gstAmount = totalPrice * GST_RATE;
    const totalWithGST = totalPrice + gstAmount;

    if (type === 'Book a Table') {
      navigate('/book-table', { state: { totalWithGST, cart: cartArray } });
    } else if (type === 'Home Delivery') {
      navigate('/home-delivery', { state: { totalWithGST, cart: cartArray } });
    } else if (type === 'Take Away') {
      navigate('/take-away', { state: { totalWithGST, cart: cartArray } });
    }
  };

  const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = Object.values(cart).reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gstAmount = totalPrice * GST_RATE;
  const totalWithGST = totalPrice + gstAmount;

  // Filter menu items based on selected category and search query
  const filteredMenuItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <div className='m-bg'>
        <div className='text-style'>Rooster Menu</div>
        
        {/* Category Dropdown and Search Input */}
        <div className="header-controls">
          <div className="category-dropdown">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="search-container">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Update query on input change
            />
          </div>
        </div>

        <div className='cart-icon-container' 
          onMouseEnter={() => setIsCartOpen(true)} 
          onMouseLeave={() => setIsCartOpen(false)}
        >
          <div className='logo1'>
            <FaShoppingCart size={50} className='logo'/>
            {totalItems > 0 && <span className='cart-count'>{totalItems}</span>}
          </div>
          
          {isCartOpen && (
            <div className='cart-dropdown'>
              <h2>Your Cart</h2>
              {totalItems > 0 ? (
                <>
                  <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {Object.values(cart).map(item => (
                      <li key={item._id} style={{ textAlign: 'left' }}>
                        {item.title} - {item.quantity} x ₹{item.price.toFixed(2)} = ₹{(item.quantity * item.price).toFixed(2)}
                        <button onClick={() => handleAddToCart(item)}>+</button>
                        <button onClick={() => handleRemoveFromCart(item)}>-</button>
                      </li>
                    ))}
                  </ul>
                  <div>
                    <p>Total Price: ₹{totalPrice.toFixed(2)}</p>
                    <p>GST (18%): ₹{gstAmount.toFixed(2)}</p>
                    <p>Total with GST: ₹{totalWithGST.toFixed(2)}</p>
                    <center><button onClick={handlePayment} className='buttons'>Proceed to Confirm</button></center>
                  </div>
                </>
              ) : (
                <p>Your cart is empty</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal for selecting order type */}
      {isModalOpen && (
        <div className='modal'>
          <div className='modal-content'>
            <h2>Select Order Type</h2>
            <button onClick={() => handleOrderType('Take Away')}>Take Away</button>
            <button onClick={() => handleOrderType('Book a Table')}>Book a Table</button>
            <button onClick={() => handleOrderType('Home Delivery')}>Home Delivery</button>
            <button onClick={handleModalClose}>Close</button>
          </div>
        </div>
      )}

      <div className='m1-bg'>
        <div className='menu-mainbox'>
          {filteredMenuItems.map(item => (
            <div key={item._id} className='menu-innerbox'>
              <img 
                src={`http://localhost:3001/${item.imageUrl}`} 
                alt={item.title} 
                className='menu-image' 
                onError={(e) => e.target.src = '/path/to/default-image.jpg'} 
                width={100} 
                height={50}
              />
              <h2 className='menu-title'>{item.title}</h2>
              <p className='menu-price'>Price: ₹{item.price}</p>
              <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Menu;
