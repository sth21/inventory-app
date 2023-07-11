const asyncHandler = require("express-async-handler");
const Category = require("../models/category");
const Shirt = require("../models/shirt");

exports.GET_HOME_PAGE = asyncHandler(async (req, res, next) => {
  const categories = await Category.find();
  res.render("index", { categories: categories });
});

exports.GET_CATEGORY_PAGE = asyncHandler(async (req, res, next) => {
  const nameParam = req.params.category;
  const category = await Category.find().byNameParam(nameParam);
  const shirts = await Shirt.find({ category: category._id });
  console.log(shirts.name);
  res.render("category", { categoryName: category.name, shirts: shirts });
});
