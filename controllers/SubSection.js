const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// create sub section handler fuction
exports.createSubSection = async(req,res) =>{
    try{
        // fetch data
        const {title,timeDuration,description,sectionId} = req.body;
        // fetch files/video
        const video = req.files.videoFile ;
        // validation
        if(!title || !timeDuration || !description || !video || !sectionId){
            return res.json({
                success:false,
                message:"All fields are required",
            });
        }
        // upload video on cloudinary to get secure url
        const uploadDetails = await uploadImageToCloudinary(video,process.env.FOLDER_NAME)
        // create the sub section
        const subSectionDetails = await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secureUrl,
        });
        // update the section with the new sub section object Id
        const updatedSubSection = await SubSection.findByIdAndUpdate({id:sectionId},
                                                                   {
                                                                    $push:{
                                                                        subSection:subSectionDetails._id,
                                                                    }
                                                                   },{new:true})
                                                                   .populate("updatedSubSection")
                                                                   .exec();
        // return response
        return res.status(200).json({
            success:true,
            message:"SubSection created successfully",
            updatedSubSection,
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Error occurred while creating SubSection",
        });
    }
}

// update sub section handler function
exports.updatedSubSection = async(req,res) =>{
    try{
         // fetch data
         const {title,timeDuration,description,sectionId} = req.body;
         // fetch files/video
         const video = req.files.videoFile ;
         // validation
         if(!title || !timeDuration || !description || !video || !sectionId){
             return res.json({
                 success:false,
                 message:"All fields are required",
             });
         }
        //  update the subSection
        const subSection = await SubSection.findByIdAndUpdate({sectionId},
                                                              {title,description,timeDuration,  
                                                             videoUrl:uploadDetails.secureUrl},
                                                              {new:true},);
    //   return res
    return res.staytus(200).json({
        success:true,
        message:"Sub section updated successfully",
    });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"error occurred while updating sub section",
        });
    }
}

// delete sub section handler function
exports.deleteSubSection = async(req,res) =>{
    try{
        // get id by params
        const{subSectionId} = req.params;
        // find by id and cdelete
        await SubSection.findByIdAndDelete(subSectionId);
    //  needed to update the section schema after deletion??
    //    return res
    return res.status(200).json({
        success:true,
        message:"SubSection deletrd successfully",
    });
        
    }catch(error){
       return res.status(500).json({
        success:false,
        message:"Error occurred while deleting the SubSection",
       });
    }
}