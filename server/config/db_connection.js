const mongoose= require('mongoose');
const envData = require('./config');

const dbUrl = envData.DB_URL
const dbConnection = async  ()=>{
    try {
     
      await  mongoose.connect(dbUrl)
        console.log("db connection successful")
    } catch (error) {
       console.log(error.message)
    }
}

module.exports= dbConnection