const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");

const userRouter = require("./users");
const itemRouter = require("./clothingItems");
// const clothingItemRoutes = require("./items");
const auth = require("../middlewares/auth");

const { NOT_FOUND } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");
const { getItems } = require("../controllers/clothingItems");

// Define validation schemas
const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
});

const signupValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
});

// Routes that do not require authentication
router.post("/signin",loginValidation, login);
router.post("/signup", signupValidation, createUser);

// Public route - should not be protected
router.get("/items", getItems);


// Apply the authentication middleware for routes that require it
router.use(auth);

// Routes that require authentication
router.use("/users", userRouter);
router.use("/items", itemRouter);
// router.use("/items", clothingItemRoutes);

// Handle unknown routes
router.use((req, res, next) => {
  const error = new Error("Requested resource not found");
  error.statusCode = NOT_FOUND;
  next(error); // Pass to centralized error handler
});

module.exports = router;
