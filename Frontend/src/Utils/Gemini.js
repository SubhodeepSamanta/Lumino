import { GoogleGenAI } from "@google/genai";

const add = async (question, onStream) => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    history: [
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
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
