import Conversation from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    const { message } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      status: "sent",
    });

    if (newMessage.message.length > 0) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([newMessage.save(), conversation.save()]);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      newMessage.status = "delivered";
      await newMessage.save();

      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("send message controller", error.message);
    res.status(500).json({ error: "Internal server error!" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages"); // Populate messages field in conversation not just message ids

    if (!conversation) {
      return res.status(200).json({ messages: [] });
    }

    res.status(200).json({ messages: conversation.messages });
  } catch (error) {
    console.log("get message controller", error);
    res.status(500).json({ error: "Internal server error!" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    // Find the message and verify ownership
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Verify the user is the sender of the message
    if (message.senderId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this message" });
    }

    // Find and update the conversation to remove the message reference
    await Conversation.updateOne(
      { messages: messageId },
      { $pull: { messages: messageId } }
    );

    // Delete the message
    await Message.findByIdAndDelete(messageId);

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.log("Delete message error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { message: updatedText } = req.body;
    const userId = req.user._id;

    if (!updatedText) {
      return res
        .status(400)
        .json({ error: "Updated message text is required" });
    }

    // Find the message and verify ownership
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Verify the user is the sender of the message
    if (message.senderId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "Unauthorized to update this message" });
    }

    // Update the message
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      {
        message: updatedText,
        // You might want to add a flag to indicate the message was edited
        isEdited: true,
      },
      { new: true } // Return the updated document
    );

    res.status(200).json(updatedMessage);
  } catch (error) {
    console.log("Update message error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateMessageStatus = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    if (!["sent", "delivered", "seen"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Only receiver can mark message as delivered/seen
    if (
      (status === "delivered" || status === "seen") &&
      message.receiverId.toString() !== userId.toString()
    ) {
      return res
        .status(403)
        .json({ error: "Unauthorized to update message status" });
    }

    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { status },
      { new: true }
    );

    // Emit socket event for real-time status update
    const receiverSocketId = getReceiverSocketId(message.senderId.toString());
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageStatusUpdate", {
        messageId,
        status,
      });
    }

    res.status(200).json(updatedMessage);
  } catch (error) {
    console.log("Update message status error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
