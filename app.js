//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

//Important that you make the secret or encrypt before model

userSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ['password']});

const User = new mongoose.model("user",userSchema); 

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});


app.post("/register",function(req,res){
   
    const newUser = new User ({
        email : req.body.username,
        password : req.body.password
    });

    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("secrets");
        }
    });
});


app.post("/login", function(req,res){
    const username = req.body.username;
    const userPass = req.body.password;

    User.findOne({email:username}, function(err,userFound){
        if(err){
            console.log(err);
        }else{
            if(userFound){
                if(userFound.password === userPass){
                    res.render("secrets");
                }
            }
        }
    })
});









app.listen(3000,function(){
    console.log("The server is up and running on port 3000");
});