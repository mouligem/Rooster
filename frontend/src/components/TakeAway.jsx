import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './booking.css';

const TakeAway = () => {
  const [showCart, setShowCart] = useState(false);
  const [takeawayTime, setTakeawayTime] = useState('');
  const [timePeriod, setTimePeriod] = useState('PM');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  const { totalWithGST = 0, cart = [] } = location.state || {};
  const cartItems = Array.isArray(cart) ? cart : [];

  const handleTimeChange = (e) => {
    setTakeawayTime(e.target.value);
  };

  const handleTimePeriodChange = (e) => {
    setTimePeriod(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const validateTime = (time, period) => {
    const [hours, minutes] = time.split(':').map(Number);
    let selectedHours = hours;

    if (period === 'PM' && hours !== 12) {
      selectedHours += 12;
    } else if (period === 'AM' && hours === 12) {
      selectedHours = 0;
    }

    const selectedTime = new Date();
    selectedTime.setHours(selectedHours, minutes);

    const startTime = new Date();
    startTime.setHours(12, 0);

    const endTime = new Date();
    endTime.setHours(22, 0);

    return selectedTime >= startTime && selectedTime <= endTime;
  };

  const validatePhone = (phone) => {
    return /^[6789]\d{9}$/.test(phone);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateTime(takeawayTime, timePeriod)) {
      toast.error('Please select a time between 12:00 PM and 10:00 PM.');
      return;
    }

    if (!validatePhone(phone)) {
      toast.error('Phone number must start with 9, 8, 7, or 6 and be exactly 10 digits.');
      return;
    }

    navigate('/payment', {
      state: {
        totalWithGST,
        cartItems,
        takeawayTime: `${takeawayTime} ${timePeriod}`,
        phone,
        username,
        orderType: 'Takeaway'
      }
    });
  };

  return (
    <>
    <div className='bod'>
    <div className="container">
      <h2 className="headerz">Take Away</h2>
      <div className="total-price">Total Price with GST: ₹{totalWithGST}</div>
      <div className="note"><b>Note:</b> Your order will be prepared one hour after the time you booked.</div>
      <hr/>
      <div className="form-containers">
       <center><h3>Select Takeaway Time</h3></center>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              required
              className="input-fields"
            />
          </label>
          <label className="time-label">
            Time:
            <div className="time-input-container">
              <input
                type="time"
                value={takeawayTime}
                onChange={handleTimeChange}
                required
                className="input-fields"
              />
              <select value={timePeriod} onChange={handleTimePeriodChange} required className="time-period">
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </label>
          <label>
            Phone:
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              required
              className="input-fields"
            />
          </label>
          <br/>
          <center><button type="submit" className="submit-buttons">Submit</button></center>
          <br/>
        </form>
      </div>
      <hr/>
      <button onClick={() => setShowCart(!showCart)} className="toggle-cart">
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
      <ToastContainer />
    </div>
    </div>
    </>
  );
};

export default TakeAway;
