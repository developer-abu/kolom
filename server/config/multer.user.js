const multer = require("multer");



const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  

    if(file.mimetype === "image/jpeg" ||file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(new Error("Only JPG, JPEG and PNG images are allowed"), false);
    }

};

const upload = multer({
    storage: storage,

    limits: {
        fileSize: 200 * 1024 * 200 // 2 MB
    },

    fileFilter: fileFilter
});

module.exports = upload;