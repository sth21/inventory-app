const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, minLength: 1, maxLength: 25, required: true },
});

module.exports = new mongoose.Model("Category", CategorySchema);
