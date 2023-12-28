
// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
  resources : ["http://localhost:5000","https://survey-form-app.onrender.com"]}));

// Connect to MongoDB (replace 'your_mongodb_uri' with your MongoDB URI)
mongoose.connect('mongodb+srv://joshitagautam014:X3BgkydKNxqHpENA@cluster0.4ej6tet.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());

// Define a basic schema for survey submissions (you can adjust it based on your needs)
const surveySchema = new mongoose.Schema({
  name: String,
  gender: String,
  nationality: String,
  email: String,
  phone: String,
  address: String,
  message: String,
});

// Create a model based on the schema
const Survey = mongoose.model('Survey', surveySchema);

// Define the route for handling survey submissions
app.post('/submit-survey', async (req, res) => {
  try {
    // Create a new survey instance with data from the request body
    const newSurvey = new Survey(req.body);
    
    // Save the survey to the MongoDB database
    await newSurvey.save();

    // Send a success response
    res.status(200).json({ success: true, message: 'Survey submitted successfully!' });
  } catch (error) {
    console.error('Error submitting survey:', error);
    // Send an error response
    res.status(500).json({ success: false, message: 'Error submitting survey. Please try again.' });
  }
});
app.get('/get-surveys', async (req, res) => {
    try {
      // Fetch all surveys from the MongoDB database
      const surveys = await Survey.find();
      
      // Send the surveys as a JSON response
      res.status(200).json(surveys);
    } catch (error) {
      console.error('Error fetching surveys:', error);
      // Send an error response
      res.status(500).json({ success: false, message: 'Error fetching surveys. Please try again.' });
    }
  });
 // server.js

// ... (other imports)

// Define the route for handling survey deletions
app.delete('/delete-survey/:id', async (req, res) => {
  try {
    const id = req.params.id;
    // Use the ID to delete the survey from the MongoDB database
    const deletedSurvey = await Survey.findByIdAndDelete(id);
    
    if (!deletedSurvey) {
      // If the survey with the given ID is not found
      return res.status(404).json({ success: false, message: 'Survey not found.' });
    }

    // Send a success response
    res.status(200).json({ success: true, message: 'Survey deleted successfully!' });
  } catch (error) {
    console.error('Error deleting survey:', error);
    // Send an error response
    res.status(500).json({ success: false, message: 'Error deleting survey. Please try again.' });
  }
});

// ... (other routes and server setup)



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
