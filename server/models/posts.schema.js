const mongoose = require("mongoose");

const schemaForPost = new mongoose.Schema({
        email: {
        type: String,
        required: true
    },
    tittle: {
        type: String,
        required: true,
         maxLength: [20, 'Bio সর্বচ্চ ২০ character হবে।'],
        minLength: [3, 'Bio সর্বনিম্ন ৩ character হবে।'],
    },
    storyIMG: {
        type: String,
        required: true
    },
    story: {
        type: String,
        required: true,
        maxLength: [10000000000, 'Bio সর্বচ্চ ১০০০০০০০০০ character হবে।'],
        minLength: [1000, 'Bio সর্বনিম্ন ১০০ character হবে।'],
    }
});

module.exports= mongoose.model("Posts", schemaForPost)