import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Event.css'; // Ensure this path is correct
import kudil from '../assets/rooster.png'; // Ensure this path is correct
import che from '../assets/che1.jpg'; // Ensure this path is correct

const events = [
  {
    title: 'Birthday Party',
    image: 'https://images.pexels.com/photos/1543762/pexels-photo-1543762.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    description: 'Celebrate your special day with us!',
    offer: { title: '10% off on Birthday Party', details: 'Get 10% off for booking a birthday event.' },
    foodOffer: { title: 'Birthday Special Menu', details: 'Free dessert for every guest.' },
    price: '₹5000'
  },
  {
    title: 'Wedding Anniversary',
    image: 'https://images.pexels.com/photos/2165931/pexels-photo-2165931.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    description: 'Make your anniversary unforgettable.',
    offer: { title: 'Wedding Combo Offer', details: 'Free cake with a wedding event booking.' },
    foodOffer: { title: 'Wedding Feast', details: 'Complimentary champagne with dinner.' },
    price: '₹8000'
  },
  {
    title: 'Bachelor Party',
    image: 'https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    description: 'Party with your friends before the big day!',
    offer: { title: 'Bachelor Party Combo', details: 'Complimentary drinks for groups over 10 people.' },
    foodOffer: { title: 'Party Snack Platter', details: 'Free appetizers for the group.' },
    price: '₹6000'
  },
  {
    title: 'Corporate Event',
    image: 'https://images.pexels.com/photos/1181342/pexels-photo-1181342.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    description: 'Host your corporate event in style.',
    offer: { title: 'Corporate Package Deal', details: 'Includes projector and sound system.' },
    foodOffer: { title: 'Corporate Buffet', details: 'Free coffee and pastries for the morning session.' },
    price: '₹12000'
  },
  {
    title: 'Baby Shower',
    image: 'https://images.pexels.com/photos/3837092/pexels-photo-3837092.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    description: 'Celebrate the upcoming arrival with joy!',
    offer: { title: 'Baby Shower Special', details: 'Includes a custom cake and decorations.' },
    foodOffer: { title: 'Baby Shower Treats', details: 'Free fruit platter and snacks.' },
    price: '₹4500'
  },
  {
    title: 'Move Event',
    image: 'https://images.pexels.com/photos/258293/pexels-photo-258293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    description: 'A special event focused on movement and exercise.',
    offer: { title: 'Move Event Package', details: 'Includes free yoga mats for all participants.' },
    foodOffer: { title: 'Healthy Snacks', details: 'Free energy bars and smoothies.' },
    price: '₹7000'
  }
];

