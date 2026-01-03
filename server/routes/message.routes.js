import express from "express";
import {
  sendMessage,
  getMessages,
  deleteMessage,
  updateMessage,
  updateMessageStatus,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.delete("/:messageId", protectRoute, deleteMessage);
router.put("/:messageId", protectRoute, updateMessage);
router.patch("/:messageId/status", protectRoute, updateMessageStatus);

export default router;
