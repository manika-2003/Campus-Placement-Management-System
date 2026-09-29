const mongoose = require("mongoose")

const jobSchema = new mongoose.Schema({
    jobTitle:{
        type:String,
        required:true,
        trim:true
    },
    companyName:{
        type:String,
        required:true,
        trim:true
    },
    location:{
        type:String,
        required:true,
        trim:true
    },
    package:{
        type:String,
        required:true
    },
    eligibilityCriteria:{
        type:String,
        required:true
    },
    lastDateToApply:{
        type:Date,
        required:true
    }
},{timestamps:true})

module.exports = mongoose.model("Job",jobSchema)