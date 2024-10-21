import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './EventPayment.css';

// Full-screen success animation for successful payment
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

const EventPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    eventType,
    name,
    email,
    phone,
    price,
    guestCount,
    eventDate
  } = location.state || {};

  // State for the booking reference number
  const [randomNumber, setRandomNumber] = useState(generateRandomNumber());
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [animationFinished, setAnimationFinished] = useState(false);

  // Function to generate a random 6-digit number
  function generateRandomNumber() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  // Function to format card number with dashes
  const formatCardNumber = (number) => {
    return number.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1-');
  };

  // Function to format expiry date with '/'
  const formatExpiryDate = (date) => {
    return date.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1/');
  };

  // Function to validate the expiry date
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

  // Handle changes in card number input
  const handleCardNumberChange = (e) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  // Handle changes in expiry date input
  const handleExpiryDateChange = (e) => {
    setExpiryDate(formatExpiryDate(e.target.value));
  };

  // Handle payment submission
  const handleCardPayment = async (event) => {
    event.preventDefault();

    // Ensure price is a number
    const formattedPrice = parseFloat(price.replace(/[^\d.-]/g, ''));

    if (cardNumber && isExpiryDateValid(expiryDate) && cvv) {
      try {
        await axios.post('http://localhost:3001/api/events', {
          eventType,
          name,
          email,
          phone,
          price: formattedPrice, // Send price as a number
          guestCount,
          eventDate,
          paymentStatus: 'successful',
          bookingReference: randomNumber // Ensure this field is sent as bookingReference
        });
        console.log(eventDate)
        setPaymentCompleted(true);
        setPaymentError('');
        sendWhatsAppMessage(); // Send WhatsApp message on successful payment
        console.log('Payment successful!');
      } catch (error) {
        setPaymentError('Payment failed. Please try again.');
        console.error('Error saving payment data:', error); // Log full error
      }
    } else {
      if (!cardNumber || !isExpiryDateValid(expiryDate) || !cvv) {
        setPaymentError('Please fill all the fields correctly.');
      } else if (!isExpiryDateValid(expiryDate)) {
        setPaymentError('Expiry date is invalid.');
      }
    }
  };

  // Function to send a WhatsApp message
  const sendWhatsAppMessage = () => {
    // Format the message
    let message = `Welcome to Rooster Restaurant! 🍽️\n\n`;
    message += `Order Summary:\n\n`;
    message += `Total Price with GST: ₹${price}\n`; // You might need to include GST calculation if needed
    message += `Order Code: ${randomNumber}\n\n`;

    message += `Event Details:\n`;
    message += `Event Type: ${eventType}\n`;
    message += `Name: ${name}\n`;
    message += `Email: ${email}\n`;
    message += `Phone: ${phone}\n`;
    message += `Price: ${price}\n`;
    message += `Number of Guests: ${guestCount}\n`;
    message += `Event Date: ${eventDate}\n\n`;

    message += `Payment Status: Successful\n\n`;
    message += `Thank you for booking with Rooster Restaurant! 🎉🍽️😊\n\n`;
    message += `Use the Order Code for verifying your booking!`;

    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phone.startsWith('+') ? phone : `+${phone}`}?text=${encodedMessage}`;
    window.open(url, '_blank');
  };

  // Handle the end of the success animation
  const handleSuccessAnimationEnd = () => {
    setAnimationFinished(true);
    navigate('/event'); // Navigate to the event module after animation finishes
  };

  return (
    <div className="event-payment">
      <h1>Event Payment Details</h1>
      <div className="payment-details">
        <p><strong>Event Type:</strong> {eventType}</p>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Phone Number:</strong> {phone}</p>
        <p><strong>Price:</strong> {price}</p>
        <p><strong>Total Number of Guests:</strong> {guestCount}</p>
        <p><strong>Event Date:</strong> {eventDate}</p>
        <p><strong>Booking Reference Number:</strong> {randomNumber}</p>
      </div>

      {!paymentCompleted && !showCardForm && (
        <div className="payment-buttons-container">
          <button className="make-payment" onClick={() => setShowCardForm(true)}>Make Payment</button>
        </div>
      )}

      {paymentCompleted && !animationFinished && (
        <SuccessAnimation onAnimationEnd={handleSuccessAnimationEnd} />
      )}

      {paymentCompleted && animationFinished && (
        <div className="payment-success">
          <h2>Payment Successful!</h2>
        </div>
      )}

      {showCardForm && !paymentCompleted && (
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
          {paymentError && <div className="error-message">{paymentError}</div>}
        </form>
      )}
    </div>
  );
};

export default EventPayment;
