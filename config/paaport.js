const LocalStrategy=require("passport-local").Strategy;
const mongoose =require("mongoose");
const bcrypt=require("bcrypt");

//加载model
require('../models/users')
const Users =mongoose.model("users");

module.exports=(passport)=>{
    passport.use(new LocalStrategy(
       {usernameField:"email"},
       (email,password,done)=>{
            Users.findOne({
                email:email
            })
            .then(user=>{
                if(!user){
                   return done(null,false,{message:"没有这个用户"})
                }
                else{
                    bcrypt.compare(password, user.password, (err, isMatch) =>{
                        if(err) throw err;
                        if(isMatch){           
                            return done(null,user) 
                        }
                        else{
                            return done(null,false,{message:"密码错误"}) 
                        }
                    });
                    
                }
            })
       }
      ));
      passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
       
      passport.deserializeUser(function(id, done) {
        Users.findById(id, function (err, user) {
          done(err, user);
        });
      });
}