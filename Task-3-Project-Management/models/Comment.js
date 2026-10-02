const mongoose=require("mongoose");
const s=new mongoose.Schema({task:{type:mongoose.Schema.Types.ObjectId,ref:"Task",required:true},author:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},text:{type:String,required:true,trim:true,maxlength:500}},{timestamps:true});
module.exports=mongoose.model("Comment",s);