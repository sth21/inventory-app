const asyncHandler = require("express-async-handler");
const Category = require("../models/category");
const Shirt = require("../models/shirt");
const { validationResult, matchedData } = require("express-validator");
const mongoose = require("mongoose");
const Stock = require("../models/stock");

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
  res.render("shirt", { category: requestedCategory, shirt: requestedShirt });
});

exports.ADD_NEW_SHIRT_PAGE = asyncHandler(async (req, res, next) => {
  const category = req.params.category;
  const requestedCategory = await Category.find().byNameParam(category);
  res.render("new-shirt", {
    category: requestedCategory,
  });
});

exports.POST_NEW_SHIRT_ACTION = asyncHandler(async (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const data = matchedData(req);
    console.log(data);
    const shirtId = new mongoose.Types.ObjectId();
    const categoryParam = req.params.category;
    const requestedCategory = await Category.find().byNameParam(categoryParam);
    const stock = await Stock.create({
      product: shirtId,
      colors: data.colorName.map((color, index) => {
        return {
          name: color,
          hexCode: data.hexCode[index],
          XS: data.XS[index],
          S: data.S[index],
          M: data.M[index],
          L: data.L[index],
          XL: data.XL[index],
          XXL: data.XXL[index],
        };
      }),
    });

    const shirt = await Shirt.create({
      _id: shirtId,
      name: data.shirtName,
      description: data.description,
      price: data.price,
      category: requestedCategory._id,
      stock: stock,
    });

    res.redirect(`${requestedCategory.url}${shirt.url}`);
  }
  next(result.throw());
});
