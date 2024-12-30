const express = require("express");
const cors = require("cors");
const { readFile, writeFile } = require("fs");
const path = require("path");
const transporter = require("./email.js");

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

const readJSONFile = async (filePath) => {
  return new Promise((resolve, reject) => {
    readFile(filePath, "utf-8", (err, data) => {
      if (err) return reject(err);
      try {
        resolve(JSON.parse(data));
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
};

app.post("/api/send-application-email", async (req, res) => {
  try {
    const { userId, opportunityId } = req.body;
    console.log("Received application data:", {
      userId,
      opportunityId,
    });

    // Fetch user data
    const accounts = await readJSONFile(ACCOUNTS_FILE);
    const user = accounts.find((account) => account.id === userId);
    console.log("User fetched:", user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch opportunity data
    const opportunities = await readJSONFile(OPPORTUNITIES_FILE);
    const opportunity = opportunities.find(
      (opp) => opp.id === opportunityId
    );
    console.log("Opportunity fetched:", opportunity);

    if (!opportunity || !opportunity.contactPersonEmail) {
      return res
        .status(404)
        .json({ error: "Opportunity or contact email not found" });
    }

    const studentName = user.name_and_surname;
    const studentEmail = user.email;
    const universityName = user.university_name || "N/A";
    const universityLocation = user.university_location || "N/A";
    const telekomEmail = opportunity.contactPersonEmail;
    const opportunityTitle = opportunity.title;

    // Email to Telekom employee
    const telekomMailOptions = {
      from: "noreply.telekom.student.platform@gmail.com",
      to: telekomEmail,
      subject: `New Application for ${opportunityTitle} through Student Platfrom website`,
      html: `<h1>New Application Received</h1>
        <h3>A student has applied for the opportunity: <b>${opportunityTitle}</b>.</h3>
        <p><b>Applicant:</b> ${studentName} (${studentEmail})</p>
        <p><b>University:</b> ${universityName}, ${universityLocation}</p>`,
    };

    // Email to student
    const studentMailOptions = {
      from: "noreply.telekom.student.platform@gmail.com",
      to: studentEmail,
      subject: `Application Confirmation for ${opportunityTitle} through Student Platfrom website`,
      html: `<h1>Application Confirmation</h1>
        <h3>Thank you for applying for <b>${opportunityTitle}</b>.</h3>
        <p><b>Opportunity:</b> ${opportunityTitle}</p>
        <p><b>Contact Person Email:</b> ${telekomEmail}</p>
        <p><b>Your Name:</b> ${studentName}</p>
        <p><b>Your Email:</b> ${studentEmail}</p>
        <p><b>University:</b> ${universityName}, ${universityLocation}</p>`,
    };

    // Send both emails
    console.log("Preparing to send emails...");
    await transporter.sendMail(telekomMailOptions);
    await transporter.sendMail(studentMailOptions);

    res.status(200).json({ message: "Emails sent successfully!" });
  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(500).json({ error: "Error sending emails" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
