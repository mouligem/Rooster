
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './booking.css';

const HomeDelivery = () => {
  const [showCart, setShowCart] = useState(false);
  const [username, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();
  
  const location = useLocation();
  const { totalWithGST = 0, cart = [] } = location.state || {};
  const cartItems = Array.isArray(cart) ? cart : [];

  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9][0-9]{9}$/; 
    return phoneRegex.test(phone);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validatePhone(phone)) {
      alert('Please enter a valid 10-digit phone number starting with 6, 7, 8, or 9.');
      return;
    }

    navigate('/payment', {
      state: {
        totalWithGST,
        cartItems,
        username,
        address,
        phone,
        orderType: 'Home Delivery'
      }
    });
  };

  const addressOptions = [
    'Chithode',
    'Perundurai',
    'Bhavani',
    'Kavundhapaadi',
    'Komarapalayam',
    'Tindal',
    'Nasiyanur',
    'Karungalpalayam',
    'Telephone Nagar',
    'Erode Bus Stand',
    'VOC Park',
    'Erode Railway Station',
    'VilarasamPatti',
    'KanchiKovil'
  ];

  return (
    <div className="bg1">
      <center>
      <div className="containers">
      <h2>Home Delivery</h2>
      <div><p>Total Price with GST: ₹{totalWithGST}</p></div>

      <div className="delivery-details">
        <h3>Enter Delivery Details</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" value={username} onChange={(e) => setName(e.target.value)} required />
          </label><br/>
          <label>
            Address:
            <select value={address} onChange={(e) => setAddress(e.target.value)} required>
              <option value="" disabled>Select your address</option>
              {addressOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label><br/>
          <label>
            Phone:
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </label><br/>
          <button type="submit">Submit</button>
        </form>
        <br/>
        <button onClick={() => setShowCart(!showCart)}>
          {showCart ? 'Hide Cart' : 'Show Cart'}
        </button>
        
        {showCart && (
          <div className="cart-details">
            <h4>Cart Items:</h4>
            <ul>
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <li key={item._id}>
                    {item.title} - Quantity: {item.quantity} - Price: ₹{item.price}
                  </li>
                ))
              ) : (
                <li>No items in the cart.</li>
              )}
            </ul>
          </div>
        )}
      </div>
      </div></center>
    </div>
  );
};

export default HomeDelivery;
