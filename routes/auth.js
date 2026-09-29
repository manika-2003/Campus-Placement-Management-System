const express = require('express')
const router = express.Router()
const {authenticate,addStudent,logout} = require('../controllers/authController')
router.get("/login",(req,res)=>{
    res.render('auth/login')
})
router.post('/login',authenticate)
//logout
router.get("/logout",logout)
//register
router.get('/register',(req,res)=>{
    res.render("auth/register")
})
router.post('/register',addStudent)
module.exports = router