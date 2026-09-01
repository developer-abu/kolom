require('dotenv').config({ path: '../.env' })
const User = require('../models/user.schema')
const Posts = require('../models/posts.schema')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const envData = require('../config/config');
const fs = require('fs/promises');

const { captureStore, generateCapture, crypto, } = require('../verification/capture');
const  transporter  = require('../config/mailer');

const deleteUploadedFile = async (req) => {
  if (req.file) {
    try {
      await fs.unlink(req.file.path);
    } catch (error) {
      console.log("File deletion failed:", error.message);
    }
  }
};
const deleteUploadedFileIfUserDeletePost = async (filePath) => {

  if (!filePath) return;

  try {

    await fs.unlink(filePath);

  } catch (error) {

    console.log(
      "File deletion failed:",
      error.message
    );

  }

};
const controllerForTheUserRegistration= async (req,res)=>{

    try {
       
        const namePattern = /^[A-Za-z ]+$/;
        const emailPattern=/^[A-Za-z0-9\.]+@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com)$/;
        const passwordPattern=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,16}$/;
        const bioPattern = /^[\u0980-\u09FF\s]+$/;

    const user = await User.findOne({
        email:req.body.email
    })
if(user){
    await deleteUploadedFile(req);
  return  res.status(400).send({
        success:false,
        message:"User Already exist with this email id. Please login or register with a different email"
    })}
    
if(!req.body.name){
    await deleteUploadedFile(req);
  return  res.status(400).send({
        success:false,
        message:"user name is required"
    })
}
 if(!namePattern.test(req.body.name)){
    await deleteUploadedFile(req);
     return  res.status(400).send({
        success:false,
        message:"user name can only be string"
    }) 
}

if(!req.file){
   
   return res.status(400).send({
        success:false,
        message:"User Image is required"
    })
}
 if(!req.body.password){
    await deleteUploadedFile(req);
  return  res.status(400).send({
        success:false,
        message:"password is required"
    })
}
 if(!passwordPattern.test(req.body.password)){
    await deleteUploadedFile(req);
 return  res.status(400).send({
        success:false,
        message:"password must follow its pattern"
    }) 
}

if(!emailPattern.test(req.body.email)){
    await deleteUploadedFile(req);
    return  res.status(400).send({
        success:false,
        message:"email must follow its pattern"
    })  
}

if(!req.body.bio){
    await deleteUploadedFile(req);
    return  res.status(400).send({
        success:false,
        message:"Bio Must Be written"
    })  
}

 if(!bioPattern.test(req.body.bio)){
    await deleteUploadedFile(req);
 return  res.status(400).send({
        success:false,
        message:" Bio শুধু মাত্র বাংলা লিখুন"
    })
}
 if(req.body.name.length<3 || req.body.name.length>25){
    await deleteUploadedFile(req);
return  res.status(400).send({
        success:false,
        message:"নাম ৩ থেকে ২৫ character এর মধ্যে হতে হবে।"
    })
}
 if(req.body.bio.length<15 || req.body.bio.length>25){
    await deleteUploadedFile(req);
return  res.status(400).send({
        success:false,
        message:" Bio 15-25 character এর মধ্যে হতে হবে।"
    })
}
//capture
const capture = req.body.capture;
const captureID = req.body.captureID;
const captureDetails = captureStore.get(captureID);
if(!captureDetails){
      await deleteUploadedFile(req);
  return  res.status(400).send({
        success:false,
        message:"Invalid Capture"
    })
}
if(Date.now() > captureDetails.expiresAt){
      await deleteUploadedFile(req);
    captureStore.delete(captureID)
    return res.status(400).send({
        success:false,
        message:"Capture Expired"
    })
}
if(!capture || capture.toUpperCase() !== captureDetails.captureText.toUpperCase()){
      await deleteUploadedFile(req);
    return    res.status(400).send({
        success:false,
        message:"Invalid Capture"
    })
}
  captureStore.delete(captureID)
// capture

//otp verification 
const otp = crypto.randomInt(100000,1000000).toString();
const otpExp = new Date(Date.now() + 5 * 60 * 1000);
// otp verification
const password= req.body.password;

const hashedPassword = await bcrypt.hash(password, 10);

const newUser = new User({

name:req.body.name,
email:req.body.email,
bio:req.body.bio,
userImg:req.file.filename,
password:hashedPassword,
otp:otp,
expiresAt:otpExp
})
await transporter.sendMail({
    from:process.env.EMAIL_USER,
    to:req.body.email,
    subject:"Kolom Verification Code for Registration",
    text:`welcome to KOLOM . Your OTP for verification of  registration at KOLOM is ${otp}. This OTP will expire in 5 minutes.`
})
await newUser.save()

