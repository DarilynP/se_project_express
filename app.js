const mongoose = require("mongoose");
const express = require("express");
const app = express();

const routes = require("./routes/index"); // Import the central router
const { PORT = 3001 } = process.env;

app.use(express.json()); // Middleware to parse JSON


app.use((req, res, next) => {
  req.user = {
    _id: "67f474b4dd9cc4212daa2683", // Test user ID
  };
  next();
});

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .catch(() => {
    // Optional: log error or exit
  });

// Use centralized routes
app.use(routes);

// Start server
app.listen(PORT);
