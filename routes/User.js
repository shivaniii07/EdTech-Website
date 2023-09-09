const express = require("express");
const router = express.Router();

const{signUp , login , sendOTP , changePassword} = require("../controllers/Auth");

const{resetPasswordToken , resetPassword} = require("../controllers/ResetPassword");

const{auth} = require("../middlewares/auth");

// rotes for login , signup , authentication

// router for user login
router.post("/login" , login);

// router for user signup
router.post("/signup" , signUp);

// router for send OTP 
router.post("/sendOTP" , sendOTP);

// router for changing password
router.post("/changePassword" , auth , changePassword);

// routers for reset password
router.post("/resetPasswordToken" , resetPasswordToken);
router.post("/resetPassword" , resetPassword);


module.exports= router;