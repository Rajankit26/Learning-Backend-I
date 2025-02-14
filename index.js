import mongoose from "mongoose";
import app from "./src/app.js";
import config from "./src/config/index.js";
// How to connect to DB
// 1. Create a method
// Run this method  => IIFE

( async() => {
    try {
       await mongoose.connect(config.MONGODB_URL)
       console.log("DB Connected!")
    //    If the above goes well but there is some refusal from db,there is some error then these type of error/cases can't be handled by the catchs(next).These type of error can be handelled by specialised mongodb

    app.on('error',(err)=>{
        console.error(`ERROR: ${err}`)
        throw err
    })
    const onListening = () =>{
        console.log(`Listening on port ${config.PORT }`);
        
    }
    app.listen(config.PORT,onListening)
    } catch (err) {
        console.error(`ERROR: ${err}`)
        throw err
    }
})()