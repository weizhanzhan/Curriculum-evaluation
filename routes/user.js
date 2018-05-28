const express =require ("express")
const mongoose =require('mongoose')
const bodyParser=require("body-parser")
const router =express.Router()
const bcrypt=require("bcrypt")
const passport=require("passport")

require('../models/users')
const Users=mongoose.model('users');

var jsonParser=bodyParser.json();
var urlencodeParser=bodyParser.urlencoded({extended:false})   

router.get("/login",(req,res)=>{
    res.render("users/login");
})
router.get("/register",(req,res)=>{
    res.render("users/register")
})

router.post("/user/login",urlencodeParser,(req,res,next)=>{
    passport.authenticate('local', { 
        successRedirect:'/evaluate/view',
        failureRedirect:'/login' ,
        failureFlash:true
    })(req,res,next)

    
})
router.post("/user/register",urlencodeParser,(req,res)=>{
    let error=[];
    if(req.body.password!=req.body.password2)
      error.push({
          text:"两次密码输入不一致"
      })
    if(error.length>0){
 
        res.render("users/register",{
            error,
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            password2:req.body.password2
        })
    }else{
        
       
        Users.findOne({
            email:req.body.email
        })
        .then(user=>{
            if(user){
                error.push({
                    text:"邮箱已经存在,请更换邮箱"
                })
                res.render("users/register",{
                    error,
                    name:req.body.name,
                    email:req.body.email,
                    password:req.body.password,
                    password2:req.body.password2
                })
                
            }
            else{
                const newUser=new Users({
                    name:req.body.name,
                    email:req.body.email,
                    password:req.body.password,
                })
                //bcrypt 密码加密
                bcrypt.genSalt(10, (err, salt)=> {
                    bcrypt.hash(newUser.password, salt, (err, hash)=> {
                        if(err) throw err;
                        newUser.password=hash
                        newUser.save()
                        .then(user=>{
                            req.flash("success_msg","注册成功")
                            res.redirect("/login")
                        })
                        .catch(err=>{
                         req.flash("error_msg","注册失败")
                         res.redirect("/register")
                        })
                    });
                });

               
            }
        })
        
    }
})
router.get("/logout",(req,res)=>{
    req.logout();
    req.flash("success_msg","退出成功");
    res.redirect("/login")
})
module.exports=router