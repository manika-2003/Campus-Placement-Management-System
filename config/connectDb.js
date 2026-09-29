const mongoose = require('mongoose')
const connectDb = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("database connected")
    }
    catch(err){
        console.log("database not connected",err)
    }
}
module.exports = connectDb 