const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

// reset password token
exports.resetPasswordToken = async(req,res) =>{
   try{
        // get email from req body
    const {email} = req.body;
    // email validation
    const user = await User.findOne({email});

    if(!user){
        return res.status(401).json({
            success:false,
            message:"Invalid email",
        });
    }
    // generate token
    const token = crypto.randomUUID();
    // update user by adding token and expiration time
    const updatedDetails = await User.findOne({email},{
                                            token:token,
                                            resetPasswordExpires:Date.now() + 5*60*1000,
                                         },{new:true});
    // create url
    const url = `http://localhost:3000/update-password/${token}`
    // send mail containing the url
    await mailSender(email,
                     "Password reset link",
                     `Password reset link: ${url}`);
    // return response
      return res.json({
        success:true,
        message:"Email sent successfully",
      });
    
   }catch(error){
      console.log(error);
      return res.status(500).json({
        success:true,
        message:"Something went wrong while reseting password",
      });
   }
}

// reset password
exports.resetPassword = async (req,res) =>{
    try{
        // data fetch
        const {password , confirmPassword , token} = req.body;
        // validation
        if(password !== confirmPassword){
            return res.json({
                success:false,
                message:"Password did not match",
            });
        }
        // get userdetails from Db using token
        const userDetails = await User.findOne({token: token});
        // if no entry -> invalid token
        if(!userDetails){
            return res.json({
                success:false,
                message:"Invalid token",
            });
        }
        // token time check
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success:false,
                message:"Token is expired",
            });
           }
        // hash pass
        const hashedPassword = await bcrypt.hash(password , 10);
        // pass update
        await User.findOneAndUpdate(
            {token: token},
            {password:hashedPassword},
            {new :true},
        )
        // return response
        return res.json({
            success:true,
            message:"password reset successfully",
        })

    }catch(error){
      console.log(error);
      return res.json({
        success:false,
        message:"password reset unsuccessfully",
      });
    }
}