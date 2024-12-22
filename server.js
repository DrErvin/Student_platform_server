const express = require("express");
const cors = require("cors");
const { readFile, writeFile } = require("fs");
const path = require("path");

const app = express();
const PORT = 3000; // Choose a port number

app.use(cors());
app.use(express.json()); // Use express.json() for parsing JSON bodies

// File paths to the JSON data
const OPPORTUNITIES_FILE = path.join(
  __dirname,
  "opportunityData.json"
);
const ACCOUNTS_FILE = path.join(__dirname, "accountData.json");

// Default route for '/'
app.get("/", (req, res) => {
  res.send(
    "Welcome to the API. Use /opportunities or /accounts to fetch data."
  );
});

// GET endpoint to fetch all opportunities
app.get("/opportunities", (req, res) => {
  readFile(OPPORTUNITIES_FILE, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).send("Error reading data");
    }
    res.json(JSON.parse(data));
  });
});

// POST endpoint to add a new opportunity
app.post("/opportunities", (req, res) => {
  readFile(OPPORTUNITIES_FILE, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).json({
        status: "error",
        message: "Error reading data file.",
      });
    }

    try {
      const opportunities = JSON.parse(data);
      const newOpportunity = req.body;
      opportunities.push(newOpportunity);

      writeFile(
        OPPORTUNITIES_FILE,
        JSON.stringify(opportunities, null, 2),
        (writeErr) => {
          if (writeErr) {
            console.error("Error writing file:", writeErr);
            return res.status(500).json({
              status: "error",
              message: "Error saving opportunity data.",
            });
          }

          res.status(201).json({
            status: "success",
            data: newOpportunity,
          });
        }
      );
    } catch (parseErr) {
      console.error("Error parsing JSON:", parseErr);
      res.status(500).json({
        status: "error",
        message: "Error parsing data file.",
      });
    }
  });
});

// GET endpoint to fetch all accounts
app.get("/accounts", (req, res) => {
  readFile(ACCOUNTS_FILE, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).send("Error reading data");
    }
    res.json(JSON.parse(data));
  });
});

// POST endpoint to add a new account
app.post("/accounts", (req, res) => {
  readFile(ACCOUNTS_FILE, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).json({
        status: "error",
        message: "Error reading data file.",
      });
    }

    try {
      const accounts = JSON.parse(data);
      const newAccount = req.body;

      // Add the new account to the array
      accounts.push(newAccount);

      // Write the updated accounts array back to the file
      writeFile(
        ACCOUNTS_FILE,
        JSON.stringify(accounts, null, 2),
        (writeErr) => {
          if (writeErr) {
            console.error("Error writing file:", writeErr);
            return res.status(500).json({
              status: "error",
              message: "Error saving account data.",
            });
          }

          res.status(201).json({
            status: "success",
            data: newAccount,
          });
        }
      );
    } catch (parseErr) {
      console.error("Error parsing JSON:", parseErr);
      res.status(500).json({
        status: "error",
        message: "Error parsing data file.",
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
