const mongoose=require('mongoose');
var Schema=mongoose.Schema;
var userSchema=new Schema({
	name:{type:String,require:true},
	email:{type:String,require:true},
	mobileno:{type:String,require:true},
	password:{type:String,require:true},
	join_date:{type:String,require:true},
	reference:{type:Array,default:[],require:true}
});
mongoose.model('users',userSchema);
