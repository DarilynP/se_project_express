const express = require("express");
const app = express();
const userRouter =require("./routes/users");
const mongoose = require('mongoose');
const { PORT = 3001 } = process.env; // Use PORT from environment variables or default to 3001
const clothingItemRoutes = require('./routes/clothingItems');



app.use(express.json()); // So the server can read JSON from the request body

mongoose
.connect('mongodb://127.0.0.1:27017/wtwr_db')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    req.user = {
      _id: '67f474b4dd9cc4212daa2683'// paste the _id of the test user created in the previous step
    };
    next();
  });


  app.use("/users", userRouter); // mount the user routes here
  app.use("/items", clothingItemRoutes);
  app.use('/', clothingItemRoutes);
  app.use("/clothing-items", clothingItemRoutes);



// A basic route for testing
app.get("/", (req, res) => {
  res.send("Hello, World!");
});


// Start the server
app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
