const Posts = require('../models/posts.schema')
const fs = require('fs/promises');
const User = require('../models/user.schema');


const deleteUploadedFile = async (file) => {
  if (!file) return;

  try {
    await fs.unlink(file.path);
  } catch (error) {
    console.log("File deletion failed:", error.message);
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
const controllerForTheStoryPostedBNyUser = async(req,res)=>{

try {
    
const patternForTheTittle=/^[\u0980-\u09FF\s]+$/
const patternForTheStory = /^[\u0980-\u09FF\s.,!?;:'"“”‘’()\-—–।,?!ঃ]+$/;
// console.log(req.body.tittle)
// console.log(req.file.filename)
// console.log(req.body.story)

if(!req.body.tittle){
     await deleteUploadedFile(req.file);
    return res.status(400).send({
        success:false,
        message:"শিরোনাম খালি থাকবে না"
    })
}

if(!req.file){

    return res.status(400).send({
        success:false,
        message:"গল্পের জন্য ১ টি ছবি অবশ্যই আপলোড করুন"
    })
}

if(!req.body.story){
     await deleteUploadedFile(req.file);
    return res.status(400).send({
        success:false,
        message:"গল্প লিখুন"
    })

    
}

if(!patternForTheTittle.test(req.body.tittle)){
     await deleteUploadedFile(req.file);
      return res.status(400).send({
        success:false,
        message:"শিরোনাম এ শুধু মাত্র বাংলা গ্রহণযোগ্য"
    })
}
if(!patternForTheStory.test(req.body.story)){
     await deleteUploadedFile(req.file);
   return res.status(400).send({
        success:false,
        message:"টেক্সট ফরম্যাট গ্রহণযোগ্য নই "
    })
}
if(req.body.tittle.length<3 || req.body.tittle.length>20){
     await deleteUploadedFile(req.file);
     return res.status(400).send({
        success:false,
        message:"শিরোনাম ৩ থেকে ২০ character এর মধ্যে হতে হবে "
    })
}
if(req.body.story.length<1000 || req.body.story.length>10000000000){
     await deleteUploadedFile(req.file);
       return res.status(400).send({
        success:false,
        message:"গল্প ১০০০ থেকে ১০০০০০০০০০০ character এর মধ্যে হতে হবে"
    })
}
const newData = new Posts({
email:req.user.email,
tittle:req.body.tittle,
storyIMG:req.file.filename,
story:req.body.story
})
await newData.save()

res.status(200).send({
    success:true,
    message:"আপনার গল্প প্রকাশিত হয়েছে।"
})


} catch (error) {
        await deleteUploadedFile(req.file);
    res.status(500).send({
        success:false,
        message:error.message
    })
}

}
const controllerForShowingUserStory= async (req,res)=>{
try {
    
const userEmail = req.user.email;
const foundStory= await Posts.find({email:userEmail})
res.status(200).send({
    success:true,
    stories:foundStory
})



} catch (error) {
    res.status(400).send({
        success:false,
        message:error.message
    })
}
}

const controllerForUnfilteredStoryToShow = async (req,res)=>{
try {
    const allStory = await Posts.find()
res.status(200).send({
    success:true,
    stories:allStory
})
} catch (error) {
    res.status(400).send({
        success:false,
        message:error.message
    })
}
}
const controllerForTheShowingStoryToTheUser = async(req,res)=>{
    
  try {
      const foundStory = await Posts.findById(req.params.id)
      const foundWriter= await User.findOne({email:foundStory.email})
      if(!foundStory){
        res.status(400).send({
            success:false,
            message:"আপনার ্র রিকুয়েস্ট করা গল্পটি পাওয়া যাইনি"
        })
      }
      res.status(200).send({
        success:true,
        story:foundStory,
        writerName:foundWriter
      })
  } catch (error) {
     res.status(200).send({
        success:false,
       message:error.message
      })
  }
}
const controllerForDeletePost = async (req,res)=>{
try {
const id = req.params.id;
const foundStory = await Posts.findById(id)
if(!foundStory){
  return  res.status(400).send({
        success:false,
        message:"No Such Story Found"
    })
}
const deletedStory = await Posts.findByIdAndDelete(id);
if(deletedStory){
   await  deleteUploadedFileIfUserDeletePost(`uploads/writingIMG/${foundStory.storyIMG}`)
   return res.status(200).send({
        success:true,
        message:`${foundStory.tittle} deleted successfully`
    })
}
} catch (error) {
  return  res.status(401).send({
        success:false,
        message:error.message
    })
}
}
module.exports={
    controllerForTheStoryPostedBNyUser,
    controllerForShowingUserStory,
    controllerForUnfilteredStoryToShow,
    controllerForTheShowingStoryToTheUser,
    controllerForDeletePost
}