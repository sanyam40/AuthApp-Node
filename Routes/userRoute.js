const express=require('express');
const router=express.Router();
const {login,signup}=require('../Controller/Auth');
const {auth,isStudent,isAdmin}=require('../Middleware/Auth')

router.post('/signup',signup);
router.post('/login',login);

router.get("/test",auth,(request,response)=>{
    response.json({success:true,message:"Welcome to test route"});
});

// Protected routes
router.get("/student",auth,isStudent,(request,response)=>{
    response.json({success:true,message:"Welcome to Student Route"});
});

router.get("/admin",auth,isAdmin,(request,response)=>{
    response.json({success:true,message:"Welcome to Admin route"});
});

module.exports=router;