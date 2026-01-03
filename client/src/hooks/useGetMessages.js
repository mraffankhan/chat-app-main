import useConversation from "@/store/useConversation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        if (selectedConversation === "diana_bot") {
          setMessages([]);
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/messages/${selectedConversation}`);
        const data = await res.json();

        if (data.error) throw new Error(data.error);
        setMessages(data.messages || []);
      } catch (error) {
        toast.error(error.message);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    if (selectedConversation) {
      getMessages();
    } else {
      setMessages([]);
    }
  }, [selectedConversation, setMessages]);

  return { messages: messages || [], loading };
};

export default useGetMessages;
