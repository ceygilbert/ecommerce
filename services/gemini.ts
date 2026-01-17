
import { GoogleGenAI } from "@google/genai";

const getApiKey = () => {
  try {
    return (typeof process !== 'undefined' && process.env && process.env.API_KEY) || '';
  } catch {
    return '';
  }
};

export const generateProductDescription = async (productName: string, specs: string) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("Gemini API Key missing.");
    return "Description generation is unavailable without an API key.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a compelling, professional e-commerce product description for an IT store. 
      Product Name: ${productName}
      Specifications: ${specs}
      Style: Tech-focused, persuasive, highlights performance.`,
    });
    return response.text || "Description could not be generated.";
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "Error generating description.";
  }
};
