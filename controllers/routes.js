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
  });
});

exports.UPDATE_SHIRT_INFO_PAGE = asyncHandler(async (req, res, next) => {
  res.render("update-shirt-info", { category: req.category, shirt: req.shirt });
});

exports.UPDATE_SHIRT_STOCK_PAGE = asyncHandler(async (req, res, next) => {
  res.render("update-shirt-stock", {
    category: req.category,
    shirt: req.shirt,
  });
});

exports.POST_NEW_SHIRT_ACTION = asyncHandler(async (req, res, next) => {
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
  });
});

exports.POST_UPDATE_SHIRT_INFO_ACTION = asyncHandler(async (req, res, next) => {
  const result = validationResult(req);
  const shirt = req.shirt;
  const category = req.category;

  if (result.isEmpty()) {
    const data = matchedData(req);
    await Shirt.updateOne(
      { _id: shirt._id },
      { name: data.shirtName, description: data.description, price: data.price }
    );
    res.redirect(`${category.url}${shirt.url}`);
    return;
  }
  res.render("update-shirt-info", {
    category: category,
    shirt: shirt,
  });
});

exports.POST_UPDATE_SHIRT_STOCK_ACTION = asyncHandler(
  async (req, res, next) => {
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
    });
  }
);

exports.DELETE_SHIRT_ACTION = asyncHandler(async (req, res, next) => {
  const password = req.body.password;
  if (password === process.env.ADMIN_KEY) {
    await Shirt.deleteOne({ _id: req.shirt._id });
    res.redirect(`${req.category.url}`);
    return;
  }
  res.render("shirt", { category: req.category, shirt: req.shirt });
});
