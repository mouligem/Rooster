import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import rooster from './assets/rooster.png';
import halal from './assets/halal.png';
import './App.css';

function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve user data (including role) from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    setUser(loggedInUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login'); // Redirect to login page
  };

  const handleUsernameClick = () => {
    if (user && user.role === 'admin') {
      navigate('/admin'); // Navigate to admin page if user is admin
    } else {
      navigate('/allorders'); // Navigate to order page for other users
    }
  };

  const handleEventClick = (e) => {
    if (!user) {
      e.preventDefault(); // Prevent the navigation
      alert('Please log in to view the event.');
    }
  };

  const handleMenuClick = (e) => {
    if (!user) {
      e.preventDefault(); // Prevent the navigation
      alert('Please log in to view the menu.');
    }
  };

  return (
    <div className='header'>
      <img src={rooster} width={100} height={100} alt='Rooster Logo' />
      <div className='hc'>
        <h1><b>Rooster Restaurant</b></h1>
      </div>
      <nav>
        <ul className='headerheading'>
          <li>
            <Link to='/event' className='link' onClick={handleEventClick}>Event</Link>
          </li>
          <li>
            <Link to='/menu' className='link' onClick={handleMenuClick}>Menu</Link>
          </li>
          <li>
            <Link to='/about' className='link'>About</Link>
          </li>
          <li>
            <Link to='/contact' className='link'>Contact</Link>
          </li>
          {!user ? (
            <>
              <button className='login-btn'><Link to='/login'>LogIn</Link></button>
              <button className='register-btn'><Link to='/register'>Register</Link></button>
            </>
          ) : (
            <>
              {/* Display username as a button */}
              <button className='username-btn' onClick={handleUsernameClick}>
                {user.username}
              </button> 
              <button className='logout-btn' onClick={handleLogout}>Logout</button>
            </>
          )}
        </ul>
      </nav>
      <div className='logo img'>
        <img src={halal} width={80} height={80} alt='Halal Logo' />
      </div>
    </div>
  );
}

export default Header;
