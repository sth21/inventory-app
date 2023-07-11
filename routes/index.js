const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Category = require("../models/category");

/* 
  PAGES 
*/

// Home
router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const categories = await Category.find();
    console.log(categories);
  })
);

// View Category
router.get("/:category", function (req, res, next) {});

// View Item
router.get("/:category/:item", function (req, res, next) {});

// Create Item
router.get("/:category/:item/new", function (req, res, next) {});

// Update Item Info
router.get("/:category/:item/updateInfo", function (req, res, next) {});

// Update Item Stock
router.get("/:category/:item/updateStock", function (req, res, next) {});

// Delete Item
router.get("/:category/:item/delete", function (req, res, next) {});

/* 
  ACTIONS 
*/

// Create Item
router.post("/:category/:item", function (req, res, next) {});

// Update Item Info
router.patch("/:category/:item/info", function (req, res, next) {});

// Update Item Stock
router.patch("/:category/:item/stock", function (req, res, next) {});

// Delete Item
router.delete("/:category/:item", function (req, res, next) {});

module.exports = router;
