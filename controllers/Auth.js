const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();


// send OTP
exports.sendOTP = async (req,res) =>{
   try{
    const{email} = req.body;

    // check if user already exist
    const checkUserPresent = await User.findOne({email});

    // if user already exist then return a response
    if(checkUserPresent){
        return res.status(401).json({
            success:false,
            message:"User already registered",
        })
    }
    //  generate otp

      var otp = otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
      });
      console.log("OTP generated",otp);

    //   check otpis unique or not
    let result = await OTP.findOne({otp :otp});

    while(result){
        otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        result = await OTP.findOne({otp :otp});
    }

    const otpPayload = {email,otp};
    // create an entry for otp

    const otpBody = await OTP. create(otpPayload);
    console.log(otpBody);

    // return response of succesfull otp
    return res.status(200).json({
        success:true,
        mesage:"OTP sent successfully",
        otp,
    })

   }catch(error)
   {
      console.log(error);
      return res.status(500).json({
        success:false,
        message:error.message,
      })
   }
};

// signUp
exports.signUp = async (req,res) =>{
 try{
       // data fetch feom req ki body
  const{
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    otp,
    contactNumber,
    accountType,
  } = req.body;
  // validation
  if(!firstName || ! lastName || !email ||!password ||!confirmPassword||!otp){
    return res.status(403).json({
      success:false,
      message:"All fields are required",
    })
  }
  // check 2 pass are same or not (pass and confirmPass)
  if(password !== confirmPassword){
    return res.status(400).json({
      success:false,
      message:"password and confirmPassword did not match",
    })
  }
  // check if user already exist or not
  const existingUser = await User.findOne({email});
  if(existingUser){
    return res.status(400).json({
      success:false,
      message:"User already registered",
    })
  }

  // find most recent OTP stored for the user
  const recentOtp = await OTP.find({email}).sort({createdAt: -1}).limit(1);
  console.log(recentOtp);
  // validate OTP
  if(recentOtp.length == 0){
    return res.status(400).json({
      success:false,
      message:"OTP not found",
    })
  } else if(otp !== recentOtp.otp){
    // invalid OTP
    return res.status(400).json({
      success:false,
      message:"Invalid OTP",
    });
  }

  // hash pass
  const hashPassword = await bcrypt.hash(password , 10);
  // entry created in DB

  const profileData = await Profile.create({
     gender:null,
     dateOfBirth:null,
     about:null,
     contactNumber:null,
  });

  const user = await User.create({
    firstName,
    lastName,
    email,
    contactNumber,
    passwors:hashPassword,
    accountType,
    additionalDetails: profileData._id,
    image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
  })

  // return response
  return res.status(200).json({
    success:true,
    message:"User registered successfully",
  });

 }catch(error){
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"User cannot registered successfullu , please try again",
    });
 }
}

// login
exports.login = async(req,res) =>{
  try{ 
    // get data from req ki body
    const {email,password} = req.body;
    // validation
    if(!email || !password){
      return res.status(403).json({
        success:false,
        message:"All fields are required",
      });
    }
    // check if user exist or not
    const user = await User.findOne({email}).populate("additionalDetails");
    if( !user){
      return res.status(401).json({
        success:false,
        message:"Not a registered user",
      });
    }
    // generate JWT token, after pass matching
    if(await bcrypt.compare(password , user.password)){
      const payload = {
        email: user.email,
        id:user._id,
        accountType:user.accountType,

      }
      const token = jwt.sign(payload , process.env.JWT_SECRET,{
        expiresIn:"2h",
      });
      user.token = token;
      user.password = undefined;

      // generate cookie and return response
    const options = {
      expires: new Date(Date.now() + 3*24*60*60*1000),
      httpOnly:true,
    }
    res.cookie("token", token, options).status(200).json({
      success:true,
      token,
      user,
      message:"LoggedIn successfully",
    });

    }
    else {
      return res.status(401).json({
        success:false,
        message:"Password incorrect",
      });
    }
    

  }catch(error){
      console.log(error);
      return res.status(500).json({
        success:false,
        message:"Login unsuccessfull",
      });
  }
}

// change password
exports.changePassword = async(req,res) =>{
  try{ 
    // fetch the data
    // get oldPassword , newPassword , confirmNewPassword
    // validation

    // update password in DB
    // send email for pass update
    // return response

  }catch(error){

  }
}
