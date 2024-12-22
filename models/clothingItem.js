const mongoose = require("mongoose");

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "The name field is required"],
    minlength: 2,
    maxlength: 30
  },
  weather: {
    type: String,
    required: [true, "The weather field is required"],
    enum: ['hot', 'warm', 'cold']
  },
  imageUrl: {
    type: String,
    required: [true, "The url field is required"],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL"
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "The owner field is required."]
  },
  likes: [{
     type: mongoose.Schema.Types.ObjectId, ref: "user"
    }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

modules.exports = mongoose.model("item", clothingItemSchema);