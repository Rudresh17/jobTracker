const express= require("express")
const router = express.Router()
const auth= require("../middleware/auth")
const mongoose= require("mongoose")
const User = require("../models/User")
const {google} = require('googleapis');
const axios=require("axios")




const authi = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_SECRET,
    'http://localhost:5000',
  );



const gmail = google.gmail({version: 'v1', authi});  
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
        console.log(err)
        res.send(err)
    }

    

    
})



router.get("/emails",auth,async (req,res)=>{
    
  console.log("In email function");
  let Ids = [];
  let emails = [];
  
  try {
    console.log(req.user);
    const token = req.user.user[0].token;
    console.log("Token:", token);
  
    authi.setCredentials({ access_token: token });
  
    // Fetching the list of messages
    const response = await axios.get('https://gmail.googleapis.com/gmail/v1/users/me/messages', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    Ids = response.data.messages || [];
    console.log("Total messages fetched:", Ids.length);
  
    // Fetch details for the first 10 emails
    for (let i = 0; i < Math.min(10, Ids.length); i++) {
      try {
        const emailResponse = await axios.get(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${Ids[i].id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        

        const headers = emailResponse.data.payload.headers;
        const from = headers.find(header => header.name === 'From')?.value;
        console.log(from)
        const subject = headers.find(header => header.name === 'Subject')?.value;
        const snippet = emailResponse.data.snippet;
  
        // Extract the body content
        const parts = emailResponse.data.payload.parts;
        let body = '';
        if (parts) {
          for (const part of parts) {
            if (part.mimeType === 'text/plain' && part.body.data) {
              body = Buffer.from(part.body.data, 'base64').toString('utf-8');
              break;
            }
          }
        }
  
        // Define or pass your regex here
        const regex = /your-regex-pattern/; // Replace with your regex
        const found = regex.test(snippet);
  
        if (parts) {
          emails.push({ from, subject, body, snippet });
          console.log("Email stored:", { from, subject });
        }
      } catch (err) {
        console.error(`Error fetching email with ID ${Ids[i].id}:`, err.message);
      }
    }
  
    // Send the response with the filtered email data
    console.log(emails)
    res.send(emails);
  } catch (err) {
    console.error("Error fetching messages:", err.message);
    res.status(500).send({ error: "Failed to fetch emails." });
  }
  

  






    
 
    
  
    

    

    
})







module.exports=router