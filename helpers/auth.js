module.exports={
    ensureAuthenticated:(req,res,next)=>{
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error_msg","请登录");
        res.redirect("/login")
    }
}