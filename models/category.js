const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, minLength: 1, required: true },
});

module.exports = new mongoose.model("Category", CategorySchema);
