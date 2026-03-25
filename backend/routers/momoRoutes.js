const express = require("express");
const { createPayment, callback } = require("../controllers/momoController.controller");
const router = express.Router();

router.post("/create", createPayment);
router.post("/callback", callback);

module.exports = router;
