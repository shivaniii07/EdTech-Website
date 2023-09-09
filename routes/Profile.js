const express = require("express");
const router = express.Router();
const{auth} = require("../middlewares/auth");

const{updateProfile ,
     deleteAccount ,
      getAllUserDetails ,
       updateDisplayPicture ,
        getEnrolledCourses }= require("../controllers/Profile");

   
        // delete user account 
    router.delete("/deleteProfile" , deleteAccount);
    router.put("/updateProfile", auth , updateProfile);
    router.get("/getUserDetails" ,auth , getAllUserDetails);

    // enrolled courses
    router.get("/getEnrolledCourse", auth , getEnrolledCourses);
    router.put("/updateDispalyPicture" , auth , updateDisplayPicture);

    module.exports = router;