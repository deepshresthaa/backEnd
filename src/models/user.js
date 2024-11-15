const mongoose=require("mongoose")
const validator=require("validator")

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        minlength:5,
        maxlength:30,
        required:true,
        unique:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error("Invalid email!!");
            }
        }
    },
    password:{
        type:String,
        minlength:8,
        required:true
    },
    joinedAt:{
        type:Date,
        default:Date.now
    }
});

const User=new mongoose.model("User",userSchema);

module.exports=User;