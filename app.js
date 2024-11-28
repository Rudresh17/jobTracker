const express = require('express')
const dotenv= require("dotenv")
const connectDB= require("./config/db")
const morgan = require('morgan')
const cors=require("cors")
const passport= require("passport")
const session= require("express-session")
const cookieParser = require("cookie-parser");


// load config
dotenv.config({path:"./config/config.env"})
//passport config

require("./config/passport")(passport)
connectDB()

//passport middleware
const app = express()

const corsOptions ={
  origin:'http://localhost:3000', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
app.use(cors(corsOptions)); 
app.use(cookieParser());
//sessions middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    //cookie: { secure: true }
  }))

app.use(passport.initialize())
app.use(passport.session())

if (process.env.NODE_ENV==="development"){
    app.use(morgan("dev"))
}

//routes

app.use("/",require("./routes/index"))
app.use("/auth",require("./routes/auth"))

const PORT= process.env.PORT || 5000

app.listen(PORT,console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}` ))