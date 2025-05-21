const router = require("express").Router();

const userRouter = require("./users");
const itemRouter = require("./clothingItems");
// const clothingItemRoutes = require("./items");
const auth = require("../middlewares/auth");

const { NOT_FOUND } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");
const { getItems } = require("../controllers/clothingItems");



// Routes that do not require authentication
router.post("/signin", login);
router.post("/signup", createUser);

// Public route - should not be protected
router.get("/items", getItems);


// Apply the authentication middleware for routes that require it
router.use(auth);

// Routes that require authentication
router.use("/users", userRouter);
router.use("/items", itemRouter);
// router.use("/items", clothingItemRoutes);

// Handle unknown routes
router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
