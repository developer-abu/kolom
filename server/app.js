const express = require('express');
const router  = require('./router/user.router');
const routerForPosts = require('./router/user.post.router');
const app = express();

const cors = require("cors");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router)
app.use(routerForPosts)

module.exports= app