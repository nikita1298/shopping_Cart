var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var bcrypt=require('bcrypt-nodejs');
console.log("hii");
var userSchema=new Schema({
    email:{type:String,required:true},
    password:{type:String,required:true}    
});
    
userSchema.methods.encryptPassword=function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(5),null);

};
userSchema.methods.validPassword=function(password){
    //console.log(password);
   // console.log(bcrypt.compareSync(password,this.password ));
    return bcrypt.compareSync(password,this.password );
};                                                    
module.exports=mongoose.model('User',userSchema);