const express=require('express');
const app=express();
require('dotenv').config();
const PORT=process.env.PORT;
const user=require('./Routes/userRoute');
require('./Config/database').connect();
const cookieParser=require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1",user);

app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`);
});