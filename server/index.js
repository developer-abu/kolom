const app = require("./app");
const envData = require("./config/config");
const dbConnection = require("./config/db_connection");
const PORT = envData.PORT || 3000

app.listen(PORT, async ()=>{
    console.log('your server is running')
await dbConnection()
})