import React, { useState } from 'react';
import './Contact.css';
import rooster from '../assets/omg.webp';
import vid from '../assets/insta.png';

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '', phone: '' });
  const [showThankYou, setShowThankYou] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => /^\d{10}$/.test(phone);
  const isValidName = (name) => /^[A-Za-z][A-Za-z0-9]*$/.test(name);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message || !formData.phone) {
      alert('Please fill in all required fields.');
      return;
    }
    
    if (!isValidEmail(formData.email)) {
      alert('Please enter a valid email address.');
      return;
    }
    
    if (!isValidPhone(formData.phone)) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }
    
    if (!isValidName(formData.name)) {
      alert('Name must start with a letter and contain only letters and numbers.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: '', email: '', message: '', phone: '' });
        setShowThankYou(true);
        setTimeout(() => setShowThankYou(false), 2000);
      } else {
        console.error('Failed to send message:', response.status, response.statusText);
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <>
     <div className='cc-bg'>
      {/* <div class="video-background">
  <video autoplay muted loop id="bgVideo">
    <source src={vid} type="video/mp4"/>
    Your browser does not support the video tag.
  </video></div> */}
      <div className='top-section'>
        <div className='contact-info'>
          <h2>Our Address</h2>
          <p>Utthukadu, Bus Stop, Chithode, Tamil Nadu 638102</p>
          <hr />
          <h2>Phone</h2>
          <p>8838-261-676</p>
          <hr />
          <h2>Email</h2>
          <p><a href="mailto:roosterrestaurant2023@gmail.com">Send a Report</a></p><hr />Follow us on
          <div className="social-media">
  <a href="https://www.instagram.com/rooster_family_restaurant_2023/profilecard/?igsh=MWlqZHpmaDY5eDUzNg== " target="_blank" rel="noopener noreferrer">
    <img src={vid} alt="Instagram" width={30} height={30} />
  </a>
</div>

        </div>
        <div className='map-container'>
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2661.178507668695!2d77.64573841244639!3d11.40005111702575!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba96bc7a427e4df%3A0x923964b19f7d1475!2sRooster%20Restaurant!5e0!3m2!1sen!2sin!4v1726062500199!5m2!1sen!2sin"
            width="600"
            height="430"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      <hr />
      <div className='bottom-section'>
        <div className="contact-form">
          <h2>Send Us a Message</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone:</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message:</label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className='buttons'>Send</button>
          </form>
        </div>
        <img src={rooster} width={700} height={550} alt='Rooster Logo'/>
      </div>
      <div className={`thank-you-overlay ${showThankYou ? 'show' : ''}`}>
        <div className="thank-you-message">
          <p>Thank you for your feedback!</p>
        </div>
      </div>
    </div>
    </>
  );
}

export default Contact;
