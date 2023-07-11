const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const StockSchema = new Schema({
  product: { type: mongoose.Types.ObjectId, ref: "Product", required: true },
  colors: [
    {
      name: { type: String, minLength: 1, required: true },
      hexCode: { type: String, minLength: 7, maxLength: 7, default: "#000000" },
      XS: { type: Number, min: 0, default: 0 },
      S: { type: Number, min: 0, default: 0 },
      M: { type: Number, min: 0, default: 0 },
      L: { type: Number, min: 0, default: 0 },
      XL: { type: Number, min: 0, default: 0 },
      XXL: { type: Number, min: 0, default: 0 },
    },
  ],
});

// Check if an individual color of a product is in stock
StockSchema.statics.isColorInStock = function (color) {
  return color.XS + color.S + color.M + color.L + color.XL + color.XXL !== 0;
};

// Check if an individual product is in stock
StockSchema.statics.isProductInStock = function (product) {
  const isColorInStock = this.schema.statics.isColorInStock;
  return product.colors.some((color) => isColorInStock(color));
};

module.exports = new mongoose.model("Stock", StockSchema);
