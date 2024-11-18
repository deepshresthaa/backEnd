const express=require("express");
require("./db/connection");
const User=require("./models/user");
const hbs=require("hbs");
const path=require("path");
const bcrypt=require("bcryptjs");
// const { default: isEmail } = require("validator/lib/isEmail");
const jwt=require("jsonwebtoken");
const { default: isEmail } = require("validator/lib/isEmail");
const auth=require("./middleware/auth");
const cookie=require("cookie-parser")

const app=express();
const port=process.env.PORT || 4002;
app.use(express.json())
app.use(express.urlencoded({extended:false}));
app.use(cookie());
// const static_dir=path.join(process.);
const views_path=path.join(__dirname,"./templates/views");
const partials_path=path.join(__dirname,"./templates/partials");


app.use(express.static(process.env.STATIC_DIRECTORY));


//for template engine
app.set("view engine","hbs");

app.set("views",views_path);


///for partial
hbs.registerPartials(partials_path);


///////// routing start::::::::::::

app.get("/",(req,res)=>{
    res.render("index")
})


app.post("/users",async (req,res)=>{

    // console.log(req.body);
        try{
            const user=new User(req.body);
            await user.save();
            res.status(201).send("New user created!!")
        }
        catch(e){
            console.log(e," Something is wrong");
            res.status(400).send("User already exists!!")
        }
});

//get request

app.get("/users",async (req,res)=>{
    try{
        const data = await User.find();
        res.status(200).send(data);
    }
    catch(e){
        res.status(500).send("Server side error!!");
        console.log(e);
    }


});

app.get("/users/:email",async(req,res)=>{

    try{
        const email=req.params.email;
        const user=await User.find({email});
        if(!user.length){
            res.status(404).send("404 error! User doesn't exist!")
        }else{

            res.status(200).send(user);
        }
    }
    catch(e){
        res.status(500).send("Server side error!!");
    }
})


//patch request



app.patch("/users/:id",async (req,res)=>{
    const id=req.params.id;
    const newEmail=await req.body.email;
    const updated=await User.updateMany({_id:id},{$set:{"email":newEmail}});
    res.send(updated)
    console.log(updated)
})

//delete request 
app.delete("/users/:id", async (req,res)=>{
    const id=req.params.id;
    const deleted =await User.deleteMany({_id:id})
    console.log(deleted);
    res.send(deleted);

})


app.get("/users/:username",async (req,res)=>{

    try{
        const username=req.params.username;
        const data=await User.find({username});

        if(data){
            res.status(200).send(data);
        }
        else{
            res.status(404).send("user doesn't exists!");
        }

    }
    catch(e){
        res.status.send("Server side error!")
    }
});


//registration

app.get("/registration",(req,res)=>{
    res.render("registration")
})

//registration post 
app.post("/registration",async ( req,res)=>{
    try{
        const data=req.body;
        console.log(data);
        const username=data.username;
        const email=data.email;
        // const userVal=await User.find({username});
        // const emailVal=await User.find({email});
        // console.log(Boolean(userVal))
        // console.log(Boolean(emailVal));

        // console.log(typeof([]));/\

        // console.log(userVal.length)
        // console.log(emailVal.length);
        if(await User.findOne({username})){
            // const newUser=new User(req.body);
            // await newUser.save()
            res.send("User with this username already exists!");
        }
        else if(await User.findOne({email})){
            res.send("User with this email already exists!")
        }
        else{
            const newUser=new User(data);
            
            //jwt adding
            const token=await newUser.generatejwt();
            console.log("the token part is : " ,token);

            res.cookie("authToken",token,{
                expires:new Date(Date.now()+300000),
                httpOnly:true
            });
            // console.log(cookie);
            // console.log(req.cookies.jwt)

            await newUser.save();
            res.status(201).send(`Hi, ${data.username}!. Welcome to quizy suizy!`)

        }
    }
    catch(e){
        res.send("Server Error!");
    }


    // const username=req.body.username;
    // res.send(req.params)
    // // res.send(data)
    // // const username=data.username;
    // // res.send(username)
    // const val=await User.find({username})
    // res.send(val);
    // console.log(val);
})

//login get
app.get("/login",(req,res)=>{
    res.render("login");
})

//login post
app.post("/login", async ( req,res)=>{
    // console.log(req.body)
    // res.send(req.body);
    const data=req.body;
    console.log(data)
    //check if email exist already in database or not, if exist check password , if both correct show their dashboard
    const checkEmail=await User.findOne({email:data.email});
    console.log(checkEmail)
    if(checkEmail){
        console.log("email chai milyo hai !");
        // res.send("email chai milyo hai!!")
        //email pahilai register vaisakeko vetiyesi
        // const checkPassword=await User.find({password:data.password});
        // console.log(data.password)

        // console.log(checkEmail)
        // console.log(checkEmail[0].password);
        const checkPassword=await bcrypt.compare(data.password,checkEmail.password);
        // console.log(checkPassword);

        const token=await checkEmail.generatejwt();
        res.cookie("authToken",token,{
            expires:new Date(Date.now()+30000),
            httpOnly:true
        })
        // res.send(res.cookie)
        // console.log(res.cookie);
        if(checkPassword){

            console.log(checkEmail.tokens[0].token)
            console.log("Login successful!✅✅");
            res.send(`Welcome ${checkEmail.username}!, To you quiz dashboard!🏆 </form>
      <form action="/secret" method="GET">
        <input type="submit" value="Secret">
      </form>`)

        }else{
            res.send("Incorrect password!❌");
            console.log("Incorrect password!❌");
        }
    }else{
        res.send("Register first to login!!");
    }

    //if username already exist respond with username is used , try another username


    //if username is unique

});





//testing


app.get("/secret",auth,(req,res)=>{
    res.send("Genuine user!!!");
})

//server listening
app.listen(port,()=>{
    console.log(`listening to port: ${port}`)
})