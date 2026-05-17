import express from "express";
import { handleStripeWebhook } from "../controllers/webhook.js";

const WebhookRouter = express.Router();


WebhookRouter.post("/stripe", express.raw({ type: 'application/json' }), handleStripeWebhook);

export default WebhookRouter;