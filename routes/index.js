const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Category = require("../models/category");
const Controller = require("../controllers/index");

/* 
  PAGES 
*/

// Home
router.get("/", Controller.GET_HOME_PAGE);

// View Category
router.get("/:category", Controller.GET_CATEGORY_PAGE);

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
