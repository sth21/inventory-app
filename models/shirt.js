const mongoose = require("mongoose");
const { StockSchema } = require("./stock");

const Schema = mongoose.Schema;

const ShirtSchema = new Schema({
  name: { type: String, minLength: 1, required: true },
  description: { type: String, minLength: 1, maxLength: 250, required: true },
  price: { type: Number, min: 1, required: true },
  category: { type: mongoose.Types.ObjectId, ref: "Category", required: true },
  stock: { type: mongoose.Types.ObjectId, ref: "Stock", required: true },
});

ShirtSchema.virtual("url").get(function () {
  return `/${this._id}`;
});

ShirtSchema.virtual("usd").get(function () {
  return `$${this.price.toFixed(2)}`;
});

module.exports = new mongoose.model("Shirt", ShirtSchema);
