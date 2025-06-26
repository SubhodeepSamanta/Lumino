import { GoogleGenAI } from "@google/genai";

const add = async (question) => {
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: question,
    });
    return response;
  };

  export default add;