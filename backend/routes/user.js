const express=require('express');
const zod=require("zod");
const { User } = require('../db');
const JWt_SECRET = require('../config');
const router=express.Router();

const signupSchema=zod.object({
    username:zod.string(),
    password:zod.string(),
    firstName:zod.string(),
    lastname:zod.string()
})

router.post("/signup", async(req,res)=>{
    const body=req.body
    const {success}=signupSchema.safeParse(req.body);
    if(!success){
        return res.json({
            message:"email already taken/ incorrect inputs"
        })
    }
    const user=User.findOne({
        username:body.username
    })
    
    if(user._id){
        return res.json({
            message:"Email already taken/incorrect inputs"
        })
    }
    
    const dbUser=await User.create(body);
    const token=jwt.sign({
        userId:dbUser._id
    },JWt_SECRET)
    res.json({
        message:"user created successfully",
        token:token
    })
})

module.exports=router;