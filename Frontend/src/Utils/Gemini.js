import { GoogleGenAI } from "@google/genai";
import apiRequest from "./apiRequest";

const add = async (question,chatId, onStream) => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

  const response= await apiRequest(`/api/chats/${chatId}`);
  const historyData= response.data.history;
  
  const transformedHistory= historyData.map((msg)=>({
    role: msg.role,
    parts: msg.parts.map((p) => ({ text: p.text }))
}))
  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    history: transformedHistory
  });

  const stream = await chat.sendMessageStream({message: question});
  let finalText = "";
  for await (const chunk of stream) {
    const text = chunk.text;
    const miniChunks = text.split(/(?<=\s)/); 
    for (const mini of miniChunks) {
      finalText += mini;
      if (onStream) onStream(finalText);
      await new Promise((res) => setTimeout(res, 30));
    }
  }

  return { text: finalText };
};

export default add;
