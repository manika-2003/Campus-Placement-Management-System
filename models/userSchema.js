const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },

    role:{
        type:String,
        required:true
    },

    profilePic:{
        type:String,     
        default:"default.png"
    },
    skills:[
        {
            type:String
        }
    ],
    resume:{
        type:String      
    },

    about:{
        type:String
    }
},{
    timestamps:true   
})
userSchema.pre("save",async function(){
    if(!this.isModified("password")){
        return 
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
    
})
const User = new mongoose.model("User",userSchema)
module.exports = User 
