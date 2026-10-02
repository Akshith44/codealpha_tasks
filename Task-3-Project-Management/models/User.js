const mongoose=require("mongoose");
const s=new mongoose.Schema({name:{type:String,required:true,trim:true},username:{type:String,required:true,unique:true,lowercase:true,trim:true},email:{type:String,required:true,unique:true,lowercase:true,trim:true},password:{type:String,required:true},bio:{type:String,default:""}},{timestamps:true});
module.exports=mongoose.model("User",s);