require("dotenv").config({ path: "../.env" });

const User = require("../models/user.schema");
const Posts = require("../models/posts.schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const envData = require("../config/config");
const cloudinary = require("../config/cloudinary");

const {
    captureStore,
    generateCapture,
    crypto
} = require("../verification/capture");

const transporter = require("../config/mailer");


// ======================================================
// CLOUDINARY UPLOAD HELPER
// ======================================================

const uploadToCloudinary = (fileBuffer, folder) => {

    return new Promise((resolve, reject) => {

        const uploadStream =
            cloudinary.uploader.upload_stream(
                {
                    folder: folder
                },

                (error, result) => {

                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }

                }
            );

        uploadStream.end(fileBuffer);
    });
};


// ======================================================
// REGISTRATION
// ======================================================

const controllerForTheUserRegistration = async (req, res) => {

    let cloudinaryResult = null;

    let newUser = null;

    try {

        // ==========================

        // PATTERNS

        // ==========================

        const namePattern = /^[A-Za-z ]+$/;

        const emailPattern =
            /^[A-Za-z0-9.]+@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com)$/;

        const passwordPattern =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,16}$/;

        const bioPattern =
            /^[\u0980-\u09FF\s]+$/;



        // ==========================

        // CHECK EXISTING USER

        // ==========================

        const user = await User.findOne({
            email: req.body.email
        });

        if (user) {

            return res.status(400).send({
                success: false,
                message:
                    "User Already exist with this email id. Please login or register with a different email"
            });

        }



        // ==========================

        // NAME

        // ==========================

        if (!req.body.name) {

            return res.status(400).send({
                success: false,
                message: "user name is required"
            });

        }



        if (!namePattern.test(req.body.name)) {

            return res.status(400).send({
                success: false,
                message: "user name can only be string"
            });

        }



        if (
            req.body.name.length < 3 ||
            req.body.name.length > 25
        ) {

            return res.status(400).send({
                success: false,
                message:
                    "নাম ৩ থেকে ২৫ character এর মধ্যে হতে হবে।"
            });

        }



        // ==========================

        // IMAGE

        // ==========================

        if (!req.file) {

            return res.status(400).send({
                success: false,
                message: "User Image is required"
            });

        }



        // ==========================

        // PASSWORD

        // ==========================

        if (!req.body.password) {

            return res.status(400).send({
                success: false,
                message: "password is required"
            });

        }



        if (!passwordPattern.test(req.body.password)) {

            return res.status(400).send({
                success: false,
                message:
                    "password must follow its pattern"
            });

        }



        // ==========================

        // EMAIL

        // ==========================

        if (!emailPattern.test(req.body.email)) {

            return res.status(400).send({
                success: false,
                message:
                    "email must follow its pattern"
            });

        }



        // ==========================

        // BIO

        // ==========================

        if (!req.body.bio) {

            return res.status(400).send({
                success: false,
                message: "Bio Must Be written"
            });

        }



        if (!bioPattern.test(req.body.bio)) {

            return res.status(400).send({
                success: false,
                message:
                    "Bio শুধু মাত্র বাংলা লিখুন"
            });

        }



        if (
            req.body.bio.length < 15 ||
            req.body.bio.length > 25
        ) {

            return res.status(400).send({
                success: false,
                message:
                    "Bio 15-25 character এর মধ্যে হতে হবে।"
            });

        }



        // ==========================

        // CAPTURE VERIFICATION

        // ==========================

        const capture = req.body.capture;

        const captureID = req.body.captureID;

        const captureDetails =
            captureStore.get(captureID);



        if (!captureDetails) {

            return res.status(400).send({
                success: false,
                message: "Invalid Capture"
            });

        }



        if (
            Date.now() >
            captureDetails.expiresAt
        ) {

            captureStore.delete(captureID);

            return res.status(400).send({
                success: false,
                message: "Capture Expired"
            });

        }



        if (
            !capture ||
            capture.toUpperCase() !==
            captureDetails.captureText.toUpperCase()
        ) {

            return res.status(400).send({
                success: false,
                message: "Invalid Capture"
            });

        }



        captureStore.delete(captureID);



        // ==========================

        // OTP

        // ==========================

        const otp =
            crypto.randomInt(100000, 1000000)
                .toString();

        const otpExp =
            new Date(
                Date.now() + 5 * 60 * 1000
            );



        // ==========================

        // HASH PASSWORD

        // ==========================

        const hashedPassword =
            await bcrypt.hash(
                req.body.password,
                10
            );



        // ==========================

        // CLOUDINARY UPLOAD

        // ==========================

        cloudinaryResult =
            await uploadToCloudinary(
                req.file.buffer,
                "kolom/users"
            );



        // ==========================

        // CREATE USER

        // ==========================

        newUser = new User({

            name: req.body.name,

            email: req.body.email,

            bio: req.body.bio,

            userImg:
                cloudinaryResult.secure_url,

            userImgPublicId:
                cloudinaryResult.public_id,

            password: hashedPassword,

            otp: otp,

            expiresAt: otpExp

        });



        // ==========================

        // SAVE USER

        // ==========================

        await newUser.save();



        // ==========================

        // SEND OTP

        // ==========================
