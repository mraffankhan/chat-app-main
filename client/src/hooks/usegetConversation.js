import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const useGetConversation = () => {
  const [loading, setLoading] = useState(true);
  const [conversation, setConversation] = useState([]);

  useEffect(() => {
    const getConversation = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users");
        const data = await res.json();

        if (data.error) {
          throw new Error(data.error);
        }
        setConversation(data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to get conversation");
      } finally {
        setLoading(false);
      }
    };

    getConversation();
  }, []);

  return { loading, conversation };
};

export default useGetConversation;
