import express from "express";
import dotenv from "dotenv";
import dbConnect from "./config/Db.js";
import cookieParser from "cookie-parser";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import AuthRoute from "./routes/auth.js";
import UserRouter from "./routes/user.js";
import WebsiteRoute from "./routes/website.js";
import DeployRoute from "./routes/Deploy.js";
import Billingrouter from "./routes/billingRoutes.js";


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));


app.use('/deployed', express.static(path.join(__dirname, 'public/deployed')));


app.use("/api/auth", AuthRoute);
app.use("/api/user", UserRouter);
app.use("/api/website", WebsiteRoute);
app.use("/api/websitedeploy", DeployRoute);
app.use("/api/billing", Billingrouter);



app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});


const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await dbConnect();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.log("DB Connection Failed:", error);
    process.exit(1);
  }
};

startServer();