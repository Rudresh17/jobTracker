const express= require("express")
const router = express.Router()
const auth= require("../middleware/auth")
const mongoose= require("mongoose")
const User = require("../models/User")






// @desc Login/Landing Page

router.get("/",(req,res)=>{
    res.send("login page")
})

// @desc Dashboard/

router.get("/data",auth,async (req,res)=>{
    console.log(req.user)

    try{

        const user = await  User.find({'googleId': req.user})
        res.json({"user":user})
    }
    catch(err)
    {
        res.send(err)
    }

    

    
})







module.exports=router