import express from "express";
import { Auth, Logout, CurrentUser, GetUserCredits } from "../controllers/Auth.js";
import { Auth as AuthMiddleware } from "../middleware/Auth.js";

const Authrouter = express.Router();

Authrouter.post("/google", Auth);
Authrouter.get("/logout", Logout);
Authrouter.get("/current-user", AuthMiddleware, CurrentUser);
Authrouter.get("/credits", AuthMiddleware, GetUserCredits);

export default Authrouter;