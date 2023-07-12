const Category = require("../models/category");
const Shirt = require("../models/shirt");
const { body, param } = require("express-validator");
const asyncHandler = require("express-async-handler");

const CATEGORY_NAME = body("categoryName")
  .exists()
  .trim()
  .notEmpty()
  .isAlpha("en-US", { ignore: " " })
  .custom(async (val) => {
    const category = await Category.find({ name: val });
    if (category) {
      throw new Error("Category already exists");
    }
    return true;
  })
  .escape();

const SHIRT_NAME = body("shirtName")
  .exists()
  .trim()
  .notEmpty()
  .isAlpha("en-US", { ignore: " " })
  .custom(async (val) => {
    const shirt = await Shirt.findOne({ name: val });
    if (shirt) {
      console.log(shirt);
      throw new Error("Shirt name already in use");
    }
    return true;
  })
  .escape();

const SHIRT_DESCRIPTION = body("description")
  .exists()
  .trim()
  .notEmpty()
  .isAlpha("en-US", { ignore: " " })
  .escape();

const SHIRT_PRICE = body("price").trim().notEmpty().isNumeric().escape();

const SHIRT_CATEGORY = param("category")
  .exists()
  .trim()
  .notEmpty()
  .custom(async (val) => {
    const category = await Category.find().byNameParam(val);
    return !!category;
  })
  .escape();

const CREATE_COLOR_ARRAY = asyncHandler(async (req, res, next) => {
  const props = ["colorName", "hexCode", "XS", "S", "M", "L", "XL", "XXL"];
  props.forEach((prop) => {
    if (!Array.isArray(req.body[prop])) {
      req.body[prop] = [req.body[prop]];
    }
  });
  next();
});

const COLOR_NAME = body("colorName.*")
  .exists()
  .trim()
  .notEmpty()
  .isAlpha("en-US", { ignore: " " })
  .escape();

const HEX_CODE = body("hexCode.*")
  .exists()
  .trim()
  .notEmpty()
  .isHexColor()
  .escape();

const SIZE = body(["XS.*, S.*, M.*, L.*, XL.*, XXL.*"])
  .exists()
  .trim()
  .notEmpty()
  .isInt()
  .custom((val) => val >= 0)
  .escape();

exports.VALIDATE_SHIRT = [
  CREATE_COLOR_ARRAY,
  SHIRT_NAME,
  SHIRT_DESCRIPTION,
  SHIRT_PRICE,
  SHIRT_CATEGORY,
  COLOR_NAME,
  HEX_CODE,
  SIZE,
];
