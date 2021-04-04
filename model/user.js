const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        required:true
    },
    googleId:{
        type:String
    },
    facebookId:{
        type:String
    }
})


module.exports=mongoose.model('User',userSchema);