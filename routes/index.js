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

// Create shirt
router.get("/:category/new", Controller.ADD_NEW_SHIRT_PAGE);

// View shirt
router.get("/:category/:shirt", Controller.GET_SHIRT_PAGE);

// Update shirt Info
router.get("/:category/:shirt/updateInfo", function (req, res, next) {});

// Update shirt Stock
router.get("/:category/:shirt/updateStock", function (req, res, next) {});

// Delete shirt
router.get("/:category/:shirt/delete", function (req, res, next) {});

/* 
  ACTIONS 
*/

// Create shirt
router.post("/:category/:shirt", function (req, res, next) {});

// Update shirt Info
router.patch("/:category/:shirt/info", function (req, res, next) {});

// Update shirt Stock
router.patch("/:category/:shirt/stock", function (req, res, next) {});

// Delete shirt
router.delete("/:category/:shirt", function (req, res, next) {});

module.exports = router;
