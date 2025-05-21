require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const routes = require("./routes/index"); // Import the central router
const errorHandler = require("./middlewares/errorHandler"); // Import the centralized error handler

const { PORT = 3001 } = process.env;
const app = express();

app.use(express.json()); // Middleware to parse JSON
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err.message));

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// Enable request logging
app.use(requestLogger);

// Use centralized routes
app.use(routes);

// Enable error logging after routes
app.use(errorLogger);

// Celebrate error handler
app.use(errors());

// Centralized error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
