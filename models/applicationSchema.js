const mongoose = require("mongoose")

const applicationSchema = new mongoose.Schema({
   userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true 
   },
   appliedJobs:[
      {
         jobId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true
         },
         appliedDate:{
            type: Date,
            default: Date.now
         },
         applicationStatus:{
            type: String,
            enum:["pending","approved","rejected"],
            default:"pending"
         }
      }
   ]
},{timestamps:true})

module.exports = mongoose.model("Application",applicationSchema)