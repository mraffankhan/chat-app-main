import express from "express";
import { getAIResponse } from "../controllers/ai.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/chat", protectRoute, getAIResponse);

export default router;
