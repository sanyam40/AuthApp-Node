const bcrypt = require('bcrypt');
const User = require('../Model/User');
const jwt=require('jsonwebtoken');
require('dotenv').config();
const secretKey=process.env.JWT_SECRET;

exports.signup=async(request,response)=>{
    try{
        const {name,email,password,role}=request.body;
        if(!name || !email || !password || !role ){
            return response.status(400).json({success:false,message:"Please enter all fields"});
        }

        const existingUser=await User.findOne({email});
        if(existingUser){
            return response.status(400).json({success:false,message:"User already exists"});
        }

        let hashedPassword;
        try{
            hashedPassword=await bcrypt.hash(password,10);
        }
        catch(err){
            return response.status(500).json({success:false,message:"Error in Hashing Password"});
        }

        const user=await User.create({
            name,email,password:hashedPassword,role});

        return response.status(201).json({success:true,message:`User Created Successfully for ${user.email}`});
    }
    catch(err){
        console.log(err);
        return response.status(500).json({success:false,message:"Internal Server Error"});
    }
}

exports.login=async(request,response)=>{
    try{
        const {email,password}=request.body;
        if(!email || !password){
            return response.status(400).json({success:false,message:"Please enter all fields"});
        }

        let user=await User.findOne({email});

        if(!user){
            return response.status(404).json({success:false,message:"User not found,Please Sign Up first"});
        }

        let isMatch;
        const payload={email:user.email,id:user._id,role:user.role};
        try{
            isMatch=await bcrypt.compare(password,user.password);
            if(!isMatch){
                return response.status(400).json({success:false,message:"Invalid Credentials"});
            }
            else{
                let token=jwt.sign(payload,secretKey,{expiresIn:"1h"});
                user=user.toObject();
                user.token=token;
                user.password=undefined;
                
                const options={
                    expires:new Date(Date.now()+3*24*60*60*1000),
                    httpOnly:true
                }
                return response.cookie("token",token,options).status(200).json({success:true,message:"Logged in Successfully",user:user});
            }
        }
        catch(err){
            return response.status(500).json({success:false,message:"Error in comparing Password"});
        }
    }
    catch(err){
        console.log(err);
        return response.status(500).json({success:false,message:"Internal Server Error"});
    }
}
