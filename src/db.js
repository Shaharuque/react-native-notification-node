import mongoose from "mongoose";

export async function connectDB() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yz2oh.mongodb.net/notification_app?retryWrites=true&w=majority`, {
    serverSelectionTimeoutMS: 10000
  });
  console.log("✅ MongoDB connected");
}
