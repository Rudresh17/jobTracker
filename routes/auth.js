const express= require("express")
const passport = require("passport")
const router = express.Router()
const jwt = require("jsonwebtoken");





// @desc Auth with Google

router.get("/google",passport.authenticate('google', {scope:['profile']}))
    

// @desc  Google Auth callback

router.get("/google/callback", passport.authenticate('google',{
    failureRedirect:"/"}) , (req,res)=>{
    
    const googleId=req.user.googleId 

    

    const token = jwt.sign({ googleId }, "pari", { expiresIn: "1h" });
    
    res.cookie("authToken", token, { httpOnly: true, secure: true });
    res.redirect(`http://localhost:3000/dashboard`)
})







module.exports=router