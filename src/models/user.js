const mongoose=require("mongoose")
const bcrypt=require("bcryptjs")
const validator=require("validator")
const jwt=require("jsonwebtoken")

require("dotenv").config();

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
    },
    tokens:[{
        token:{}
    }]
});

//generate jwt
userSchema.methods.generatejwt=async function(){
    try{
        // console.log("inside generate jwt")
        const token=await jwt.sign({_id:this._id},process.env.SECRET_KEY,{expiresIn:"5 minutes"});
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return this.tokens;
    }

    catch(e){
        console.log("Error occured!!")
    }
}

userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password=await  bcrypt.hash(this.password,10);
    }
    next();
})

const User=new mongoose.model("User",userSchema);

module.exports=User;