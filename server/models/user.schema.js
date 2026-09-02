const mongoose = require("mongoose");

const schemaForTheUserRegistration = new mongoose.Schema({
    name: {
        type: String,
        required: true,
           maxLength: [25, 'Bio সর্বচ্চ ২৫ character হবে।'],
        minLength: [3, 'Bio সর্বনিম্ন ৩ character হবে।'],
    },
    userImg: {
        type: String,
        required: true
    },
    userImgPublicId: {
    type: String,
    required: true
},
    email: {
        type: String,
        required: true,
        unique: true
    },
    bio: {
        type: String,
        required: true,
        maxLength: [25, 'Bio সর্বচ্চ ২৫ character হবে।'],
        minLength: [15, 'Bio সর্বনিম্ন ১৫ character হবে।'],
    },
    password: {
        type: String,
        required: true,
    },
    otp:{
        type:String
    },
    expiresAt:{
        type:Date
    },
     isVerified: {
        type: Boolean,
        default: false
    }
});

module.exports= mongoose.model("User",schemaForTheUserRegistration)