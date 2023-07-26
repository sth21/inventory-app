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
    const category = await Category.findOne({ name: val });
    if (category) {
      throw new Error("Category already exists");
    }
    return true;
  })
  .toLowerCase()
  .escape();

const ADD_SHIRT_NAME = body("shirtName")
  .exists()
  .trim()
  .notEmpty()
  .isAlpha("en-US", { ignore: " " })
  .custom(async (val) => {
    const shirt = await Shirt.findOne({ name: val });
    if (shirt) {
      throw new Error("Shirt name already in use");
    }
    return true;
  })
  .escape();

const UPDATE_SHIRT_NAME = body("shirtName")
  .exists()
  .trim()
  .notEmpty()
  .isAlpha("en-US", { ignore: " " })
  .escape();

const SHIRT_DESCRIPTION = body("description")
  .exists()
  .trim()
  .notEmpty()
  .isAlpha("en-US", { ignore: " " })
  .withMessage("Includes forbidden characters")
  .escape();

const SHIRT_PRICE = body("price").trim().notEmpty().isNumeric().escape();

const SHIRT_CATEGORY = param("category")
  .exists()
  .trim()
  .notEmpty()
  .custom(async (val) => {
    const category = await Category.findOne().byNameParam(val);
    if (category) return true;
    throw new Error("Category does not exist");
  })
  .escape();

const SHIRT_STOCK = body("stock")
  .exists()
  .isObject()
  .custom((value) => {
    if (value.colors.length === 0) throw new Error("No color provided");
    return true;
  });

const COLOR_NAME = body("stock.colors.*.name")
  .if(body("stock.colors").isArray({ min: 1 }))
  .exists()
  .trim()
  .notEmpty()
  .withMessage("No color name given")
  .isAlpha("en-US", { ignore: " " })
  .withMessage("Includes forbidden characters")
  .escape();

const HEX_CODE = body("stock.color.*.hexCode")
  .if(body("stock.colors").isArray({ min: 1 }))
  .exists()
  .trim()
  .notEmpty()
  .withMessage("No hex code given")
  .isHexColor()
  .withMessage("Not a hex code")
  .escape();

const SIZE = body([
  "stock.colors.*.XS",
  "stock.colors.*.S",
  "stock.colors.*.M",
  "stock.colors.*.L",
  "stock.colors.*.XL",
  "stock.colors.*.XXL",
])
  .if(body("stock.colors").isArray({ min: 1 }))
  .exists()
  .isNumeric()
  .isInt()
  .withMessage("Not an integer")
  .custom((val) => val >= 0)
  .escape();

const CREATE_STOCK = body("stock").customSanitizer((value, { req }) => {
  let props;

  if (req.body.colorName === undefined) {
    req.body.colorName = [];
  } else {
    props = ["colorName", "hexCode", "XS", "S", "M", "L", "XL", "XXL"];
    props.forEach((prop) => {
      if (!Array.isArray(req.body[prop])) {
        req.body[prop] = [req.body[prop]];
      }
    });
  }

  return {
    colors: req.body.colorName.map((colorName, i) => {
      return {
        name: colorName,
        hexCode: req.body.hexCode[i],
        XS: req.body.XS[i],
        S: req.body.S[i],
        M: req.body.M[i],
        L: req.body.L[i],
        XL: req.body.XL[i],
        XXL: req.body.XXL[i],
      };
    }),
  };
});

exports.VALIDATE_SHIRT = [
  CREATE_STOCK,
  ADD_SHIRT_NAME,
  SHIRT_DESCRIPTION,
  SHIRT_PRICE,
  SHIRT_CATEGORY,
  SHIRT_STOCK,
  COLOR_NAME,
  HEX_CODE,
  SIZE,
];

exports.VALIDATE_SHIRT_INFO = [
  CREATE_STOCK,
  UPDATE_SHIRT_NAME,
  SHIRT_DESCRIPTION,
  SHIRT_PRICE,
];

exports.VALIDATE_SHIRT_STOCK = [
  CREATE_STOCK,
  SHIRT_STOCK,
  COLOR_NAME,
  HEX_CODE,
  SIZE,
];

exports.VALIDATE_PASSWORD = body("password")
  .exists()
  .trim()
  .notEmpty()
  .custom((v) => {
    if (v === process.env.ADMIN_KEY) return true;
    throw new Error("Password incorrect");
  });

exports.VALIDATE_CATEGORY = CATEGORY_NAME;
