const express=require("express");
require("./db/connection");
const User=require("./models/user");
const hbs=require("hbs");
const path=require("path");
const bcrypt=require("bcryptjs")

const app=express();
const port=process.env.PORT || 4001;
app.use(express.json())
app.use(express.urlencoded({extended:false}));

const static_dir=path.join(__dirname,"../public");
const views_path=path.join(__dirname,"./templates/views");
const partials_path=path.join(__dirname,"./templates/partials");


app.use(express.static(static_dir));


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
        const username=data.username;
        const email=data.email;
        const userVal=await User.find({username});
        const emailVal=await User.find({email});
        // console.log(Boolean(userVal))
        // console.log(Boolean(emailVal));

        // console.log(typeof([]));/\

        // console.log(userVal.length)
        // console.log(emailVal.length);
        if(userVal.length){
            // const newUser=new User(req.body);
            // await newUser.save()
            res.send("User with this username already exists!");
        }
        else if(emailVal.length){
            res.send("User with this email already exists!")
        }
        else{
            const newUser=new User(data);
            

            // //bcrypt
            // console.log(newUser);
            // console.log(bcrypt.hash(data.password));
            // // newUser.password=bcrypt.hash(data.password);


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
app.post("/login",async ( req,res)=>{
    // console.log(req.body)
    // res.send(req.body);
    const data=req.body;
    //check if email exist already in database or not, if exist check password , if both correct show their dashboard
    const checkEmail=await User.find({email:data.email});
    if(checkEmail.length){
        console.log("email chai milyo hai !");
        // res.send("email chai milyo hai!!")
        //email pahilai register vaisakeko vetiyesi
        // const checkPassword=await User.find({password:data.password});
        // console.log(data.password)

        // console.log(checkEmail)
        // console.log(checkEmail[0].password);

        const checkPassword=await bcrypt.compare(data.password,checkEmail[0].password);
        console.log(checkPassword);

        if(checkPassword){

            console.log("Login successful!✅✅");
            res.send(`Welcome ${checkEmail[0].username}!, To you quiz dashboard!🏆`)

        }else{
            res.send("Incorrect password!❌");
            console.log("Incorrect password!❌");
        }
    }else{
        res.send("Register first to login!!");
    }

    //if username already exist respond with username is used , try another username


    //if username is unique

})

//server listening
app.listen(port,()=>{
    console.log(`listening to port: ${port}`)
})