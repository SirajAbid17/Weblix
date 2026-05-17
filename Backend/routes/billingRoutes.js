import express from "express";
import { Auth } from "../middleware/Auth.js";
import { Billing, ConfirmPayment, GetUserCredits } from "../controllers/Billing.js";


const Billingrouter = express.Router();

Billingrouter.post("/checkout", Auth, Billing);
Billingrouter.get("/confirm-payment", Auth, ConfirmPayment); 
Billingrouter.get('/credits', Auth, GetUserCredits);

export default Billingrouter;