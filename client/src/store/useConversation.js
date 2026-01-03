import { create } from "zustand";

const useConversation = create((set) => ({
  selectedConversation: null,
  messages: [],
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation, messages: [] }),
  setMessages: (messages) => set({ messages: messages || [] }),
}));

export default useConversation;
