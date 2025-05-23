
const router = require("express").Router();
const { celebrate ,Joi } = require("celebrate");

const { getCurrentUser, updateUser } = require("../controllers/users");

//  Validation schema for updating user profile
const updateUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().uri().required(),
  }),
});


router.get("/me", getCurrentUser);
router.patch("/me",updateUserValidation, updateUser);


module.exports = router;
