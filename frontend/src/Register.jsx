// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons
// import './App.css';

// function Register() {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false); // State for password visibility
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       const response = await axios.post('http://localhost:3001/api/register', {
//         username: username.trim(),
//         email: email.trim(),
//         password: password.trim(),
//       });

//       if (response.data.message === 'User registered successfully') {
//         toast.success('Registration successful');
//         navigate('/login');
//       }
//     } catch (err) {
//       if (err.response) {
//         if (err.response.status === 400) {
//           toast.error(err.response.data.message || 'Registration failed');
//         } else if (err.response.status === 500) {
//           toast.error('Internal server error');
//         }
//       } else if (err.request) {
//         toast.error('No response from server');
//       } else {
//         toast.error('Error during registration');
//       }
//       console.error('Error during registration:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className='log-bg'>
//       <div className='login-container'>
//         <div className='login-form'>
//           <h2>Register</h2>
//           <form onSubmit={handleSubmit}>
//             <div className='mb-3'>
//               <label htmlFor='username'>
//                 <strong>Username</strong>
//               </label>
//               <input
//                 type='text'
//                 placeholder='Enter Username'
//                 autoComplete='off'
//                 name='username'
//                 required
//                 className='inputbox'
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//               />
//             </div>
//             <div className='mb-3'>
//               <label htmlFor='email'>
//                 <strong>Email</strong>
//               </label>
//               <input
//                 type='email'
//                 placeholder='Enter Email'
//                 autoComplete='off'
//                 name='email'
//                 required
//                 className='inputbox'
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>
//             <div className='mb-3 password-container'>
//               <label htmlFor='password'>
//                 <strong>Password</strong>
//               </label>
//               <input
//                 type={showPassword ? 'text' : 'password'} // Toggle input type based on showPassword state
//                 placeholder='Enter Password'
//                 autoComplete='off'
//                 name='password'
//                 required
//                 className='inputbox'
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               <span 
//                 className='eye-icon' 
//                 onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
//                 style={{ cursor: 'pointer' }}
//               >
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </span>
//             </div>
//             <button type='submit' className='btn btn-success m' disabled={isLoading}>
//               {isLoading ? 'Registering...' : 'Register'}
//             </button>
//           </form>
//           <p className='links'>
//             Already have an account?{' '}
//             <Link to='/login'>
//               Log In
//             </Link>
//           </p>
//         </div>
//         <ToastContainer />
//       </div>
//     </div>
//   );
// }

// export default Register;



import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons
import './App.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();

  // Email validation function
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email format
    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/api/register', {
        username: username.trim(),
        email: email.trim(),
        password: password.trim(),
      });

      if (response.data.message === 'User registered successfully') {
        toast.success('Registration successful');
        navigate('/login');
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 400) {
          toast.error(err.response.data.message || 'Registration failed');
        } else if (err.response.status === 500) {
          toast.error('Internal server error');
        }
      } else if (err.request) {
        toast.error('No response from server');
      } else {
        toast.error('Error during registration');
      }
      console.error('Error during registration:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='log-bg'>
      <div className='login-container'>
        <div className='login-form'>
          <h2>Register</h2>
          <form onSubmit={handleSubmit}>
            <div className='mb-3'>
              <label htmlFor='username'>
                <strong>Username</strong>
              </label>
              <input
                type='text'
                placeholder='Enter Username'
                autoComplete='off'
                name='username'
                required
                className='inputbox'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className='mb-3'>
              <label htmlFor='email'>
                <strong>Email</strong>
              </label>
              <input
                type='email'
                placeholder='Enter Email'
                autoComplete='off'
                name='email'
                required
                className='inputbox'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className='mb-3 password-container'>
              <label htmlFor='password'>
                <strong>Password</strong>
              </label>
              <input
                type={showPassword ? 'text' : 'password'} // Toggle input type based on showPassword state
                placeholder='Enter Password'
                autoComplete='off'
                name='password'
                required
                className='inputbox'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span 
                className='eye-icon' 
                onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                style={{ cursor: 'pointer' }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <button type='submit' className='btn btn-success m' disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>
          <p className='links'>
            Already have an account?{' '}
            <Link to='/login'>
              Log In
            </Link>
          </p>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Register;
