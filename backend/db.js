const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/paytm');

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minLength:3,
        maxLength:30
    },
    password:{
        type:String,
        required:true,
        minLength:6,
    },
    firstName:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        maxLength:30
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
        maxLength:30
    },
});

const User=mongoose.model('User',userSchema);

module.exports={
    User
};