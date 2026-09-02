const Posts = require("../models/posts.schema");
const User = require("../models/user.schema");
const cloudinary = require("../config/cloudinary");


// ======================================================
// CLOUDINARY UPLOAD HELPER
// ======================================================

const uploadToCloudinary = (fileBuffer) => {

    return new Promise((resolve, reject) => {

        const uploadStream =
            cloudinary.uploader.upload_stream(
                {
                    folder: "kolom/stories"
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
// POST / PUBLISH STORY
// ======================================================

const controllerForTheStoryPostedBNyUser = async (req, res) => {

    let cloudinaryResult = null;
    let newData = null;

    try {

        const patternForTheTittle =
            /^[\u0980-\u09FF\s]+$/;

        const patternForTheStory =
            /^[\u0980-\u09FF\s.,!?;:'"“”‘’()\\-—–।,?!ঃ]+$/;


        // ==========================
        // TITLE REQUIRED
        // ==========================

        if (!req.body.tittle) {

            return res.status(400).send({

                success: false,

                message:
                    "শিরোনাম খালি থাকবে না"

            });
        }


        // ==========================
        // IMAGE REQUIRED
        // ==========================

        if (!req.file) {

            return res.status(400).send({

                success: false,

                message:
                    "গল্পের জন্য ১ টি ছবি অবশ্যই আপলোড করুন"

            });
        }


        // ==========================
        // STORY REQUIRED
        // ==========================

        if (!req.body.story) {

            return res.status(400).send({

                success: false,

                message:
                    "গল্প লিখুন"

            });
        }


        // ==========================
        // TITLE PATTERN
        // ==========================

        if (
            !patternForTheTittle.test(
                req.body.tittle
            )
        ) {

            return res.status(400).send({

                success: false,

                message:
                    "শিরোনাম এ শুধু মাত্র বাংলা গ্রহণযোগ্য"

            });
        }


        // ==========================
        // STORY PATTERN
        // ==========================

        if (
            !patternForTheStory.test(
                req.body.story
            )
        ) {

            return res.status(400).send({

                success: false,

                message:
                    "টেক্সট ফরম্যাট গ্রহণযোগ্য নই"

            });
        }


        // ==========================
        // TITLE LENGTH
        // ==========================

        if (
            req.body.tittle.length < 3 ||
            req.body.tittle.length > 20
        ) {

            return res.status(400).send({

                success: false,

                message:
                    "শিরোনাম ৩ থেকে ২০ character এর মধ্যে হতে হবে"

            });
        }


        // ==========================
        // STORY LENGTH
        // ==========================

        if (
            req.body.story.length < 1000 ||
            req.body.story.length > 10000000000
        ) {

            return res.status(400).send({

                success: false,

                message:
                    "গল্প ১০০০ থেকে ১০০০০০০০০০০ character এর মধ্যে হতে হবে"

            });
        }


        // ==========================
        // CLOUDINARY UPLOAD
        // ==========================

        cloudinaryResult =
            await uploadToCloudinary(
                req.file.buffer
            );


        // ==========================
        // CREATE STORY
        // ==========================

        newData = new Posts({

            email: req.user.email,

            tittle: req.body.tittle,

            storyIMG:
                cloudinaryResult.secure_url,

            storyIMGPublicId:
                cloudinaryResult.public_id,

            story: req.body.story

        });


        // ==========================
        // SAVE STORY
        // ==========================

        await newData.save();


        // ==========================
        // SUCCESS
        // ==========================

        return res.status(200).send({

            success: true,

            message:
                "আপনার গল্প প্রকাশিত হয়েছে।"

        });


    } catch (error) {

        // ==========================
        // DELETE MONGODB STORY
        // ==========================

        if (newData?._id) {

            try {

                await Posts.deleteOne({
                    _id: newData._id
                });

            } catch (deleteError) {

                console.log(
                    "Story cleanup failed:",
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

            } catch (cloudinaryError) {

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
// SHOW USER'S OWN STORIES
// ======================================================

const controllerForShowingUserStory = async (req, res) => {

    try {

        const userEmail = req.user.email;


        const foundStory =
            await Posts.find({
                email: userEmail
            });


        return res.status(200).send({

            success: true,

            stories: foundStory

        });


    } catch (error) {

        return res.status(400).send({

            success: false,

            message: error.message

        });
    }
};


// ======================================================
// SHOW ALL STORIES
// ======================================================

const controllerForUnfilteredStoryToShow =
    async (req, res) => {

        try {

            const allStory =
                await Posts.find();


            return res.status(200).send({

                success: true,

                stories: allStory

            });


        } catch (error) {

            return res.status(400).send({

                success: false,

                message: error.message

            });
        }
    };


// ======================================================
// SHOW SINGLE STORY
// ======================================================

const controllerForTheShowingStoryToTheUser =
    async (req, res) => {

        try {

            const foundStory =
                await Posts.findById(
                    req.params.id
                );


            // ==========================
            // STORY NOT FOUND
            // ==========================

            if (!foundStory) {

                return res.status(404).send({

                    success: false,

                    message:
                        "আপনার রিকুয়েস্ট করা গল্পটি পাওয়া যায়নি"

                });
            }


            // ==========================
            // FIND WRITER
            // ==========================

            const foundWriter =
                await User.findOne({
                    email: foundStory.email
                });


            return res.status(200).send({

                success: true,

                story: foundStory,

                writerName: foundWriter

            });


        } catch (error) {

            return res.status(500).send({

                success: false,

                message: error.message

            });
        }
    };


// ======================================================
// DELETE STORY
// ======================================================

const controllerForDeletePost = async (req, res) => {

    try {

        const id = req.params.id;


        // ==========================
        // FIND STORY
        // ==========================



const foundStory = await Posts.findOne({
    _id: id,
    email: req.user.email
});


        if (!foundStory) {

            return res.status(404).send({

                success: false,

                message:
                    "No Such Story Found"

            });
        }


        // ==========================
        // DELETE CLOUDINARY IMAGE
        // ==========================

        if (foundStory.storyIMGPublicId) {

            try {

                await cloudinary.uploader.destroy(
                    foundStory.storyIMGPublicId
                );

            } catch (cloudinaryError) {

                return res.status(500).send({

                    success: false,

                    message:
                        "Story image could not be deleted from Cloudinary."

                });
            }
        }


        // ==========================
        // DELETE MONGODB STORY
        // ==========================

        const deletedStory =
            await Posts.findByIdAndDelete(id);


        if (!deletedStory) {

            return res.status(404).send({

                success: false,

                message:
                    "Story could not be deleted"

            });
        }


        // ==========================
        // SUCCESS
        // ==========================

        return res.status(200).send({

            success: true,

            message:
                `${foundStory.tittle} deleted successfully`

        });


    } catch (error) {

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

    controllerForTheStoryPostedBNyUser,

    controllerForShowingUserStory,

    controllerForUnfilteredStoryToShow,

    controllerForTheShowingStoryToTheUser,

    controllerForDeletePost

};