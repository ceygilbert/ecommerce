
import { GoogleGenAI } from "@google/genai";

export const generateProductDescription = async (productName: string, specs: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
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
