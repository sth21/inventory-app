const asyncHandler = require("express-async-handler");
const Category = require("../models/category");

exports.GET_HOME_PAGE = asyncHandler(async (req, res, next) => {
  const categories = await Category.find();
  res.render("index", { categories: categories });
});