//CHECK 
console.log("OTP GENERATED:", otp);
console.log("EMAIL FROM:", process.env.EMAIL_USER);
console.log("EMAIL TO:", req.body.email);
console.log("STARTING EMAIL SEND...");
//CHECK
 const res =       await transporter.sendMail({

            from: process.env.EMAIL_USER,

            to: req.body.email,

            subject:
                "Kolom Verification Code for Registration",

            text:
                `Welcome to KOLOM. Your OTP for verification of registration at KOLOM is ${otp}. This OTP will expire in 5 minutes.`

        });

console.log("EMAIL SENT RESULT:", res);

        // ==========================

        // SUCCESS

        // ==========================

        return res.status(200).send({

            success: true,

            message:
                "OTP আপনার email-এ পাঠানো হয়েছে। OTP দিয়ে registration সম্পূর্ণ করুন।"

        });

    }

    catch (error) {

        // ==========================

        // DELETE USER IF CREATED

        // ==========================

        if (newUser?._id) {

            try {

                await User.deleteOne({

                    _id: newUser._id

                });

            }

            catch (deleteError) {

                console.log(
                    "User cleanup failed:",
                    deleteError.message
                );

            }

        }



        // ==========================

        // DELETE CLOUDINARY IMAGE

        // ==========================

        if (cloudinaryResult?.public_id) {

            try {

                await cloudinary.uploader.destroy(

                    cloudinaryResult.public_id

                );

            }

            catch (cloudinaryError) {

                console.log(
                    "Cloudinary cleanup failed:",
                    cloudinaryError.message
                );

            }

        }



        return res.status(500).send({

            success: false,

            message: error.message

        });

    }

};


// ======================================================
// VERIFY OTP
// ======================================================

const verifyOTP = async (req, res) => {

    try {

        const {
            email,
            otp
        } = req.body;


        const user =
            await User.findOne({
                email
            });


        // ==========================
        // USER NOT FOUND
        // ==========================

        if (!user) {

            return res.status(404).send({
                success: false,
                message:
                    "User পাওয়া যায়নি।"
            });

        }


        // ==========================
        // WRONG OTP
        // ==========================

        if (user.otp !== otp) {

            if (user.userImgPublicId) {

                try {

                    await cloudinary.uploader.destroy(
                        user.userImgPublicId
                    );

                } catch (error) {

                    console.log(
                        "Cloudinary cleanup failed:",
                        error.message
                    );

                }

            }


            await User.deleteOne({
                _id: user._id
            });


            return res.status(400).send({
                success: false,
                message:
                    "ভুল OTP। আপনার registration data মুছে দেওয়া হয়েছে। আবার register করুন।"
            });

        }


        // ==========================
        // OTP EXPIRED
        // ==========================

        if (!user.expiresAt || user.expiresAt < new Date()) {

            if (user.userImgPublicId) {

                try {

                    await cloudinary.uploader.destroy(
                        user.userImgPublicId
                    );

                } catch (error) {

                    console.log(
                        "Cloudinary cleanup failed:",
                        error.message
                    );

                }

            }


            await User.deleteOne({
                _id: user._id
            });


            return res.status(400).send({
                success: false,
                message:
                    "OTP-এর সময় শেষ হয়ে গেছে। আপনার registration data মুছে দেওয়া হয়েছে। আবার register করুন।"
            });

        }


        // ==========================
        // OTP CORRECT
        // ==========================

        user.isVerified = true;
        user.otp = undefined;
        user.expiresAt = undefined;


        await user.save();


        return res.status(200).send({
            success: true,
            message:
                "Registration successfully completed. redirecting to login page"
        });

    }

    catch (error) {

        return res.status(500).send({
            success: false,
            message: error.message
        });

    }

};


// ======================================================
// LOGIN
// ======================================================

