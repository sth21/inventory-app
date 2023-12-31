const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Category = require("../models/category");
const Shirt = require("../models/shirt");
const Controller = require("../controllers/routes");
const Validator = require("../controllers/validators");
const { validationResult } = require("express-validator");

/*
  PARAMS
*/

router.param(
  "category",
  asyncHandler(async (req, res, next, categoryParamName) => {
    const category = await Category.find().byNameParam(categoryParamName);
    req.category = category;
    next();
  })
);

router.param(
  "shirt",
  asyncHandler(async (req, res, next, shirtId) => {
    const shirt = await Shirt.findOne({ _id: shirtId })
      .populate("stock")
      .populate("category");
    req.shirt = shirt;
    next();
  })
);

/* 
  PAGES 
*/

// Home
router.get("/", Controller.GET_HOME_PAGE);

// Create Category
router.get("/new-category", Controller.ADD_NEW_CATEGORY_PAGE);

// View Category
router.get("/:category", Controller.GET_CATEGORY_PAGE);

// Create shirt
router.get("/:category/new-shirt", Controller.ADD_NEW_SHIRT_PAGE);

// Update shirt Info
router.get("/:category/:shirt/update-info", Controller.UPDATE_SHIRT_INFO_PAGE);

// Update shirt Stock
router.get(
  "/:category/:shirt/update-stock",
  Controller.UPDATE_SHIRT_STOCK_PAGE
);

// Delete shirt
router.get("/:category/:shirt/delete-shirt", Controller.DELETE_SHIRT_PAGE);

// Update Category
router.get("/:category/update-category", Controller.UPDATE_CATEGORY_PAGE);

// Delete Category
router.get("/:category/delete-category", Controller.DELETE_CATEGORY_PAGE);

// View shirt
router.get("/:category/:shirt", Controller.GET_SHIRT_PAGE);

/* 
  ACTIONS 
*/

// Create shirt
router.post(
  "/:category/new-shirt",
  Validator.VALIDATE_SHIRT,
  Validator.VALIDATE_PASSWORD,
  Controller.NEW_SHIRT_ACTION
);

// Update shirt info
router.post(
  "/:category/:shirt/update-info",
  Validator.VALIDATE_SHIRT_INFO,
  Validator.VALIDATE_PASSWORD,
  Controller.UPDATE_SHIRT_INFO_ACTION
);

// Update shirt stock
router.post(
  "/:category/:shirt/update-stock",
  Validator.VALIDATE_SHIRT_STOCK,
  Validator.VALIDATE_PASSWORD,
  Controller.UPDATE_SHIRT_STOCK_ACTION
);

// Delete shirt
router.post(
  "/:category/:shirt/delete-shirt",
  Validator.VALIDATE_PASSWORD,
  Controller.DELETE_SHIRT_ACTION
);

// Create category
router.post(
  "/new-category",
  Validator.VALIDATE_CATEGORY,
  Validator.VALIDATE_PASSWORD,
  Controller.NEW_CATEGORY_ACTION
);

// Update category info
router.post(
  "/:category/update-category",
  Validator.VALIDATE_CATEGORY,
  Validator.VALIDATE_PASSWORD,
  Controller.UPDATE_CATEGORY_ACTION
);

// Delete Category
router.post(
  "/:category/delete-category",
  Validator.VALIDATE_PASSWORD,
  Controller.DELETE_CATEGORY_ACTION
);

module.exports = router;
