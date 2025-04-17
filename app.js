const mongoose = require("mongoose");

const express = require("express");

const app = express();

const cors = require("cors");

// const auth = require("./middlewares/auth");

const routes = require("./routes/index"); // Import the central router

const { PORT = 3001 } = process.env;

app.use(express.json()); // Middleware to parse JSON


// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .catch(() => {
    // Optional: log error or exit
  });

app.use(cors());
// Use centralized routes
app.use(routes);

// Start server
app.listen(PORT);

