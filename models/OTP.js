const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema ({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,
    },

});

// a fuction to send email
async function sendVerificationEmail(email, otp){
    try{
       const mailResponse = await mailSender(email , "Verificartion Email of StudyNotion", otp)
       console.log("Email sent successfully",mailResponse);
    }catch(error){
        console.log("error occurred while sending email",error);
        throw error;
    }

}
  
    OTPSchema.pre("save", async function(next) {
        await sendVerificationEmail(this.email , this.otp);
        next();
    })


module.exports = mongoose.model("OTP", OTPSchema);