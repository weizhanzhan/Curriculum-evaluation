const express =require ("express")
const app =express();
const exphbs= require("express-handlebars")
const bodyParser=require("body-parser")
const mongoose =require('mongoose')
const session=require("express-session")
const flash=require("connect-flash")
const db=require("./config/keys").mongoURI
const path=require("path")
const passport=require("passport")
mongoose.connect(db)
           .then(()=>{
               console.log("mongoDB is connected")
           })
           .catch(err=>{
               console.log(err)
           })

//引入model
require("./models/lesson")
const Lesson=mongoose.model('lesson')

require("./config/paaport")(passport)

//handlebar 中间件 
app.engine('handlebars',exphbs({
    defaultLayout:'main'
}))
app.set('view engine','handlebars')
//使用静态文件
app.use(express.static(path.join(__dirname,'public')))

//session flash middleware
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
//配置全局变量
app.use((req,res,next)=>{
     res.locals.success_msg=req.flash('success_msg');
     res.locals.error_msg=req.flash('error_msg')
     res.locals.error=req.flash('error')
     res.locals.user=req.user || null
     next();
})

//body-parser
var jsonParser=bodyParser.json();
var urlencodeParser=bodyParser.urlencoded({extended:false})     

//load routes
const lessons=require("./routes/lesson")
const users=require("./routes/user")
app.use("/",lessons)
app.use("/",users)



const port=5000;
app.listen(port,()=>{
    console.log(`server is running ${port}`);
})