const express = require("express");
const router = express.Router();

const{capturePayment , verifySignature} = require("../controllers/Payment");
const{auth, isStudent ,isInstructor , isAdmin} = require("../middlewares/auth");

router.post("/capturePayment" , auth , isStudent , capturePayment);
router.get("/verifySignature" , verifySignature);

module.exports = router;