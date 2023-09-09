const { response } = require("express");
const Course = require("../models/Course");
const Tag = require("../models/Category");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");

// create course handler function

exports.createCourse =async (req,res) =>{
    try{
            // fetch data
        const{courseName , courseDescription , whatYouWillLearn , price , tag} = req.body;

        // get thumbnail
        const thumbnail = req.files.thumbnailImage;

        // validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail){
            return res.json({
                success:false,
                message:"All fields are required",
            });
        }
        // check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        
        if(!instructorDetails){
            return res.status(404).json({
                success:false,
                message:"Instructor not found",
            })
        }
        // check given tag is valid or not
        const tagDetails =await Tag.findById({tag});
        if(!tagDetails){
            return res.status(404).json({
                success:false,
                message:"Tag details not found",
            }) 
        }
        // upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail , process.env.FOLDER_NAME);
        // create a entry for newcourse
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            whatYouWillLearn:whatYouWillLearn,
            instructor:instructorDetails._id,
            price,
            tag:tagDetails._id,
            thumbnail:thumbnailImage.secure_url,
        });
        // add new course to the user schema of the instructor
        await User.findByIdAndUpdate(
            {id:instructorDetails._id},
            {
                $push:{
                    courses:newCourse._id,
                }
            },
            {new:true},
            )
            // update tag ka schema(H.W)
            // await Tag.findByIdAndUpdate(
            //     {id:tagDetails._id,

            //     $push:{
            //        course:newCourse._id,
            //         }
            //     },
               
            //     {new:true},
            // )

            // return response
            return res.status(200).json({
                success:true,
                message:"Course created successfully",
                data:newCourse,
            });


    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        });

    }
}

// getAllCourse handler function
exports.getAllCourses = async(req,res) =>{
    try{
        const allCourses = await Course.find({},{courseName:true,
                                                 price:true,
                                                thumbnail:true,
                                                instructor:true,
                                                ratingAndReviews:true,
                                                studentsEnroll:true,})
                                                .populate("instructor")
                                                .exec();
        return res.status(200).json({
            success:true,
            message:"Data for all courses fetched successfully",
            data:allCourses,
        })

    }catch(error){
       console.error(error);
       return res.status(500).json({
        success:false,
        message:error.message,
       });
    }
}

// get course details handler function
exports.getCourseDetails = async(req,res) =>{
    try{
        // get id
        const{courseId} = req.body;
    //    get course details
     const courseDetails = await Course.find({_id :courseId})
                                        .populate(
                                           { 
                                            path:"instructor",
                                            populate:{
                                                path:"additionalDetails",
                                            },
                                        } 
                                        )
                                        .populate("category")
                                        .populate("ratingAndReviews")
                                        .populate(
                                            {
                                                path:"courseContent",
                                                populate:{
                                                    path:"subSection",
                                                },
                                            }
                                        )
                                        .exec();
            // validation
            if(!courseDetails){
                return res.status(400).json({
                    success:false,
                    message:"could not find course",
                });
            }
        // return res
        return res.status(200).json({
            success:true,
            message:"course details fetched sussessfully",
            data:courseDetails,
        });

    }catch(error){
       console.log(error);
       return res.status(500).json({
        status:false,
        message:error.message,
       }) ;
    }
}

