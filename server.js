const express = require('express');
const cors = require('cors');
const { readFile, writeFile } = require('fs');
const path = require('path');

const app = express();
const PORT = 3000; // Choose a port number

app.use(cors());
app.use(express.json()); // Use express.json() for parsing JSON bodies

// File path to the JSON data
const DATA_FILE = path.join(__dirname, 'data.json');
// Default route for '/'
app.get('/', (req, res) => {
  res.send('Welcome to the API. Use /opportunities to fetch data.');
});

// GET endpoint to fetch all opportunities
app.get('/opportunities', (req, res) => {
  readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).send('Error reading data');
    }
    res.json(JSON.parse(data));
  });
});

// POST endpoint to add a new opportunity
app.post('/opportunities', (req, res) => {
  // Read the current data from the file
  readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res
        .status(500)
        .json({ status: 'error', message: 'Error reading data file.' });
    }

    try {
      const opportunities = JSON.parse(data);
      const newOpportunity = req.body;

      // Add the new opportunity to the array
      opportunities.push(newOpportunity);

      // Write the updated opportunities array back to the file
      writeFile(
        DATA_FILE,
        JSON.stringify(opportunities, null, 2),
        (writeErr) => {
          if (writeErr) {
            console.error('Error writing file:', writeErr);
            return res.status(500).json({
              status: 'error',
              message: 'Error saving opportunity data.',
            });
          }

          // Send a success response with the added opportunity
          res.status(201).json({
            status: 'success',
            data: newOpportunity,
          });
        }
      );
    } catch (parseErr) {
      console.error('Error parsing JSON:', parseErr);
      res
        .status(500)
        .json({ status: 'error', message: 'Error parsing data file.' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