function Event() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [blastActive, setBlastActive] = useState(false);
  const [offerAnimation, setOfferAnimation] = useState(false);
  const [showFormDetails, setShowFormDetails] = useState(false);
  const [selectedEventTitle, setSelectedEventTitle] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guestCount: '',
    eventDate: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % events.length);
      setOfferAnimation(true);
      setTimeout(() => setOfferAnimation(false), 1500);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleEventClick = (eventTitle) => {
    setSelectedEvent(eventTitle);
    setSelectedEventTitle(eventTitle);
    setBlastActive(true);

    setTimeout(() => {
      setBlastActive(false);
    }, 4000);
  };

  const eventDetails = events.find(event => event.title === selectedEvent);

  const validateForm = () => {
    const errors = {};
    const { name, email, phone, guestCount, eventDate } = formData;
  
    if (!name.trim()) errors.name = 'Name is required';
    if (!email.trim()) errors.email = 'Email is required';
    if (!phone.trim()) errors.phone = 'Phone number is required';
    if (!guestCount || guestCount <= 0 || guestCount >= 500) errors.guestCount = 'Number of guests must be a positive number or less than 500 members';
    if (!eventDate) errors.eventDate = 'Event date is required';
  
    if (name && !/^[a-zA-Z\s]+$/.test(name)) errors.name = 'Name must contain only letters and spaces';
    if (email && !/\S+@\S+\.\S+/.test(email)) errors.email = 'Please enter a valid email address';
    if (phone) {
      if (!/^\d{10}$/.test(phone)) {
        errors.phone = 'Phone number must be exactly 10 digits';
      } else if (!/^[6789]/.test(phone)) {
        errors.phone = 'Phone number must start with 9, 8, 7, or 6';
      }
    }
  
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  

  const handleBookNowClick = () => {
    if (!selectedEventTitle) {
      alert('Please select an event before booking.');
      return;
    }
    setShowFormDetails(true);
  };

  const handleCancelClick = () => {
    setShowFormDetails(false);
  };

  const checkDateAvailability = async (date) => {
    try {
      // Convert date to ISO string and pass as query parameter
      const response = await fetch(`http://localhost:3001/api/check-date?eventDate=${encodeURIComponent(date.toISOString())}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      return result.booked;
    } catch (error) {
      console.error('Error checking date:', error);
      return false;
    }
  };
  
  const handleProceedToPaymentClick = async () => {
    if (validateForm()) {
      const eventDate = new Date(formData.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      if (eventDate < today) {
        alert('The event date cannot be in the past. Please choose a valid date.');
        return;
      }
      const isDateBooked = await checkDateAvailability(eventDate);
      if (isDateBooked) {
        alert('The selected date is already booked. Please choose another date.');
        return;
      }
  
      // Proceed to payment if date is valid
      navigate('/event-payment', {
        state: {
          eventType: selectedEventTitle,
          ...formData,
          eventDate: eventDate.toISOString().split('T')[0], 
          price: eventDetails.price
        }
      });
    }
  };
  
  

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: ''
    }));
  };

  return (
    // <div className='ebg'>
      <div className="event-wrapper">
        {/* Left section */}
        <div className="event-left">
          <div className="event-container">
            <div className="event-slider">
              {events.map((event, index) => (
                <div
                  key={index}
                  className={`slide ${index === currentSlide ? 'active' : ''}`}
                >
                  <img src={event.image} alt={event.title} />
                  <div className="event-info">
                    <h2>{event.title}</h2>
                    <p>{event.description}</p>
                    <p className="event-price">Price: {event.price}</p>
                  </div>
                </div>
              ))}
            </div>
            <br />
            <div className="booking-section">
              <h1>Book Your Event</h1>
              <form className="booking-form">
                <div className="event-type-container">
                  {events.map((event, index) => (
                    <div
                      key={index}
                      className={`event-type ${selectedEvent === event.title ? 'active' : ''}`}
                      onClick={() => handleEventClick(event.title)}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
                {selectedEvent && eventDetails && (
                  <div className="event-details">
                    <h2>Event Details</h2>
                    <p><strong>Title:</strong> {eventDetails.title}</p>
                    <p><strong>Description:</strong> {eventDetails.description}</p>
                    <p><strong>Price:</strong> {eventDetails.price}</p>
                    <p><strong>Special Offer:</strong> {eventDetails.offer.details}</p>
                    <p><strong>Food Offer:</strong> {eventDetails.foodOffer.details}</p>
                  </div>
                )}
                <button
                  type="button"
                  className="book-now-button"
                  onClick={handleBookNowClick}
                >
                  Book Now {selectedEventTitle}
                </button>
              </form>
            </div>
            
            {showFormDetails && (
              <div className={`booking-section1 ${showFormDetails ? 'show' : ''}`}>
                <form className="booking-form1">
                  <div className="form-details">
                    <h2>Enter Your Information</h2>
                    <label htmlFor="name">Name:</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                    />
                    {formErrors.name && <p className="error-message">{formErrors.name}</p>}                   
                    <label htmlFor="email">Email:</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                    />
                    {formErrors.email && <p className="error-message">{formErrors.email}</p>}                   
                    <label htmlFor="phone">Phone Number:</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      required
                    />
                    {formErrors.phone && <p className="error-message">{formErrors.phone}</p>}                   
                    <label htmlFor="guestCount">Number of Guests:</label>
                    <input
                      type="number"
                      id="guestCount"
                      name="guestCount"
                      min="1"
                      value={formData.guestCount}
                      onChange={handleFormChange}
                      required
                    />
                    {formErrors.guestCount && <p className="error-message">{formErrors.guestCount}</p>}
                    <label htmlFor="eventDate">Event Date:</label>
                    <input
                      type="date"
                      id="eventDate"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleFormChange}
                    />
                    {formErrors.eventDate && <p className="error-message">{formErrors.eventDate}</p>}
                    <div className="form-buttons">
                      <button type="button" onClick={handleCancelClick}>Cancel</button>
                      <button type="button" onClick={handleProceedToPaymentClick}>Proceed to Payment</button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
        {/* Right section - Offers */}
        <div className="event-right">
          <img src={kudil} className='i' alt='Kudil' />
          <hr />
          <h1>Special Offers</h1>
          <hr />
          <div className={`offer-section ${offerAnimation ? 'offer-animation' : ''}`}>
            <div className="offer-item">
              <h4>{events[currentSlide].offer.title}</h4>
              <p>{events[currentSlide].offer.details}</p>
            </div>
            <div className="offer-item">
              <h4>{events[currentSlide].foodOffer.title}</h4>
              <p>{events[currentSlide].foodOffer.details}</p>
            </div>
            <div className="offer-item">
              <h4>{events[currentSlide].foodOffer.title}</h4>
              <p>{events[currentSlide].foodOffer.details}</p>
            </div>
            <div className="offer-item">
              <h4>{events[currentSlide].foodOffer.title}</h4>
            </div>
          </div>
        </div>
      </div>
    // </div>
  );
}

export default Event;
