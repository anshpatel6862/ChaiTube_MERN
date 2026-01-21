import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from './app.js'

dotenv.config({
    path: './.env'
})

connectDB()
.then(() => {
    // 👇 Ye condition lagana zaroori hai
    // Server sirf Localhost par start hoga, Vercel par crash nahi karega
    if (process.env.NODE_ENV !== "production") {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
        })
    }
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})

// 👇 YE LINE SABSE IMPORTANT HAI VERCEL KE LIYE
export default app;