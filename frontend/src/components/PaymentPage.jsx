import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for making HTTP requests
import './pay.css';

const SuccessAnimation = ({ onAnimationEnd }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationEnd();
    }, 3000); // Duration of the success animation

    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  return (
    <div className="success-animation-full">
      <div className="success-animation-content">
        <svg width="150" height="150" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="#4CAF50" strokeWidth="2" />
          <path d="M6 12l4 4 8-8" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p>Payment Successful!</p>
      </div>
    </div>
  );
};

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Use navigate for programmatic navigation

  const {
    totalWithGST = 0,
    cartItems = [],
    username = '',
    phone = '',
    selectedOption = '',
    selectedDate = '',
    selectedTimes = [],
    takeawayTime = '',
    orderType,
    address,
    email // Assuming you have email in location.state
  } = location.state || {};

  const [orderCode, setOrderCode] = useState('');
  const [message, setMessage] = useState('');
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [animationFinished, setAnimationFinished] = useState(false);

  // Function to generate a random 6-digit order code
  const generateOrderCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setOrderCode(code);
  };

  // Generate order code and message when the component mounts
  useEffect(() => {
    generateOrderCode();
  }, []);

  // Generate the message when the order code is set
  useEffect(() => {
    if (orderCode) {
      let msg = `Welcome to Rooster Restaurant! 🍽️\n\n`;
      msg += `Order Summary:\n\nTotal Price with GST: ₹${totalWithGST.toFixed(2)}\n\n`;
      msg += `Order Code: ${orderCode}\n\n`;

      if (orderType === 'Table Booking') {
        msg += `Booking Details:\nUsername: ${username}\nPhone: ${phone}\nSelected Table: ${selectedOption}\nDate: ${selectedDate}\nTime Slots: ${selectedTimes.join(', ')}`;
      } else if (orderType === 'Home Delivery') {
        msg += `Delivery Information:\nName: ${username}\nPhone: ${phone}\nAddress: ${address}`;
      } else if (orderType === 'Takeaway') {
        msg += `Takeaway Details:\nUsername: ${username}\nPhone: ${phone}\nTakeaway Time: ${takeawayTime}`;
      }

      msg += `\n\nOrder Summary:\n`;
      cartItems.forEach(item => {
        msg += `${item.title} - Quantity: ${item.quantity} - Price: ₹${item.price}\n`;
      });

      msg += `\n\nThank you for ordering with Rooster Restaurant! 🎉🍽️😊`;
      msg += `\n\nIt takes about 1 hour to make your order. And use the Order Code for Verify Your Order!`;

      const encodedMessage = encodeURIComponent(msg);
      setMessage(encodedMessage);
    }
  }, [orderCode, orderType, totalWithGST, username, phone, selectedOption, selectedDate, selectedTimes, takeawayTime, cartItems, address]);

  // Handler for sending WhatsApp message
  const handleSendWhatsApp = () => {
    if (message) {
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      const url = `https://wa.me/${formattedPhone}?text=${message}`;

      // Open WhatsApp in a new tab
      window.open(url, '_blank');
    }
  };

  // Format card number with dashes
  const formatCardNumber = (number) => {
    return number.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1-');
  };

  // Format expiry date with slash
  const formatExpiryDate = (date) => {
    return date.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1/');
  };

  // Validate expiry date
  const isExpiryDateValid = (date) => {
    const [month, year] = date.split('/').map(num => num.trim());
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    if (!month || !year || isNaN(month) || isNaN(year)) {
      return false;
    }

    const parsedMonth = parseInt(month, 10);
    const parsedYear = parseInt(year, 10);

    if (parsedMonth < 1 || parsedMonth > 12 || parsedYear < currentYear % 100) {
      return false;
    }

    if (parsedYear > currentYear % 100 || (parsedYear === currentYear % 100 && parsedMonth >= currentMonth)) {
      return true;
    }

    return false;
  };

  // Handler for updating card number
  const handleCardNumberChange = (e) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  // Handler for updating expiry date
  const handleExpiryDateChange = (e) => {
    setExpiryDate(formatExpiryDate(e.target.value));
  };

  // Function to send order and history data to backend
  const sendPaymentData = async () => {
    try {
      const orderData = {
        orderCode,
        totalPrice: totalWithGST,
        orderedItems: cartItems,
        paymentStatus: 'successful',
        username,
        phone,
        orderType,
        selectedOption,
        selectedDate,
        selectedTimes,
        takeawayTime,
        address,
        ...(email && { email })
      };

      const historyData = {
        orderCode,
        totalPrice: totalWithGST,
        orderedItems: cartItems,
        paymentStatus: 'successful',
        username,
        phone,
        orderType,
        selectedOption,
        selectedDate,
        selectedTimes,
        takeawayTime,
        address,
        ...(email && { email })
      };

      await axios.post('http://localhost:3001/api/orders', orderData);
      await axios.post('http://localhost:3001/api/history', historyData);

      console.log('Data saved successfully');
    } catch (error) {
      console.error('Error saving data', error);
    }
  };

  // Handler for simulating card payment
  const handleCardPayment = (event) => {
    event.preventDefault();

    if (cardNumber && isExpiryDateValid(expiryDate) && cvv) {
      // Simulate payment process
      setPaymentCompleted(true);
      setPaymentError('');
      setShowCardForm(false);

      // Save payment data to backend
      sendPaymentData();

      // Log to the console
      console.log('Payment successful!');
    } else {
      if (!cardNumber || !isExpiryDateValid(expiryDate) || !cvv) {
        setPaymentError('Please fill all the fields correctly.');
      } else if (!isExpiryDateValid(expiryDate)) {
        setPaymentError('Expiry date is invalid.');
      }
      setPaymentCompleted(false);
    }
  };

  // Toast notification for errors
  useEffect(() => {
    if (paymentError) {
      const toast = document.createElement('div');
      toast.className = 'toast-error';
      toast.innerText = paymentError;
      document.body.appendChild(toast);

      setTimeout(() => {
        document.body.removeChild(toast);
      }, 3000); // Toast duration
    }
  }, [paymentError]);

  // Handle success animation end
  const handleSuccessAnimationEnd = () => {
    setAnimationFinished(true);

    // Delay navigation to WhatsApp after the animation ends
    setTimeout(() => {
      handleSendWhatsApp(); // Navigate to WhatsApp
    }, 1000); // Adjust this timeout if you want a different delay after animation
  };

  // Handle navigation to order page with phone number
  const handleViewOrderClick = () => {
    navigate('/order', { state: { phone } }); // Pass phone number to the OrderPage
  };

  return (
    <div className='bod'>
    <div className="bg1">
      <h2>Payment</h2>
      <div className='paymen'>
        <hr />
        {orderType === 'Table Booking' && (
          <>
            <h3>Booking Details</h3>
            <p><strong>Username:</strong> {username}</p>
            <p><strong>Phone:</strong> {phone}</p>
            <p><strong>Selected Table:</strong> {selectedOption}</p>
            <p><strong>Date:</strong> {selectedDate}</p>
            <p><strong>Time Slots:</strong> {selectedTimes.join(', ')}</p>
            <hr />
          </>
        )}
        {orderType === 'Home Delivery' && (
          <>
            <h3>Delivery Information</h3>
            <p><strong>Order Type:</strong> {orderType}</p>
            <p><strong>Name:</strong> {username}</p>
            <p><strong>Phone:</strong> {phone}</p>
            <p><strong>Address:</strong> {address}</p>
            <hr />
          </>
        )}
        {orderType === 'Takeaway' && (
          <>
            <h3>Takeaway Details</h3>
            <p><strong>Order Type:</strong> {orderType}</p>
            <p><strong>Username:</strong> {username}</p>
            <p><strong>Phone:</strong> {phone}</p>
            <p><strong>Takeaway Time:</strong> {takeawayTime}</p>
            <hr />
          </>
        )}
        <p><strong>Total Price with GST:</strong> ₹{totalWithGST.toFixed(2)}</p>
        <hr />
        <h4>Ordered Items</h4>
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
        <hr />
        <h4>Message Content:</h4>
        <pre>{decodeURIComponent(message)}</pre>
        <hr />
        <div className="payment-buttons-container">
          {!paymentCompleted && !showCardForm && (
            <>
              <button className="confirm-payment" onClick={() => setShowCardForm(true)}>Make Payment</button>
              <button className="view-order" onClick={handleViewOrderClick}>View Order</button>
            </>
          )}
          {paymentCompleted && !animationFinished && (
            <SuccessAnimation onAnimationEnd={handleSuccessAnimationEnd} />
          )}
          {paymentCompleted && animationFinished && (
            <button className="view-order" onClick={handleViewOrderClick}>View Order</button>
          )}
        </div>
        {showCardForm && (
          <form onSubmit={handleCardPayment}>
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number:</label>
              <input
                type="text"
                id="cardNumber"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="Card Number"
                maxLength="19"
              />
            </div>
            <div className="form-group">
              <label htmlFor="expiryDate">Expiry Date (MM/YY):</label>
              <input
                type="text"
                id="expiryDate"
                value={expiryDate}
                onChange={handleExpiryDateChange}
                placeholder="MM/YY"
                maxLength="5"
              />
            </div>
            <div className="form-group">
              <label htmlFor="cvv">CVV:</label>
              <input
                type="text"
                id="cvv"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="CVV"
                maxLength="3"
              />
            </div>
            <button type="submit">Submit Payment</button>
          </form>
        )}
      </div>
    </div>
    </div>
  );
};

export default PaymentPage;
