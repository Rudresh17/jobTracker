const express= require("express")
const passport = require("passport")
const router = express.Router()
const jwt = require("jsonwebtoken");
const auth= require("../middleware/auth")




// @desc Auth with Google

router.get("/google",passport.authenticate('google', {scope:['profile','https://www.googleapis.com/auth/gmail.readonly']}))
    

// @desc  Google Auth callback

router.get("/google/callback", passport.authenticate('google',{
    failureRedirect:"/"}) , async (req,res)=>{

    try {
        console.log(req.user)
        const googleId=req.user.googleId 
        const displayName=req.user.displayName
        const token = jwt.sign({ googleId,displayName }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("authToken", token, { httpOnly: true, secure: true,sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", });
        res.redirect(`https://job-tracker-frontend-lake.vercel.app/dashboard`)
    }
    catch(err)
    {
        console.log(err)
    }
    
    
})

router.get("/check", auth , async (req,res) => {

    res.json({ isAuthenticated: true, user: req.user })
})





module.exports=router
