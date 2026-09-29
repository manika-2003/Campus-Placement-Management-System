const express = require('express')
require("dotenv").config();
const app = express()
const cors = require('cors')
const path = require('path')
const connectDb = require('./config/connectDb')
connectDb()
const cookieParser = require('cookie-parser')
const setUser = require('./middlwares/setUser');
const verifyToken = require('./middlwares/auth/isLogin')
const authorizeRole = require('./middlwares/auth/authorizeRole')
app.use(cors())
app.set('view engine','ejs')
app.use(express.static(path.join(__dirname,'public')))
app.use('/uploads', express.static(path.join(__dirname,'uploads')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(setUser)
const userRouter = require('./routes/user')
const adminRoute = require('./routes/admin');
const authRoute = require('./routes/auth')
const homeRoute = require('./routes/home');
app.use('/',homeRoute) 
app.use('/student',verifyToken,authorizeRole('student'),userRouter)
app.use("/auth",authRoute)
app.use('/admin',verifyToken,authorizeRole('admin'),adminRoute)
app.use((req,res)=>{
    res.status(404).json({message:"page not found"})
})
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});