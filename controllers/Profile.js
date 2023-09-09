const Profile = require("../models/Profile");
const User = require("../models/User");

exports.updateProfile = async(req,res) =>{
    try{
        // fetch data
        const {dateOfBirth="" ,about="" , contactNumber , gender} = req.body;
        // fetch user id
        const id = req.user.id;
        // validation
        if(!contactNumber || !gender || !id){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }
        // find profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);
        // update profile
        profileDetails.dateOfBirth=dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender=gender;
        profileDetails.contactNumber = contactNumber;
        await profileDetails.save();

      // return res
      return res.status(200).json({
        success:true,
        message:"Profile updated successfully",
        profileDetails,
      });

    }catch(error){
      return res.status(500).json({
        success:false,
        message:"Error occurred while profile updation",
      });
    }
}

// delete account
exports.deleteAccount = async (req,res) => {
    try{
        // get id
        const id = req.user.id;
        // validation
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"cannot find user details",
            });
        }
        // delete profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        // delete user
        await User.findByIdAndDelete({_id:id});
        // return res
        return res.status(200).json({
            success:true,
            message:"Successfully deleted the profile",
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Error occurred while profile deletion",
          });
    }
}

exports.getAllUserDetails = async (req,res) =>{
    try{
        // get id
        const id = req.user.id;
        // validation
        if(!id){
            return res.json({
                success:false,
                message:"fields are required",
            });
        }
        // get user details
        const userDetails = await User.findById(id)
        .populate("additionalDetails")
        .exec();
        // return res
        return res.status(200).json({
            success:true,
            message:"all user fetched successfully",
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Error occurred while fetching all userDetails",
          });
    }
}

exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};
  
exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      const userDetails = await User.findOne({
        _id: userId,
      })
        .populate("courses")
        .exec()
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
}