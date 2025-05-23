
const router = require("express").Router();
const { celebrate, Joi, Segments} = require ("celebrate");

const clothingItemController = require("../controllers/clothingItems"); // Import controller

// Destructure functions directly from the controller
const {
  deleteItem,
  createItem,
  likeItem,
  dislikeItem,
  getItems
} = clothingItemController;

// Validation Schemas
const itemIdValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required(),
  }),
});

const createItemValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    imageUrl: Joi.string().uri().required(),
    weather: Joi.string().valid("hot", "warm", "cold").required(),
  }),
});


router.get("/",getItems);
router.post("/", createItemValidation, createItem); // Create an item
router.delete("/:itemId", itemIdValidation, deleteItem); // Delete item by ID

// Likes and Dislikes
router.put("/:itemId/likes",itemIdValidation, likeItem); // Like an item
router.delete("/:itemId/likes", itemIdValidation, dislikeItem); // Unlike an item

module.exports = router;
