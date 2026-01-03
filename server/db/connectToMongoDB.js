import mongoose from "mongoose";

export const connectToMongoDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_DB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB: ", error);
    // await mongoose.connect("mongodb://localhost:27017/chatApp-db");
    // console.log("connected to local db");
  }
};
