import dotenv from "dotenv";
import { generateWithGemini, generateWebsiteWithGemini, updateWebsiteWithGemini } from "./gemini.js";

dotenv.config();

export const generateResponse = async (prompt, options = {}) => {
  try {
   
    if (prompt.includes("Create a complete single-page website")) {
      const ideaMatch = prompt.match(/USER_PROMPT:\s*(.*?)(?:\n|$)/i) || 
                        prompt.match(/Idea:\s*(.*?)(?:\n|$)/i);
      const idea = ideaMatch ? ideaMatch[1] : "modern business website";
      
      return await generateWebsiteWithGemini(idea);
    }
    
    
    if (prompt.includes("Update this Website")) {
      const codeMatch = prompt.match(/Update this Website\s+([\s\S]*?)\s+user request:\s+([\s\S]*)/i);
      if (codeMatch) {
        const currentCode = codeMatch[1];
        const userRequest = codeMatch[2];
        return await updateWebsiteWithGemini(currentCode, userRequest);
      }
    }
    
    const chatPrompt = `
You are a helpful AI assistant. Respond to the user's message in a friendly, concise manner.

User message: ${prompt}

Response (JSON format only):
{
  "message": "your response here"
}
    `;
    
    const response = await generateWithGemini(chatPrompt);
    
  
    try {
      const parsed = JSON.parse(response);
      return JSON.stringify(parsed);
    } catch {
      return JSON.stringify({ message: response });
    }
    
  } catch (error) {
    console.log("Gemini API Error:", error);
    throw error;
  }
};