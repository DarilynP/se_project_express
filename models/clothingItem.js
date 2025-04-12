const mongoose = require("mongoose");

const validator = require("validator");

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Item name is required"],
    minlength: 2,
    maxlength: 30
  },
  weather: {
    type: String,
    required: [true, "Weather type is required"],
    enum: {
      values: ["hot", "warm", "cold"],
      message: "Weather must be one of: hot, warm, cold"
    }
  },
  imageUrl: {
    type: String,
    required: [true, "Image URL is required"],
    validate: {
      validator: (value) => validator.isURL(value),
      message: "You must enter a valid URL"
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: []
  }]
}, { versionKey: false });

module.exports = mongoose.model("ClothingItem", clothingItemSchema);
