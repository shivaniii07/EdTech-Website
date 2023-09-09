const Section = require("../models/Section");
const Course = require("../models/Course");
const { addListener } = require("../models/User");

// create section handler function
exports.createSection = async(req,res) =>{
    try{
        // data fetch
        const {sectionName , courseId} = req.body;
        // validation
        if(!sectionName || !courseId){
            return res.json({
                success:false,
                message:"All fields are required",
            });
        }
        // create section
        const newSection = await Section.create({sectionName});
        // update course with this section
        const updatedCourseDetails = await Section.findByIdAndUpdate(
                                              {courseId},
                                              {
                                                $push:{
                                                    courseContent:newSection._id,
                                                }
                                              },
                                              {new:true},
        );
        // return response
        return res.status(200).json({
            success:true,
            message:"Section created successfully",
            updatedCourseDetails,
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong while creating section",
        });

    }
}

// update section handler function
exports.updateSection = async (req,res) =>{
    try{
        // data input
        const{sectionName,sectionId} = req.body;
        // data validation
        if(!sectionName || !sectionId){
            return res.json({
                success:false,
                message:"All fields are required",
            });
        }
        // update data
        const section = await Section.findByIdAndUpdate(sectionId , {sectionName},{new:true});
        // return response
        return res.status(200).json({
            success:true,
            message:"Updated section successfully",
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong while updating the section",
        }); 
    }
}
// delete section
exports.deleteSection = async(req,res) =>{
    try{
        // get id -assuming that we are sending ID in params
        const {sectionId} = req.params;
        // find by id and delete
        await Section.findByIdAndDelete(sectionId);
        // course schema sa entry delete karni hai??
        // return res
        return res.status(200).json({
            success:true,
            message:"Section deleted successfully",
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong while deleting the section",
        }); 
    }
}