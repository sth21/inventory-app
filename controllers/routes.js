const asyncHandler = require("express-async-handler");
const Category = require("../models/category");
const Shirt = require("../models/shirt");
const { validationResult, matchedData } = require("express-validator");
const mongoose = require("mongoose");
const Stock = require("../models/stock");
require("dotenv").config();

const populateStockColors = (data) => {
  return data.colorName.map((color, index) => {
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
  });
};

exports.GET_HOME_PAGE = asyncHandler(async (req, res, next) => {
  const categories = await Category.find();
  res.render("index", { categories: categories });
});

exports.GET_CATEGORY_PAGE = asyncHandler(async (req, res, next) => {
  const shirts = await Shirt.find({ category: req.category._id });
  res.render("category", { category: req.category, shirts: shirts });
});

exports.GET_SHIRT_PAGE = asyncHandler(async (req, res, next) => {
  res.render("shirt", { category: req.category, shirt: req.shirt });
});

exports.ADD_NEW_SHIRT_PAGE = asyncHandler(async (req, res, next) => {
  res.render("new-shirt", {
    category: req.category,
    errors: [],
  });
});

exports.UPDATE_SHIRT_INFO_PAGE = asyncHandler(async (req, res, next) => {
  res.render("update-shirt-info", {
    category: req.category,
    shirt: req.shirt,
    errors: [],
  });
});

exports.UPDATE_SHIRT_STOCK_PAGE = asyncHandler(async (req, res, next) => {
  res.render("update-shirt-stock", {
    category: req.category,
    shirt: req.shirt,
    errors: [],
  });
});

exports.DELETE_SHIRT_PAGE = asyncHandler(async (req, res, next) => {
  res.render("delete-shirt", {
    category: req.category,
    shirt: req.shirt,
    errors: [],
  });
});

exports.ADD_NEW_CATEGORY_PAGE = asyncHandler(async (req, res, next) => {
  res.render("new-category", { errors: [] });
});

exports.UPDATE_CATEGORY_PAGE = asyncHandler(async (req, res, next) => {
  res.render("update-category", { category: req.category, errors: [] });
});

exports.DELETE_CATEGORY_PAGE = asyncHandler(async (req, res, next) => {
  res.render("delete-category", { category: req.category, errors: [] });
});

exports.NEW_SHIRT_ACTION = asyncHandler(async (req, res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    const data = matchedData(req);
    const shirtId = new mongoose.Types.ObjectId();
    const stock = await Stock.create({
      product: shirtId,
      colors: populateStockColors(data),
    });
    const shirt = await Shirt.create({
      _id: shirtId,
      name: data.shirtName,
      description: data.description,
      price: data.price,
      category: req.category._id,
      stock: stock,
    });

    res.redirect(`${req.category.url}${shirt.url}`);
    return;
  }
  const failedShirt = {
    name: req.body.shirtName,
    description: req.body.description,
    price: req.body.price,
    stock: { colors: populateStockColors(req.body) },
  };
  res.render("new-shirt", {
    category: req.category,
    shirt: failedShirt,
    errors: result.array(),
  });
});

exports.UPDATE_SHIRT_INFO_ACTION = asyncHandler(async (req, res, next) => {
  const result = validationResult(req);
  const shirt = req.shirt;
  const category = req.category;

  if (result.isEmpty()) {
    const data = matchedData(req);
    const shirtToUpdate = Shirt.findOne({ _id: shirt._id });
    shirtToUpdate = {
      ...shirtToUpdate,
      name: data.shirtName,
      description: data.description,
      price: data.price,
    };
    await shirtToUpdate.save();
    res.redirect(`${category.url}${shirtToUpdate.url}`);
    return;
  }
  res.render("update-shirt-info", {
    category: category,
    shirt: shirt,
    errors: result.array(),
  });
});

exports.UPDATE_SHIRT_STOCK_ACTION = asyncHandler(async (req, res, next) => {
  const result = validationResult(req);
  const shirt = req.shirt;
  const category = req.category;

  if (result.isEmpty()) {
    const data = matchedData(req);
    await Stock.updateOne(
      { _id: shirt.stock._id },
      { colors: populateStockColors(data) }
    );
    res.redirect(`${category.url}${shirt.url}`);
    return;
  }
  res.render("update-shirt-stock", {
    category: category,
    shirt: shirt,
    errors: result.array(),
  });
});

exports.DELETE_SHIRT_ACTION = asyncHandler(async (req, res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    await Shirt.deleteOne({ _id: req.shirt._id });
    res.redirect(`${req.category.url}`);
    return;
  }
  res.render("shirt", {
    category: req.category,
    shirt: req.shirt,
    errors: result.array(),
  });
});

exports.NEW_CATEGORY_ACTION = asyncHandler(async (req, res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    const data = matchedData(req);
    const category = await Category.create({ name: data.categoryName });
    res.redirect(`${category.url}`);
    return;
  }
  res.render("new-category", { name: req.body.name, errors: result.array() });
});

exports.UPDATE_CATEGORY_ACTION = asyncHandler(async (req, res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    const data = matchedData(req);
    const categoryToUpdate = await Category.findOne({ _id: req.category._id });
    categoryToUpdate.name = data.categoryName;
    await categoryToUpdate.save();
    res.redirect(`${categoryToUpdate.url}`);
    return;
  }

  res.status(400).render("update-category", {
    category: req.category,
    errors: result.array(),
  });
});

exports.DELETE_CATEGORY_ACTION = asyncHandler(async (req, res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    const shirts = await Shirt.find({ category: req.category._id });
    const stocks = shirts.map((shirt) => shirt.stock);
    await Stock.deleteMany({ _id: { $in: stocks } });
    await Shirt.deleteMany({ _id: { $in: shirts.map((shirt) => shirt._id) } });
    await Category.deleteOne({ _id: req.category._id });
    res.redirect("/");
    return;
  }
  res.render("delete-category", {
    category: req.category,
    errors: result.array(),
  });
});
