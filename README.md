# Student platform server

This is the backend project for the Ekipa Student Platform, which supports functionalities like managing user accounts, hosting opportunities, and sending emails for applications. The backend works in tandem with the frontend repository to deliver a full user experience.

⚠️ **Important:** This backend project is not standalone. It needs to be used with the frontend application. You can find the frontend repository here:
[Frontend Repository: Ekipa-Project](https://github.com/DrErvin/Ekipa-Project.git)

---

## Features

- User account management (login, signup).
- Hosting and managing opportunities (jobs, internships, etc.).
- Email notifications for applications (both confirmation and to the recipient).

---

## Requirements

1. [Node.js](https://nodejs.org/) installed on your machine.
2. Access to the frontend repository for integration.
3. A configured email account for sending emails (using Nodemailer).

---

## Getting Started

### 1. Install Dependencies

Install all required dependencies using npm.
Using CLI, run "npm install" after cloning the repository.

### 2. Running the Server

#### Option 1: Start the Server Without Restarting on File Changes

To run the backend server for stable testing or production-like behavior:
npm start
This will host the server without restarting it on file changes. This is recommended for running tests or interacting with the API to ensure consistent behavior.

#### Option 2: Start the Server with Automatic Restarts

If you plan to make frequent changes to the server code, use the following command:

npm run dev
This will restart the server every time a file is changed. However, this behavior can be unstable for testing purposes as the server may restart during requests.

⚠️ Note: This project does not currently use tools like Nodemon, which could handle restarts more gracefully.

### 3. API Endpoints

#### Accounts

GET /accounts: Fetch all user accounts.
POST /accounts: Add a new account.

#### Opportunities

GET /opportunities: Fetch all opportunities.
POST /opportunities: Add a new opportunity.

#### Applications

POST /api/send-application-email: Send application emails
