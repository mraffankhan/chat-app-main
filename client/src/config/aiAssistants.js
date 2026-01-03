export const AI_ASSISTANTS = {
  diana: {
    _id: "diana_bot",
    fullName: "Diana AI Assistant",
    username: "diana_ai",
    profilePic:
      "https://ui-avatars.com/api/?name=Diana&background=6366f1&color=fff",
    description: "Your AI Assistant powered by multiple AI models",
    isBot: true,
  },
};

export const getAIAssistant = (id) => {
  return Object.values(AI_ASSISTANTS).find((ai) => ai._id === id);
};

export const isAIAssistant = (id) => {
  return Object.values(AI_ASSISTANTS).some((ai) => ai._id === id);
};
