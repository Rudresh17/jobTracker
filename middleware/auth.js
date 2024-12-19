const jwt = require('jsonwebtoken');
const User= require("../models/User")

const authenticateToken = async (req, res, next) => {
    const token = req.cookies.authToken
    console.log(token,"middlware")
    
    if (!token) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
      }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        const user= await User.find({googleId:verified.googleId})


        req.user = {"user":user}; // Attach user info to request object
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).send("Unauthorized: Token has expired");
        }
        console.log(err)
        res.status(403).send("Invalid Token");
    }
};

module.exports=authenticateToken