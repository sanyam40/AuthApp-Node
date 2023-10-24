const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery', false);

exports.connect=()=>{
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(()=>{
        console.log('Database connected');
    }).catch((err)=>{
        console.log('Error connecting to database');
        console.log(err);
        process.exit(1);
    });
}