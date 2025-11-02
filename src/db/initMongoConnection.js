import mongoose from "mongoose";

export const connectMongoDB = async () => {
  try {
    const db = process.env.MONGODB_URI;

    if (!db) {
      throw new Error("MONGODB_URI is not defined in .env");
    }

    await mongoose.connect(db);

    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};
