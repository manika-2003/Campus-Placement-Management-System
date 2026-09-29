const jwt = require('jsonwebtoken')
const verifyToken = (req,res,next)=>{
    const token = req.cookies.token
    if(!token){
        return res.redirect('/auth/login')
    }
    try{
        const data = jwt.verify(token,process.env.JWT_SECRET)
        req.user = data
        next()
    }
    catch(err){
        return res.redirect('/auth/login')
    }
}
module.exports = verifyToken