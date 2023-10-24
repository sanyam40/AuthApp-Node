const jwt=require('jsonwebtoken');
require('dotenv').config();

// Authentication Middleware
exports.auth=(req,res,next)=>{
    try{
        const token=req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer",""); // Extract JWT token
        if(!token){
            return res.status(401).json({success:false,message:"Token not found"});      
        }
        try{ // Verify token
            const payload=jwt.verify(token,process.env.JWT_SECRET);
            console.log(payload);
            req.user=payload;
        }catch(error){
            console.log(error);
            return res.status(401).json({success:false,message:"Invalid Token"});
        }
        next();
    }catch(error){
        console.log(error);
        res.status(401).json({success:false,message:"Token Not found"});
    }
}
// Authorization Middleware
exports.isStudent=(req,res,next)=>{
    try{
        if(req.user.role!=="Student"){
            return res.status(401).json({success:false,message:"Unauthorized Access,This is route for Students only"});
        }
        next();
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:"User role is not matching"});
    }
}

exports.isAdmin=(req,res,next)=>{
    try{
        if(req.user.role!=="Admin"){
            return res.status(401).json({success:false,message:"Unauthorized Access,This is route for Students only"});
        }
        next();
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:"User role is not matching"});
    }
}