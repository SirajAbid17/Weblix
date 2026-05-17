import express from "express";
import { chatWithAI } from "../controllers/chatController.js";

const groqrouter = express.Router();


groqrouter.post("/", chatWithAI);

export default groqrouter;