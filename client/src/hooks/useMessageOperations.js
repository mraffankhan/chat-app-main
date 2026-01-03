import { useState } from "react";
import { toast } from "sonner";
import useConversation from "@/store/useConversation";
import { useSocketContext } from "@/context/SocketContext";

const useMessageOperations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { messages, setMessages } = useConversation();
  const { socket } = useSocketContext();

  const deleteMessage = async (messageId) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/messages/${messageId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Update local state
      setMessages(messages.filter((message) => message._id !== messageId));

      // Emit socket event for real-time update
      socket?.emit("messageDeleted", { messageId });

      toast.success("Message deleted successfully");
    } catch (error) {
      toast.error(error.message || "Error deleting message");
    } finally {
      setIsLoading(false);
    }
  };

  const updateMessage = async (messageId, updatedText) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/messages/${messageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: updatedText }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Update local state
      setMessages(
        messages.map((message) =>
          message._id === messageId
            ? { ...message, message: updatedText, isEdited: true }
            : message
        )
      );

      // Emit socket event for real-time update
      socket?.emit("messageUpdated", { messageId, message: updatedText });

      toast.success("Message updated successfully");
      return true;
    } catch (error) {
      toast.error(error.message || "Error updating message");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateMessageStatus = async (messageId, status) => {
    try {
      const res = await fetch(`/api/messages/${messageId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Update local state
      setMessages(
        messages.map((message) =>
          message._id === messageId ? { ...message, status } : message
        )
      );

      return true;
    } catch (error) {
      console.error("Error updating message status:", error);
      return false;
    }
  };

  return {
    deleteMessage,
    updateMessage,
    updateMessageStatus,
    isLoading,
  };
};

export default useMessageOperations;
