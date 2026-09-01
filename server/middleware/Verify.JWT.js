
const jwt = require("jsonwebtoken");
const envData = require("../config/config");

const verifyJWT = (req,res,next) => {

const authHeader = req.headers.authorization;

if(!authHeader){
    return res.status(401).send({
        success:false,
        message:"Login Before Access"
    })
}

try {
    

const token = authHeader.split(" ")[1]

const decode = jwt.verify(token,envData.JWT_SECRET)

req.user=decode
next()

} catch (error) {
    res.status(400).send({
        success:false,
        message:error.message    
    })
}
}

module.exports= verifyJWT

