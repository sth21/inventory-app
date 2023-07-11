const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, minLength: 1, lowerCase: true, required: true },
});

CategorySchema.virtual("url").get(function () {
  return `/${this.name.replaceAll(" ", "-")}`;
});

CategorySchema.query.byNameParam = function (nameParam) {
  return this.findOne({ name: nameParam.replaceAll("-", " ") });
};

module.exports = new mongoose.model("Category", CategorySchema);
