const jwt = require("jsonwebtoken");
require("dotenv").config();
const User =require("../models/User");


exports.auth = async(req, res ,next) =>{
   try{
    // extract token
      const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer", " ");
    //   if token missing return response
      if(! token){
        return res.status(401).json({
            success:false,
            message:"Token is missing",
        });
      }

    //   verify the token
    try{
        const decode = jwt.verify(token , process.env.JWT_SECRET);
        console.log(decode);
        req.user = decode;
    }catch(error){
        // verification issue
        return res.status(401).json({
            success:false,
            message:"Invalid Token",
        });

    }
    next();

   }catch(error){
     console.log(error);
      return res.status(500).json({
        success:false,
        message:"Something went wrong",
      });
   }
}

// isStudent
exports.isStudent = async(req,res,next) =>{
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is protected route for students only",
            })
        }
        next();

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified",
        });
    }
}

// isInstructor
exports.isInstructor = async(req,res,next) =>{
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is protected route for instructor only",
            })
        }
        next();

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified",
        });
    }
}

// isAdmin
exports.isAdmin = async(req,res,next) =>{
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is protected route for admin only",
            })
        }
        next();

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified",
        })
    }
}