
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import dbConnect from "./config/Db.js";

import AuthRoute from "./routes/auth.js";
import UserRouter from "./routes/user.js";
import WebsiteRoute from "./routes/website.js";
import DeployRoute from "./routes/Deploy.js";
import Billingrouter from "./routes/billingRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 3000;

const publicPath = path.join(__dirname, "public");
const indexPath = path.join(publicPath, "index.html");
const deployedPath = path.join(publicPath, "deployed");

// =====================================
// DATABASE CONNECTION (REUSABLE)
// =====================================

let dbConnectionPromise = null;

const ensureDatabase = async () => {
  if (!dbConnectionPromise) {
    dbConnectionPromise = dbConnect().catch((error) => {
      dbConnectionPromise = null;
      throw error;
    });
  }

  return dbConnectionPromise;
};

// =====================================
// CORS
// =====================================

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
      "HEAD",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    exposedHeaders: ["Set-Cookie"],
    optionsSuccessStatus: 204,
  })
);

app.options(/.*/, cors({
  origin: true,
  credentials: true,
  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
    "HEAD",
  ],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
}));

// =====================================
// BODY PARSERS
// =====================================

app.use(express.json({ limit: "20mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "20mb",
  })
);

app.use(cookieParser());

// =====================================
// REQUEST LOGGER
// =====================================

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// =====================================
// HEALTH CHECK
// =====================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Weblix API is running successfully",
    environment: process.env.NODE_ENV || "production",
    timestamp: new Date().toISOString(),
  });
});

// =====================================
// DATABASE MIDDLEWARE FOR API
// =====================================

app.use("/api", async (req, res, next) => {
  try {
    await ensureDatabase();
    next();
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// =====================================
// API ROUTES
// =====================================

app.use("/api/auth", AuthRoute);
app.use("/api/user", UserRouter);
app.use("/api/website", WebsiteRoute);
app.use("/api/websitedeploy", DeployRoute);
app.use("/api/billing", Billingrouter);

// =====================================
// DEPLOYED WEBSITE FILES
// =====================================

if (fs.existsSync(deployedPath)) {
  app.use(
    "/deployed",
    express.static(deployedPath)
  );
}

// =====================================
// FRONTEND STATIC FILES
// =====================================

if (fs.existsSync(publicPath)) {
  app.use(
    express.static(publicPath, {
      index: false,
      maxAge:
        process.env.NODE_ENV === "production"
          ? "1d"
          : 0,
    })
  );
} else {
  console.warn("Frontend public folder not found:", publicPath);
}

// =====================================
// UNKNOWN API ROUTES
// =====================================

app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});

// =====================================
// FRONTEND ROUTER FALLBACK
// =====================================

app.get("/{*splat}", (req, res, next) => {
  if (!fs.existsSync(indexPath)) {
    return res.status(404).send(
      "Frontend build not found."
    );
  }

  res.sendFile(indexPath, (error) => {
    if (error) {
      console.error("Frontend loading error:", error.message);
      next(error);
    }
  });
});

// =====================================
// GLOBAL ERROR HANDLER
// =====================================

app.use((error, req, res, next) => {
  console.error("Server Error:", error);

  if (res.headersSent) {
    return next(error);
  }

  res.status(error.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : error.message,
  });
});

// =====================================
// EXPORT EXPRESS APP FOR VERCEL
// =====================================

export default app;

// =====================================
// LOCAL DEVELOPMENT SERVER
// =====================================

if (!process.env.VERCEL) {
  const startServer = async () => {
    try {
      await ensureDatabase();

      app.listen(PORT, () => {
        console.log("");
        console.log("================================");
        console.log("       WEBLIX SERVER STARTED");
        console.log("================================");
        console.log(`Server: http://localhost:${PORT}`);
        console.log(`Health: http://localhost:${PORT}/api/health`);
        console.log(
          `Frontend: ${fs.existsSync(indexPath) ? "FOUND" : "NOT FOUND"}`
        );
        console.log(`Public: ${publicPath}`);
        console.log("================================");
        console.log("");
      });
    } catch (error) {
      console.error("Server startup failed:", error.message);
      process.exit(1);
    }
  };

  startServer();
}
