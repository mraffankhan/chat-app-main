import React, { useEffect } from "react";
import useLogout from "@/hooks/useLogout";
import useGetConversation from "@/hooks/usegetConversation";
import useConversation from "@/store/useConversation";
import ConversationList from "@/components/custom/ConversationList";
import MessageContainer from "@/components/custom/MessageContainer";
import NoChat from "@/components/custom/NoChat";

function Home() {
  const { loading, conversation } = useGetConversation();
  const { logout } = useLogout();
  const {
    selectedConversation,
    setSelectedConversation,
    messages,
    setMessages,
  } = useConversation();

  useEffect(() => {
    if (selectedConversation !== null) {
      const selectedMessages = conversation.find(
        (conv) => conv.id === selectedConversation
      )?.messages;
      setMessages(selectedMessages || []);
    }
  }, [selectedConversation, conversation, setMessages]);

  const authUser = JSON.parse(localStorage.getItem("authUser"));

  return (
    <div className="flex w-full h-screen gap-1 md:py-4 md:px-4">
      <div
        className={`w-full lg:w-[30%] sm:w-full ${
          selectedConversation ? "hidden lg:block" : "block"
        }`}
      >
        <ConversationList
          conversation={conversation}
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
          authUser={authUser}
          logout={logout}
        />
      </div>
      <div
        className={`w-full h-full lg:w-[70%] sm:w-full ${
          selectedConversation ? "block" : "hidden lg:block"
        }`}
      >
        {selectedConversation ? (
          <MessageContainer
            conversation={conversation}
            selectedConversation={selectedConversation}
            messages={messages}
            onBack={() => setSelectedConversation(null)}
          />
        ) : (
          <NoChat />
        )}
      </div>
    </div>
  );
}

export default Home;
