import { GoogleGenAI, Type } from "@google/genai";
import { MOCK_PROPERTIES } from "../mockData";

export interface AISearchResult {
  recommendedPropertyIds: string[];
  summary: string;
}

export const searchPropertiesWithAI = async (userQuery: string): Promise<AISearchResult> => {
  try {
    // Initialize Gemini Client inside the function to prevent top-level crashes
    // if process.env is not available during module loading.
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
      console.warn("API Key is missing. AI features will not work.");
      return {
        recommendedPropertyIds: [],
        summary: "AI search is currently unavailable."
      };
    }

    const ai = new GoogleGenAI({ apiKey });

    // We send a simplified version of properties to save tokens
    const propertySummary = MOCK_PROPERTIES.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      location: p.location,
      amenities: p.amenities,
      type: p.type
    }));

    const systemInstruction = `
      You are an expert travel agent for 'StayEase'. 
      Your goal is to match a user's natural language request to the provided list of properties.
      
      Rules:
      1. Analyze the user's request for vibe, location, amenities, and group size.
      2. Select up to 4 properties that best match.
      3. Return a JSON object with a list of matching IDs and a friendly summary explaining why you picked them.
      4. If nothing matches perfectly, pick the closest alternatives and mention that.
    `;

    const prompt = `
      Available Properties: ${JSON.stringify(propertySummary)}
      
      User Request: "${userQuery}"
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedPropertyIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            summary: {
              type: Type.STRING,
              description: "A friendly, short paragraph explaining the recommendations."
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AISearchResult;
    }
    
    throw new Error("No response from AI");

  } catch (error) {
    console.error("AI Search Error:", error);
    return {
      recommendedPropertyIds: [],
      summary: "Sorry, I couldn't connect to the genius brain right now. Please try browsing our list below!"
    };
  }
};