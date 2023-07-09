const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true, minLength: 1 },
  description: { type: String, required: true, minLength: 1, maxLength: 250 },
  price: { type: Number, required: true, min: 1 },
  stock: {
    size: {
      type: String,
      required: true,
      enum: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    available: { type: Number, required: true, min: 0 },
  },
});

ItemSchema.virtual("url").get(function () {
  return `/${this._id}`;
});
