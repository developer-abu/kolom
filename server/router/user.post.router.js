const uploadForPost = require('../config/multer.post');
const { controllerForTheStoryPostedBNyUser,controllerForShowingUserStory,controllerForUnfilteredStoryToShow,controllerForTheShowingStoryToTheUser,controllerForDeletePost} = require('../controller/user.post.controller');
const verifyJWT = require('../middleware/Verify.JWT');


const routerForPosts = require('express').Router()

routerForPosts.post('/self-profile',verifyJWT,    uploadForPost.single('storyIMG'), controllerForTheStoryPostedBNyUser)
routerForPosts.get('/self-profile/posts',verifyJWT,controllerForShowingUserStory);
routerForPosts.get('/show-story',controllerForUnfilteredStoryToShow)
routerForPosts.get('/story/:id',verifyJWT,controllerForTheShowingStoryToTheUser)
routerForPosts.delete('/delete/:id',verifyJWT,controllerForDeletePost)

module.exports=routerForPosts;