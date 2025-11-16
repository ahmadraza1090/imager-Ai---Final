import { Resolution } from "../types";
import { GoogleGenAI } from "@google/genai";

const getApiKey = (): string | null => {
  return localStorage.getItem('imagerAiApiKeyOverride') || null;
}

const initializeAiClient = () => {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

export const generateImages = async (
  prompt: string,
  numberOfImages: number,
  resolution: Resolution
): Promise<string[]> => {
  const ai = initializeAiClient();
  if (!ai) {
    throw new Error("API Key is not configured. Please set it in the Admin Settings.");
  }
  
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: numberOfImages,
          outputMimeType: 'image/png',
          aspectRatio: resolution.value,
        },
    });
    
    if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error("Image generation failed to produce results.");
    }

    return response.generatedImages.map(
      (img) => `data:image/png;base64,${img.image.imageBytes}`
    );

  } catch (error: any) {
    console.error("Error generating images with Gemini:", error);
    if (error.message?.includes('API key not valid')) {
        throw new Error("The configured Google API Key is invalid. Please check it in the Admin Settings.");
    }
    if (error.message?.includes('quota')) {
         throw new Error("API quota exceeded. Please check your billing details with Google AI or set a new API key in the Admin Settings.");
    }
    throw new Error(error.message || "Failed to generate images. Please try again.");
  }
};
