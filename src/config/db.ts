import mongoose from "mongoose";

export const connectDb = async() =>{
    try {
       const connectionInstance = await mongoose.connect(process.env.MONGODB_URI!, {
            dbName: process.env.MONGODB_NAME
        });
        return {
            host : connectionInstance.connection.host,
            dbName : process.env.MONGODB_NAME
        };
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}