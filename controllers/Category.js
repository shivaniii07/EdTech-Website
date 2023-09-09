const Category = require("../models/Category");

// create tag handler function
exports.createCategory = async(req,res) =>{
    try{
        const{name, description} = req.body;
    //    validation
    if(!name || !description){
        return res.status(400).json({
            success:false,
            message:"All fields are required",
        });
    }
    // create entry in DB
    const tagDetails = await Tag.create({
        name:name,
        description:description,
    });
    console.log(tagDetails);
    // return response
    return res.status(200).json({
        success:false,
        message:"Tag created successfully",
    });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}
// getAllTaga handler function
exports.showAllCategory = async(req,res) =>{
    try{
        const allTags = await Tag.find({} , {name:true,description:true});
        return res.status(200).json({
            success:false,
            message:"All tags returned successfully",
            allTags,
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        }); 
    }
}

// categoryPageDetails 

exports.categoryPageDetails = async (req,res) =>{
    try{
        // get categoryId
        const {categoryId} = req.body;
        // get courses for specified category
        const selectedCategory = await Category.findById(courseId)
                                           .populate("courses")
                                           .exec();
        // validation
        if(!selectedCategory){
            return res.status(404).json({
                success:false,
                message:"Course not found with this category",
            });
        }
        // get courses for different category
        const differentCategories = await Category.find({
                                  _id:{$ne : categoryId}
                               })
                               .populate("courses")
                               .exec();
        // get top selling course

        // return response
        return res.status(200).json({
            success:true,
            data:{
                selectedCategory,
                differentCategories,
            },
        });


    }catch(error){
      console.log(error);
      return res.status(500).json({
        success:false,
        message:error.message,
      });

    }
}