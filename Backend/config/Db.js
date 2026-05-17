import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

const dbConnet=async()=>{
try {
  const conn= await mongoose.connect(process.env.MONGODB_URL)
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
} catch (error) {
    console.log(error)
}
}
export default dbConnet