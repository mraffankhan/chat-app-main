import { useState } from "react";
import { toast } from "sonner";

const useDianaChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const currentUserId = JSON.parse(localStorage.getItem("authUser"))._id;

  const sendMessage = async (messageText, model = "gemini") => {
    if (!messageText.trim()) return;

    try {
      setIsLoading(true);

      // Add user message immediately
      const userMessage = {
        _id: Date.now().toString(),
        senderId: currentUserId,
        message: messageText,
        createdAt: new Date().toISOString(),
      };

      setChatMessages((prev) => [...prev, userMessage]);

      // Call AI API
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messageText, model }),
      });

      const data = await res.json();

      if (data.error) {
        toast.error(data.error);
        return;
      }

      // Add AI response
      const aiMessage = {
        _id: (Date.now() + 1).toString(),
        senderId: "diana_bot",
        message: data.response,
        createdAt: new Date().toISOString(),
      };

      setChatMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error in Diana chat:", error);
      toast.error("Failed to get AI response");
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setChatMessages([]);
  };

  return {
    sendMessage,
    isLoading,
    chatMessages,
    clearChat,
  };
};

export default useDianaChat;
