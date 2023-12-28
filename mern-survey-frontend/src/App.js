import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import SurveyList from './SurveyList';
import Login from './Login';
import './App.css'; // Import a CSS file for styling (create this file if not exists)

function App() {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    nationality: '',
    email: '',
    phone: '',
    address: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlreadySubmittedPopup, setShowAlreadySubmittedPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginSuccessPopup, setShowLoginSuccessPopup] = useState(false);
  
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    gender: '',
    email: '',
  });


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: '' });
  
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      return; // Prevent multiple submissions
    }

    const errors = {};

    if (!formData.name) {
      errors.name = 'Name is required';
    }

    if (!formData.gender) {
      errors.gender = 'Gender is required';
    }

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Invalid email format';
    }

    // Add more validation for other fields if needed

    if (Object.keys(errors).length > 0) {
      // If there are validation errors, set them in state
      setValidationErrors(errors);
      return;
    }
    try {
      // Use the local backend API URL during development
      setIsSubmitting(true);
      const response = await axios.post('http://localhost:5000/submit-survey', formData);

      if (response.data && response.data.alreadySubmitted) {
        setShowAlreadySubmittedPopup(true);
      } else {
        alert('Survey submitted successfully!');
        setShowLoginSuccessPopup(true);
        setFormData({
          name: '',
          gender: '',
          nationality: '',
          email: '',
          phone: '',
          address: '',
          message: '',
        });
        // can also redirect the user or perform other actions here
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('Error submitting survey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePopupClose = () => {
    setShowAlreadySubmittedPopup(false);
  };
  const handleLogin = () => {
    // Perform login logic, e.g., validate credentials
    // For simplicity, assuming successful login here
    setIsLoggedIn(true);
  };
  const isValidEmail = (email) => {
    // Add your email validation logic here
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  return (
    <Router>
      <div className="app-container">
        <nav>
          <ul className="nav-list">
            <li>
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li>
              <Link to="/surveys" className="nav-link">
                Survey List
              </Link>
            </li>
            {!isLoggedIn && (
              <li>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <hr />
        
        <Routes>
          <Route
            path="/"
            element={
              <form onSubmit={handleSubmit} className="survey-form">
                <label className="form-label">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
                {validationErrors.name && (
                  <span className="form-error">{validationErrors.name}</span>
                )}

                <label className="form-label">Gender:</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="form-input"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {validationErrors.gender && (
                  <span className="form-error">{validationErrors.gender}</span>
                )}

                <label className="form-label">Nationality:</label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className="form-input"
                />

                <label className="form-label">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
                {validationErrors.email && (
                  <span className="form-error">{validationErrors.email}</span>
                )}

                <label className="form-label">Phone:</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                />

                <label className="form-label">Address:</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-input"
                />

                <label className="form-label">Message:</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-input"
                />
                <button type="submit" className="form-button" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Survey'}
                </button>
                {showAlreadySubmittedPopup && (
                  <div className="popup">
                    <p>You have already submitted the survey.</p>
                    <button onClick={handlePopupClose}>Close</button>
                  </div>
                )}
                 {showLoginSuccessPopup && (
                  <div className="popup">
                    <p>Login successful!</p>
                    <button onClick={handlePopupClose}>Close</button>
                  </div>
                )}
              </form>
            }
          />
          <Route
            path="/surveys"
            element={isLoggedIn ? <SurveyList formData={formData} /> : <Navigate to="/login" />}
          />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
      
        </Routes>
      </div>
    </Router>
  );
}

export default App;
