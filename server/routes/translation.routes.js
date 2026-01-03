import express from "express";
import { translateText } from "../controllers/translation.controller.js";

const router = express.Router();

router.post("/", translateText);

export default router;
