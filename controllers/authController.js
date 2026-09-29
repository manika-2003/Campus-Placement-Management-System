const bcrypt = require('bcrypt')
const User = require("../models/userSchema")
const jwt = require('jsonwebtoken')
const authenticate = async(req,res)=>{
    const userDetails = req.body
    const email = userDetails.email.toLowerCase().trim() 
    const existingUser = await User.findOne({email})
    
    if(!existingUser){
        return res.status(400).json({success:false,message:'Enter valid email'})
    }
    const isMatch = await bcrypt.compare(userDetails.pass,existingUser.password)
    if(!isMatch){
        return res.status(401).json({success:false,message:'Invalid password'})
    }
    const payload = {
        id: existingUser._id,
        username: existingUser.username,
        role: existingUser.role
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
    res.cookie('token',token,{httpOnly:true,maxAge:60*60*1000})
    return res.json({success:true,message:"Login successfully",role:existingUser.role})
}
//logout
const logout = (req,res)=>{
    res.clearCookie('token')
    return res.redirect('/auth/login')
}

//register
const addStudent = async(req,res)=>{

    const newUserDetails = req.body
    const email = newUserDetails.email.toLowerCase().trim() 
    const isEmailExists = await User.findOne({email})
    if(isEmailExists){
        return res.status(400).json({success:false,message:"Email already exists"})
    }
    if(newUserDetails.pass !== newUserDetails.cpass){
        return res.status(400).json({success:false,message:"Password and confirm password must be same"})
    }
    let role = 'student'
    if(newUserDetails.adminSecret){
        if(newUserDetails.adminSecret===process.env.ADMIN_KEY){
            role = 'admin'
        }
        else{
            return res.status(400).json({success:false,message:"Admin key is invalid"})
        }
    }
    const newUser = {
        username:newUserDetails.name,
        email:newUserDetails.email,
        password:newUserDetails.pass,
        role
    }
    await User.create(newUser) 
    res.json({success:true,message:"Student added successfully"})
}
module.exports = {authenticate,addStudent,logout}