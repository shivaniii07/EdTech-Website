const express = require("express");
const router = express.Router();

// course controller import
const{createCourse , getAllCourses , getCourseDetails } = require("../controllers/Course");

// categry controller import
const{createCategory , showAllCategory , categoryPageDetails } = require("../controllers/Category");

// section controller import
const{createSection , updateSection , deleteSection} = require("../controllers/Section");

// subSection controllers import
const{createSybSection , updateSubSection , deleteSubSection, createSubSection} = require("../controllers/SubSection");

// rating and review controllers import 
const{createRating , getAverageRating , getAllRating} = require("../controllers/RatingAndReview");

// importing middlewares
const{auth , isStudent , isInstructor , isAdmin} = require("../middlewares/auth");

// COURSE ROUTE
// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse);
//Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection);
// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection);
// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection);
// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection);
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor , createSubSection);
// Get all Registered Courses
router.get("/getAllCourses", getAllCourses);
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails);

// category route (only for Admin)

// category can only be created by admin
router.post("/createCategory" , auth , isAdmin , createCategory )
router.get("/showAllCategories" , showAllCategory)
router.post("/getCategoryPageDetails", categoryPageDetails)

// Rating and Reviews
router.post("/createRating" , auth , isStudent, createRating)
router.get("/getAverageRating" , getAverageRating)
router.post("/getAllReviews", getAllRating)

module.exports = router;