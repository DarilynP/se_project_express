const router = require("express").Router();

const userRouter = require("./users");

const auth = require("../middlewares/auth");

const itemRouter = require("./clothingItems");

const { NOT_FOUND } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");
const { getClothingItems } = require('../controllers/clothingItems');

// Routes that do not require authentication
router.post("/signin", login);
router.post("/signup", createUser);

// Apply the authentication middleware for routes that require it
router.use(auth);

// Routes that require authentication
router.get("/items", getClothingItems);
router.use("/users", userRouter);
router.use("/items", itemRouter); // changed from singular to plural for consistency

// Handle unknown routes
router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
