const cookie=require("cookie-parser")
const jwt=require("jsonwebtoken")
const User=require("../models/user")

require("dotenv").config()

const auth=async (req,res,next)=>{
    try{
        const token=await req.cookies.authToken;
        console.log("inside authorization cookies:",token)
        // console.log(token);
        const verify=jwt.verify(token, process.env.SECRET_KEY);
        console.log(verify);
        console.log("Jwt verified , and secret key is ::", token)

        next();
    }catch(e){
        res.send('authorization error!');
        console.log(e);
        console.log('failed to authorize!!!');
    }
}

module.exports=auth;