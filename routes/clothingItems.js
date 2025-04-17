
const router = require("express").Router();

const clothingItemController = require("../controllers/clothingItems"); // Import controller

// Destructure functions directly from the controller
const {
  getItems,
  deleteItem,
  createItem,
  likeItem,
  dislikeItem,
} = clothingItemController;


// console.log(clothingItemController); // Log to check if the controller is imported correctly

router.post("/", createItem); // Create an item
router.delete("/:itemId", deleteItem); // Delete item by ID

// Likes and Dislikes
router.put("/:itemId/likes", likeItem); // Like an item
router.delete("/:itemId/likes", dislikeItem); // Unlike an item

module.exports = router;
