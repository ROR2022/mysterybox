import mongoose from "mongoose";
/* import User from "@/models/User";
import Board from "@/models/Board";
import Post from "@/models/Post"; */

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log("Already connected to MongoDB");
    return;
  }
  try {
    //const conn = 
    await mongoose.connect(process.env.MONGO_URI as string);
    //console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message || "Failed to connect to MongoDB"}`);
    }else{
      console.error(`Error: Failed to connect to MongoDB`, error);
    }
    //console.error(`Error: ${error?.message || "Failed to connect to MongoDB"}`);
    //process.exit(1);
  }
};

export default connectDB;
