const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {coureEnrollementEmail} = require("../mail/templates/courseEnrollementEmail");

// capture the payment and initiate the Razorpay order
exports.capturePayment = async(req,res) =>{
    
        // get courseId and userId
        const {course_id} = req.body;
        const userId = reu.user.id;
        // validation
        // valid courseId
        if(!course_id){
           return res.json({
            success:false,
            message:"Enter valid course id",
           });
        }
        // valid course details
        let course
        try{
          course =  await Course.findById(course_id);
          if(!course){
            return res.json({
                success:false,
                message:"Could not find course",
            });
          }
           // user already pay for the same course 
        //    user id string mai hai and course id object id form mai hai..so hmm user id ko object id form mai convert kar rhe
           const uid = new mongoose.Types.ObjectId(userId);
           if(course.studentsEnroll.includes(uid)){
            return res.json({
              success:false,
              message:"Student is already enrolled",
            });
           }
        }catch(error){
           return res.status(400).json({
            success:false,
            message:error.message,
           });
        }
       
        // order create
        const amount = course.price;
        const currency = "INR";

        const options = {
          amount: amount*100,
          currency,
          receipt: Math.random(Date.now()).toString(),
          notes:{
            courseId : course_id,
            userId,
          }
        };

        try{
          // initiate the payment using razorpay
          const paymentResponse = await instance.orders.create(options);
          console.log(paymentResponse);
           // return res
           return res.status(200).json({
            success:true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            thumbnail:course.thumbnail,
            orderId:paymentResponse.id,
            amount:paymentResponse.amount,
            currency:paymentResponse.currency,
           });

        }catch(error){
           console.log(error);
           return res.json({
            success:false,
            message:"Could not initiate order",

           });
        }
}

// verify signature of razorpay and server
exports.verifySignature = async(req,res) =>{

const webhookSecret="12345678";

  const signature = req.headers["x-razorpay-signature"];

  const shasum = crypto.createHmac("sha256" , webhookSecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");
  if(signature === digest){
    console.log("Payment is Authorized");

    const {courseId , userId} = req.body.payload.payment.entity.notes;

     try{
        // find the course and enroll the student in it
        const enrolledCourse = await Course.findOneAndUpdate(
                                                 {_id:courseId},
                                                 {
                                                  $push:{
                                                    studentsEnroll:userId
                                                  }
                                                 },{new:true},
        );
        if(!enrolledCourse){
          return res.status(500).json({
            success:false,
            message:"Course not found",
          });
        }
        console.log(enrolledCourse);

        // find the student and add the course in the list of enrolled course
        const enrolledStudent = await User.findOneAndUpdate(
                                                    {_id:userId},
                                                    {
                                                      $push:{
                                                        courses:courseId
                                                      }
                                                    },{new:true},
        );
        console.log(enrolledStudent);

        // mail sending of confirmation of course buying
        const emailResponse = await mailSender(
                                     enrolledStudent.email,
                                     "Congratulations from codehelp",
                                     "Cogratualtion,ypou are onboard for new course",
        );
        console.log(emailResponse);
        return res.status(200).json({
          success:true,
          message:"Signature verified and course added",
        });

    }catch(error){
        return res.status(500).json({
          success:false,
          message:error.message,
        });
    }
  }
  else{
    return res.status(400).json({
      success:false,
      message:"Invalid request",
    })
  }
}