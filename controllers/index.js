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
  res.render("category", { category: category, shirts: shirts });
});

exports.GET_SHIRT_PAGE = asyncHandler(async (req, res, next) => {
  const { category, shirt } = req.params;
  const requestedCategory = await Category.find().byNameParam(category);
  const requestedShirt = await Shirt.findOne({ _id: shirt })
    .populate("stock")
    .populate("category");
  console.log(requestedShirt);
  res.render("shirt", { category: requestedCategory, shirt: requestedShirt });
});
