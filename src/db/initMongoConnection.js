import mongoose from "mongoose";

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Mongo connection successfully established!");
  } catch (err) {
    console.error("Mongo connection error:", err.message);
    process.exit(1);
  }
};
