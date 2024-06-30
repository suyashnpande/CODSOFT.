import mongoose from "mongoose";

export const dbConnection =()=> {
    mongoose.connect(process.env.MONGO_URI ,{
        dbName: "MERN_STACK_JOB_SEEKING" ,
    })
    .then(()=>{
        console.log("dbConnection successful");
    })
    .catch((error)=>{
        console.log(`some error have occured while connecting database: ${error}`);
    });
};