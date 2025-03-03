import mongoose from "mongoose";
//import User from "@/models/User";
//import Board from "@/models/Board";
//import Post from "@/models/Post";

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log("Already connected to MongoDB");
    return;
  }
  try {
    //const conn = 
    await mongoose.connect(process.env.MONGO_URI as string);
    //console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error?.message || "Unknown error"}`);
    } else {
      console.error("An unknown error occurred");
    }
    //process.exit(1);
  }
};

export default connectDB;
