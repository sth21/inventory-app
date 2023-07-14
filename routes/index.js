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

// View Category
router.get("/:category", Controller.GET_CATEGORY_PAGE);

// Create shirt
router.get("/:category/new", Controller.ADD_NEW_SHIRT_PAGE);

// View shirt
router.get("/:category/:shirt", Controller.GET_SHIRT_PAGE);

// Update shirt Info
router.get("/:category/:shirt/updateInfo", Controller.UPDATE_SHIRT_INFO_PAGE);

// Update shirt Stock
router.get("/:category/:shirt/updateStock", Controller.UPDATE_SHIRT_STOCK_PAGE);

// Delete shirt
router.get("/:category/:shirt/delete", function (req, res, next) {});

/* 
  ACTIONS 
*/

// Create shirt
router.post(
  "/:category/new",
  Validator.VALIDATE_SHIRT,
  Controller.NEW_SHIRT_ACTION
);

// Update shirt info
router.post(
  "/:category/:shirt/updateInfo",
  Validator.VALIDATE_SHIRT_INFO,
  Controller.UPDATE_SHIRT_INFO_ACTION
);

// Update shirt stock
router.post(
  "/:category/:shirt/updateStock",
  Validator.VALIDATE_SHIRT_STOCK,
  Controller.UPDATE_SHIRT_STOCK_ACTION
);

// Delete shirt
router.post(
  "/:category/:shirt/delete",
  Validator.VALIDATE_PASSWORD,
  Controller.DELETE_SHIRT_ACTION
);

// Create category
router.post(
  "/newCategory",
  Validator.VALIDATE_PASSWORD,
  Controller.NEW_CATEGORY_ACTION
);

// Update category info
router.post(
  "/updateCategory",
  Validator.VALIDATE_PASSWORD,
  Controller.UPDATE_CATEGORY_ACTION
);

module.exports = router;
