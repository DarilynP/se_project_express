const ClothingItem = require("../models/clothingItem");
const { BAD_REQUEST, SERVER_ERROR, NOT_FOUND } = require("../utils/errors");
const mongoose = require("mongoose");

// Controller function to fetch clothing item by ID
const getClothingItem = (req, res) => {
  const { id } = req.params; // Get the clothing item ID from the URL params

  ClothingItem.findById(id)
    .orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((item) => res.status(200).json(item)) // If item is found, send it as a response
    .catch((err) => {
      console.error(err);
      res.status(err.statusCode || SERVER_ERROR).json({ message: err.message });
    });
};

// Controller function to create a new clothing item
const createClothingItem = (req, res) => {
  console.log("Authenticated User:", req.user);
  const { name, weather, imageUrl } = req.body; // Example fields for a clothing item

  console.log("received data:", req.body);

  if (!name || !weather || !imageUrl) {
    return res.status(400).send({ message: "Invalid request" });
  }

  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: req.user._id, // Assuming `req.user._id` comes from authenticated user
  })
    .then((clothingItem) => {
      console.log("created item:", clothingItem);
      res.status(201).json(clothingItem); // Send the newly created item in response
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .json({ message: "Invalid data provided." });
      } else {
        return res
          .status(SERVER_ERROR)
          .json({ message: "Error creating clothing item." });
      }
    });
};

// Controller function to fetch all clothing items
const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).json(items))
    .catch((err) => {
      console.error(err);
      res.status(SERVER_ERROR).json({ message: "Failed to fetch items." });
    });
};

// Controller function to delete a clothing item
const deleteItem = (req, res) => {
  const { itemId } = req.params;

  // Validate if itemId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).json({ message: "Invalid item ID format" });
  }

  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).json({ message: "Item not found" }); // Item not found
      }

      // Check if the user is the owner of the item
      if (item.owner.toString() !== req.user._id) {
        const error = new Error(
          "Forbidden: You can only delete your own items."
        );
        error.statusCode = 403;
        throw error; // Forbidden
      }

      return item
        .deleteOne()
        .then(() => res.status(200).json({ message: "Item deleted" }));
    })
    .catch((err) => {
      console.error(err);
      // If the error is related to an invalid ObjectId or database query
      res.status(err.statusCode || 500).json({ message: err.message });
    });
};

// Controller function to like a clothing item
const likeItem = (req, res) => {
  const { itemId } = req.params;

  // First, validate the ObjectId format
  if (!/^[0-9a-fA-F]{24}$/.test(itemId)) {
    return res.status(400).json({ message: "Invalid item ID." });
  }

  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      if (item.likes.includes(req.user._id)) {
        return res
          .status(400)
          .json({ message: "You have already liked this item." });
      }

      return ClothingItem.findByIdAndUpdate(
        itemId,
        { $addToSet: { likes: req.user._id } },
        { new: true }
      )
        .then((updatedItem) => {
          res.status(200).json(updatedItem);
        })
        .catch((err) => {
          console.error("Error updating item:", err);
          res.status(500).json({ message: "Error liking the item." });
        });
    })
    .catch((err) => {
      console.error("Error fetching item:", err);
      res.status(500).json({ message: "Error fetching the item." });
    });
};

// DISLIKE (unlike) item
const dislikeItem = (req, res) => {
  const { itemId } = req.params;

  // Check if itemId is a valid MongoDB ObjectId
  if (!/^[0-9a-fA-F]{24}$/.test(itemId)) {
    return res.status(400).json({ message: "Invalid item ID." });
  }

  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      // Remove the user from the likes array, even if they haven't liked it
      return item.updateOne({ $pull: { likes: req.user._id } })
        .then(() => res.status(200).json(item)); // Return the item with updated likes
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Error unliking the item." });
    });
};


module.exports = {
  createClothingItem,
  getClothingItem,
  getItems,
  deleteItem,
  dislikeItem,
  likeItem,
};
