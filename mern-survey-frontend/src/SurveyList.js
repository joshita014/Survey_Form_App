// src/SurveyList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SurveyList.css'; // Import a CSS file for styling (create this file if not exists)

const SurveyList = ({ formData}) => {
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    // Fetch the list of surveys from the backend when the component mounts
    const fetchSurveys = async () => {
      try {
        // Use the local backend API URL during development
        const response = await axios.get('http://localhost:5000/get-surveys');
        setSurveys(response.data);
      } catch (error) {
        console.error('Error fetching surveys:', error);
      }
    };

    fetchSurveys();
  }, [formData]);

  const handleDelete = async (id) => {
    try {
      // Use the local backend API URL during development
      await axios.delete(`http://localhost:5000/delete-survey/${id}`);
      // After deletion, fetch the updated list of surveys
      const response = await axios.get('http://localhost:5000/get-surveys');
      setSurveys(response.data);
    } catch (error) {
      console.error('Error deleting survey:', error);
    }
  };

  return (
    <div className="survey-list-container">
      <h2>Survey List</h2>
      <ul className="survey-list">
        {surveys.map((survey, index) => (
          <li key={index} className="survey-item">
            <div>
              <strong>Name:</strong> {survey.name}
            </div>
            <div>
              <strong>Gender:</strong> {survey.gender}
            </div>
            <div>
              <strong>Nationality:</strong> {survey.nationality},{' '}
            </div>
            <div>
              <strong>Email:</strong> {survey.email},{' '}
            </div>
            <div>
              <strong>Phone:</strong> {survey.phone},{' '}
            </div>
            <div>
              <strong>Address:</strong> {survey.address},{' '}
            </div>
            <div>
              <strong>Message:</strong> {survey.message}
            </div>
            <button onClick={() => handleDelete(survey._id)} className="delete-button">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SurveyList;
