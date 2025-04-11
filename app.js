const mongoose = require('mongoose');

const express = require("express");

const app = express();

const clothingItemRoutes = require('./routes/clothingItems');

const userRouter = require("./routes/users");

const { PORT = 3001 } = process.env; // Use PORT from environment variables or default to 3001


app.use(express.json()); // So the server can read JSON from the request body

mongoose
  .connect('mongodb://127.0.0.1:27017/wtwr_db')
  .catch(() => {
    // Handle database connection error silently
    // You can add your custom error handling here if needed
  });

app.use((req, res, next) => {
  req.user = {
    _id: '67f474b4dd9cc4212daa2683' // Paste the _id of the test user created in the previous step
  };
  next();
});

app.use("/users", userRouter); // Mount the user routes here
app.use("/items", clothingItemRoutes);
app.use('/', clothingItemRoutes);
app.use("/clothing-items", clothingItemRoutes);

// A basic route for testing
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start the server
app.listen(PORT);
