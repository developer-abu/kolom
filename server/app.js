const express = require('express');
const router  = require('./router/user.router');
const routerForPosts = require('./router/user.post.router');
const app = express();
const multer = require('multer')
const cors = require("cors");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router)
app.use(routerForPosts)


//multer error handling 
app.use((error, req, res, next) => {

    if (error instanceof multer.MulterError) {

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    return res.status(400).json({
        success: false,
        message: error.message
    });
});


module.exports= app