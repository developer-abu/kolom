const upload = require('../config/multer.user')
const { controllerForTheUserRegistration,controllerForLoginControl,controllerForTheProfile,controllerForTheCapture, verifyOTP, deleteProfile } = require('../controller/user.controller')
const verifyJWT  = require('../middleware/Verify.JWT')


const router = require('express').Router()


router.post('/register', upload.single('userImg'), controllerForTheUserRegistration)
router.post('/login',controllerForLoginControl)
router.get('/self-profile',verifyJWT,controllerForTheProfile)
router.get('/capture',controllerForTheCapture)
router.post('/verify-otp',verifyOTP)
router.delete('/delete/profile',verifyJWT,deleteProfile)




module.exports=router