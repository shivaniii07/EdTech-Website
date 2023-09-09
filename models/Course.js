const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    
    courseName:{
       type:String,
       trim:true,
       required:true,
       
    },
    courseDescription:{
        type:String,
        trim:true,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,

    },
    whatYouWillLearn:{
        type:String,
    },
    courseContent:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Section",
        }
    ],
    ratingAndReviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"RatingAndReview",
        }
    ],
    price:{
        type:Number,
    },
    thumbnail:{
        type:String,
    },
    tag:{
       type:[String],
       required:true,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
    },
    studentsEnroll:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            requires:true,
        }
    ],
    instructions:{
        type:String,
     },
     status:{
         type:String,
         enum:["Draft" , "Published"],
     },



});

module.exports = mongoose.model("Course", courseSchema);