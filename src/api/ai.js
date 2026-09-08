import api from "./client";

export const sendMessage = async (message) => {
  const response = await api.post("/ai/chat", { message });
  return response.data?.reply || "AI service is temporarily unavailable.";
};