res.status(200).send({
    success: true,
    message: "OTP আপনার email-এ পাঠানো হয়েছে। OTP দিয়ে registration সম্পূর্ণ করুন।"
});



    } catch (error) {
   await deleteUploadedFile(req);
        res.status(500).send({
            success:false,
            message:error.message
        })
    }

}
const verifyOTP = async (req, res) => {

    try {

        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
          await deleteUploadedFileIfUserDeletePost(`uploads/userIMG/${user.userImg}`)
            return res.status(404).send({
                success: false,
                message: "User পাওয়া যায়নি।"
            });
        }

        if (user.otp !== otp) {
        await deleteUploadedFileIfUserDeletePost(`uploads/userIMG/${user.userImg}`)
              await User.deleteOne({ _id: user._id });

    return res.status(400).send({
        success: false,
        message: "ভুল OTP। আপনার registration data মুছে দেওয়া হয়েছে। আবার register করুন।"
    });
        }

        if (user.expiresAt < new Date()) {
             await deleteUploadedFileIfUserDeletePost(`uploads/userIMG/${user.userImg}`)
               await User.deleteOne({ _id: user._id });

    return res.status(400).send({
        success: false,
        message: "OTP-এর সময় শেষ হয়ে গেছে। আপনার registration data মুছে দেওয়া হয়েছে। আবার register করুন।"
    });
        }

        user.isVerified = true;

        user.otp = undefined;
        user.expiresAt = undefined;

        await user.save();

        return res.status(200).send({
            success: true,
            message: "Registration successfully completed. redirecting to login page"
        });

    } catch (error) {

        return res.status(500).send({
            success: false,
            message: error.message
        });

    }
};
const controllerForLoginControl = async(req,res)=>{

const emailPattern=/^[A-Za-z0-9\.]+@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com)$/;
const passwordPattern=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,16}$/;

const email = req.body.email;
const password = req.body.password;
const capture = req.body.capture;
const captureID = req.body.captureID;



if(!email){
  return  res.status(400).send({
        success:false,
        message:"Please enter email id at first"
    })
}
  if(!emailPattern.test(email)){
 return  res.status(400).send({
        success:false,
        message:"please ensure correct email formate"
    })
  }
  if(!password){
     return  res.status(400).send({
        success:false,
        message:"password is must"
    })
  }
  if(!passwordPattern.test(password)){
     return  res.status(400).send({
        success:false,
        message:"password must follow its pattern"
    })
  }
  // capture verification
const captureDetails= captureStore.get(captureID);

if(!captureDetails){
  
     return  res.status(400).send({
        success:false,
        message:"Invalid Capture"
    })
}
if(Date.now()>captureDetails.expiresAt){

    captureStore.delete(captureID)
     return  res.status(400).send({
        success:false,
        message:" Capture Expired"
    })
}
if(!capture || capture.toUpperCase() !== captureDetails.captureText.toUpperCase()){
     return  res.status(400).send({
        success:false,
        message:"wrong capture"
    })
}
 captureStore.delete(captureID)
const foundUser= await User.findOne({email:email})
if(!foundUser){
     return  res.status(400).send({
        success:false,
        message:"User did not find"
    })
}



const isMatch = await bcrypt.compare(password,foundUser.password);

if(!isMatch){
     return  res.status(400).send({
        success:false,
        message:"Password Did Not Match"
    })
}else{
const token = jwt.sign({
    id:foundUser._id,
    email:foundUser.email
},
envData.JWT_SECRET,
{
    expiresIn:"7d"
}
)
return  res.status(200).send({
        success:true,
        message:"User Successfully Logged In. Redirecting to profile..........",
        token:token
    })
}

}

const controllerForTheProfile= async(req,res)=>{
try {
  const foundUser = await User.findById(req.user.id) 
  if(!foundUser) {
    return res.status(400).send({
        success:false,
        message:"No Such User Found"
    })
  }else{
    

     return res.status(200).send({
            success: true,
            user: {
                name: foundUser.name,
                email: foundUser.email,
                bio: foundUser.bio,
                userImg:foundUser.userImg
            }
        });


  }
} catch (error) {
    await deleteUploadedFile(req.file);
         return res.status(500).send({
            success: false,
            message: error.message
        });
}
}
const controllerForTheCapture = (req,res)=>{
try {
const captureID = crypto.randomUUID();
const actualCapture= generateCapture()
// console.log(captureID)
// console.log(actualCapture)

captureStore.set(captureID,{
    captureText:actualCapture,
   expiresAt: Date.now() + 5 * 60 * 1000
})
if(!actualCapture || !captureID){
    res.status(400).send({
        success:false,
        message:"No Capture Generated, Please press on reload button"
    })
}
res.status(200).send({
    captureID:captureID,
    capture:actualCapture
})
} catch (error) {
     res.status(400).send({
        success:false,
        message:error.message
    })
}
}

const deleteProfile = async (req,res)=>{

try {
    
const foundUSer = await User.findOne({email:req.user.email});
if(!foundUSer){
   return res.status(400).send({
        success:false,
        message:"No Such User Found"
    })
}
 await deleteUploadedFileIfUserDeletePost(`uploads/userIMG/${foundUSer.userImg}`)
const deleteUser = await User.findByIdAndDelete(foundUSer._id)
const findStories = await Posts.find({email:foundUSer.email})

for (const story of findStories) {

    await deleteUploadedFileIfUserDeletePost(
        `uploads/writingIMG/${story.storyIMG}`
    );

}

const deletedPosts = await  Posts.deleteMany({email:req.user.email})


if(deleteUser && deletedPosts){
    return res.status(200).send({
        success:true,
        message:"your Profile And All the story have been deleted successfully"
    })


}
} catch (error) {
     return res.status(200).send({
        success:true,
        message:error.message
    })
}
}

module.exports={
controllerForTheUserRegistration,
verifyOTP,
controllerForLoginControl,
controllerForTheProfile,
controllerForTheCapture,
deleteProfile
}