const controllerForLoginControl =
    async (req, res) => {

        try {

            const emailPattern =
                /^[A-Za-z0-9.]+@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com)$/;

            const passwordPattern =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,16}$/;


            const email = req.body.email;
            const password = req.body.password;

            const capture = req.body.capture;
            const captureID = req.body.captureID;


            // ==========================
            // EMAIL
            // ==========================

            if (!email) {

                return res.status(400).send({

                    success: false,

                    message:
                        "Please enter email id at first"

                });
            }


            if (!emailPattern.test(email)) {

                return res.status(400).send({

                    success: false,

                    message:
                        "please ensure correct email formate"

                });
            }


            // ==========================
            // PASSWORD
            // ==========================

            if (!password) {

                return res.status(400).send({

                    success: false,

                    message:
                        "password is must"

                });
            }


            if (!passwordPattern.test(password)) {

                return res.status(400).send({

                    success: false,

                    message:
                        "password must follow its pattern"

                });
            }


            // ==========================
            // CAPTURE
            // ==========================

            const captureDetails =
                captureStore.get(captureID);


            if (!captureDetails) {

                return res.status(400).send({

                    success: false,

                    message:
                        "Invalid Capture"

                });
            }


            if (
                Date.now() >
                captureDetails.expiresAt
            ) {

                captureStore.delete(captureID);

                return res.status(400).send({

                    success: false,

                    message:
                        "Capture Expired"

                });
            }


            if (
                !capture ||
                capture.toUpperCase() !==
                captureDetails.captureText.toUpperCase()
            ) {

                return res.status(400).send({

                    success: false,

                    message:
                        "wrong capture"

                });
            }


            captureStore.delete(captureID);


            // ==========================
            // FIND USER
            // ==========================

            const foundUser =
                await User.findOne({
                    email: email
                });


            if (!foundUser) {

                return res.status(400).send({

                    success: false,

                    message:
                        "User did not find"

                });
            }


            // ==========================
            // VERIFY REGISTRATION
            // ==========================

            if (!foundUser.isVerified) {

                return res.status(400).send({

                    success: false,

                    message:
                        "Please complete OTP verification first."

                });
            }


            // ==========================
            // PASSWORD CHECK
            // ==========================

            const isMatch =
                await bcrypt.compare(
                    password,
                    foundUser.password
                );


            if (!isMatch) {

                return res.status(400).send({

                    success: false,

                    message:
                        "Password Did Not Match"

                });
            }


            // ==========================
            // JWT
            // ==========================

            const token = jwt.sign(

                {
                    id: foundUser._id,
                    email: foundUser.email
                },

                envData.JWT_SECRET,

                {
                    expiresIn: "7d"
                }

            );


            return res.status(200).send({

                success: true,

                message:
                    "User Successfully Logged In. Redirecting to profile..........",

                token: token

            });

        }

        catch (error) {

            return res.status(500).send({

                success: false,

                message: error.message

            });
        }
    };


// ======================================================
// PROFILE
// ======================================================

const controllerForTheProfile =
    async (req, res) => {

        try {

            const foundUser =
                await User.findById(
                    req.user.id
                );


            if (!foundUser) {

                return res.status(400).send({

                    success: false,

                    message:
                        "No Such User Found"

                });
            }


            return res.status(200).send({

                success: true,

                user: {

                    name: foundUser.name,

                    email: foundUser.email,

                    bio: foundUser.bio,

                    userImg:
                        foundUser.userImg

                }

            });

        }

        catch (error) {

            return res.status(500).send({

                success: false,

                message: error.message

            });
        }
    };


// ======================================================
// GENERATE CAPTURE
// ======================================================

const controllerForTheCapture =
    (req, res) => {

        try {

            const captureID =
                crypto.randomUUID();

            const actualCapture =
                generateCapture();


            captureStore.set(
                captureID,
                {
                    captureText:
                        actualCapture,

                    expiresAt:
                        Date.now() +
                        5 * 60 * 1000
                }
            );


            if (
                !actualCapture ||
                !captureID
            ) {

                return res.status(400).send({

                    success: false,

                    message:
                        "No Capture Generated, Please press on reload button"

                });
            }


            return res.status(200).send({

                captureID:
                    captureID,

                capture:
                    actualCapture

            });

        }

        catch (error) {

            return res.status(400).send({

                success: false,

                message:
                    error.message

            });
        }
    };


// ======================================================
// DELETE PROFILE
// ======================================================

const deleteProfile =
    async (req, res) => {

        try {

            const foundUser =
                await User.findOne({
                    email: req.user.email
                });


            // ==========================
            // USER NOT FOUND
            // ==========================

            if (!foundUser) {

                return res.status(400).send({

                    success: false,

                    message:
                        "No Such User Found"

                });
            }


            // ==========================
            // FIND ALL STORIES FIRST
            // ==========================

            const findStories =
                await Posts.find({
                    email: foundUser.email
                });


            // ==========================
            // DELETE PROFILE IMAGE
            // ==========================

            if (foundUser.userImgPublicId) {

                try {

                    await cloudinary.uploader.destroy(
                        foundUser.userImgPublicId
                    );

                } catch (error) {

                    console.log(
                        "Profile image deletion failed:",
                        error.message
                    );

                }
            }


            // ==========================
            // DELETE STORY IMAGES
            // ==========================

            for (const story of findStories) {

                if (story.storyIMGPublicId) {

                    try {

                        await cloudinary.uploader.destroy(
                            story.storyIMGPublicId
                        );

                    } catch (error) {

                        console.log(
                            "Story image deletion failed:",
                            error.message
                        );

                    }
                }
            }


            // ==========================
            // DELETE ALL STORIES
            // ==========================

            await Posts.deleteMany({
                email: foundUser.email
            });


            // ==========================
            // DELETE USER
            // ==========================

            await User.deleteOne({
                _id: foundUser._id
            });


            return res.status(200).send({

                success: true,

                message:
                    "your Profile And All the story have been deleted successfully"

            });

        }

        catch (error) {

            return res.status(500).send({

                success: false,

                message: error.message

            });
        }
    };


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    controllerForTheUserRegistration,

    verifyOTP,

    controllerForLoginControl,

    controllerForTheProfile,

    controllerForTheCapture,

    deleteProfile

};