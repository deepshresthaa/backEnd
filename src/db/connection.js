const  mongoose=require("mongoose")
mongoose.connect("mongodb://localhost:27017/login-registration")
.then(()=>console.log("database connected!!"))
.catch(e=>console.log("failed to connect database!"));