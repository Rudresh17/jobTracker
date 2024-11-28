const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    console.log(req.cookies)
    const token = req.cookies.authToken; // Retrieve token from cookies
    if (!token) return res.status(401).send("Unauthorized");

    try {
        const verified = jwt.verify(token, "pari");
        req.user = verified.googleId; // Attach user info to request object
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