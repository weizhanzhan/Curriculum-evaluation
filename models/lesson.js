const mongoose =require("mongoose")
const Schema =mongoose.Schema;
const lessonSchema=new Schema({
    lesson:{
        type:String,
        required:true
    },
    lessonScore:{
        type:String,
        required:true
    },
    teacherScore:{
        type:String,
        required:true
    },
    user:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})
mongoose.model("lesson",lessonSchema)