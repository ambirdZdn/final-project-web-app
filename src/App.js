'use strict';
const express = require('express');
const path = require('path');
const cors = require('cors');
const yelp = require('yelp-fusion');
const config = require('./config.json');

const app = express();

app.use(cors());

// Yelp client setup
const client = yelp.client(config.YELP_API_KEY);

// API routes
app.get('/api/search', (req, res) => {
  const { term } = req.query;
  console.log('Received search request:', { term });

  // Use a default location or a wide area search
  const searchRequest = { 
    term,
    location: 'Boston', 
    limit: 50
  };

  client.search(searchRequest)
    .then(response => {
      console.log('Yelp API response:', response.jsonBody.businesses);
      if (response.jsonBody.businesses.length === 0) {
        console.log('No results found');
      }
      res.json(response.jsonBody.businesses);
    })
    .catch(e => {
      console.error('Yelp API error:', e);
      res.status(500).json({ error: 'An error occurred while searching' });
    });
});

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));