
import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.VITE_GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateCaption = async (title: string, project: string) => {
  if (!ai) return "API Key missing. Check .env.local";
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, engaging social media caption for a post titled "${title}" under the project "${project}" for the North South University Department of History and Philosophy. Include 3 relevant hashtags.`,
    });
    return response.text || "Could not generate caption.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating caption. Please try again.";
  }
};

export const suggestSchedule = async (existingPosts: any[]) => {
    if (!ai) return "API Key missing.";
    // Advanced reasoning for scheduling
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Based on these existing posts: ${JSON.stringify(existingPosts)}, suggest an optimal posting time for the next post to maximize engagement for university students. Return a brief reasoning.`,
    });
    return response.text;
}
