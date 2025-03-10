const express=require('express');
const zod=require("zod");
const { User } = require('../db');
const JWt_SECRET = require('../config');
const jwt=require("jsonwebtoken");
const { authMiddleware } = require('../middleware');
const router=express.Router();

//SIGN UP
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


//SIGN IN
const signinSchema=zod.object({
    username:zod.string(),
    password:zod.string()
})

router.post("/signin", async(req,res)=>{
    const body=req.body
    const {success}=body.safeParse(req.body)
    if(!success){
        return res.json({
            message:"incorrect inputs"
        })
    }
    const user=await User.findOne({
        username:body.username,
        password:body.password
    })
    if(user){
        const token=jwt.sign({
            userId:user._id
        },JWt_SECRET)
        res.json({
            token:token
        })
    }
})

//Updating information

const updateBody=zod.object({
    password:zod.string().optional,
    firstName:zod.string().optional,
    lastname:zod.string().optional
})
router.put("/",authMiddleware,async(req,res)=>{
    const {success}=updateBody.safeParse(req.body)
    if(!success){
        res.status(411).json({
            message:"error while updating information"
        })
    }
    await User.updateOne({_id:req.userId},req.body)

    res.json({
        message:"updated successfully"
    })
})


//Get specific users based on first name and last name

router.get("/bulk", async(req,res)=>{
    const filter=req.query.filter || ""

    const users=await User.find({
        $or:[{
            firstName:{
                "$regex":filter
            }
        },{
            lastName:{
                "$regex":filter
            }
        }]
    })
    res.json({
        user:users.map(user=>({
            username:user.username,
            firstName:user.firstName,
            lastName:user.lastName,
            _id:user._id
        }))
    })
})

module.exports=router;