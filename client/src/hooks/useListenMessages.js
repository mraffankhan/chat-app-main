import { useSocketContext } from "@/context/SocketContext";
import useConversation from "@/store/useConversation";
import { useEffect } from "react";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages } = useConversation();

  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      console.log("New message received:", newMessage);
      setMessages([...messages, newMessage]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket, messages, setMessages]);
};

export default useListenMessages;
