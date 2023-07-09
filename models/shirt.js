const mongoose = require("mongoose");
const { StockSchema } = require("./stock");

const Schema = mongoose.Schema;

const ShirtSchema = new Schema({
  name: { type: String, required: true, minLength: 1 },
  description: { type: String, required: true, minLength: 1, maxLength: 250 },
  price: { type: Number, required: true, min: 1 },
  category: { type: mongoose.Types.ObjectId, ref: "Category" },
  stock: { type: StockSchema, required: true },
});

module.exports = new mongoose.Model("Shirt", ShirtSchema);
