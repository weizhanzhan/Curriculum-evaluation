const express =require ("express")
const mongoose =require('mongoose')
const bodyParser=require("body-parser")
const router =express.Router()

const {ensureAuthenticated}=require("../helpers/auth")
//引入model
require('../models/lesson')
const Lesson=mongoose.model('lesson');

//body-parser
var jsonParser=bodyParser.json();
var urlencodeParser=bodyParser.urlencoded({extended:false})     


router.get("/",(req,res)=>{
    const title="课程评价"
    res.render("index",{
        title,
    });
})
router.get("/evaluate/index",ensureAuthenticated,(req,res)=>{
    res.render("evaluate/index")
})
router.get("/evaluate/view",ensureAuthenticated,(req,res)=>{
    Lesson.find({user:req.user.id})
           .sort({date:'desc'})
           .then(lessons=>{                                   
               res.render("evaluate/view",{
                lessons:lessons
              })
           });
    
})
//add
router.post("/evaluate",urlencodeParser,(req,res)=>{
    const newEvaluate={
        lesson:req.body.lesson,
        lessonScore:req.body.lessonScore,
        teacherScore:req.body.teacherScore,
        user:req.user.id
    }
    new Lesson(newEvaluate)
             .save()
             .then(Evaluate=>{
                req.flash("success_msg","评价成功！")
                  res.redirect("evaluate/view")
             })
})
//edit
router.get("/evaluate/edit/:id",(req,res)=>{
    Lesson.findOne({
        _id:req.params.id
    })
    .then(les=>{
        if(les.user!=req.user.id){
            req.flash("error_msg","非法操作")
            res.redirect("/evaluate/view")
        }
        else{
            res.render("evaluate/edit",{
                lesson:les
            })
        }
       
    })
})
router.post("/evaluate/edit",urlencodeParser,(req,res)=>{
    Lesson.findOne({
        _id:req.body.id
    })
    .then(les=>{
        les.lesson=req.body.lesson;
        les.lessonScore=req.body.lessonScore;
        les.teacherScore=req.body.teacherScore;

        les.save()
        .then(lesson=>{
            req.flash("success_msg","修改成功！")
            res.redirect("/evaluate/view")
        })
    })
    
})
//delete
router.get("/evaluate/delete/:id",(req,res)=>{
    Lesson.findOne({
        _id:req.params.id
    })
    .then(les=>{
        les.remove()
        .then(()=>{
            req.flash("success_msg","删除成功！")
            res.redirect("/evaluate/view")
        })
    })
})

module.exports=router