const  mongoose=require("mongoose")
require("dotenv").config();

mongoose.connect(process.env.DATABASE)
.then(()=>console.log("database connected!!"))
.catch(e=>console.log("failed to connect database!"));