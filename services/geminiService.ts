
import { GoogleGenAI } from "@google/genai";
import type { Property } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generatePropertyInsights = async (property: Property): Promise<string> => {
  const prompt = `
    You are a real estate marketing expert. Generate a compelling, short and exciting description for a property listing in Delhi NCR.
    Focus on the lifestyle benefits and unique selling points. Be creative and engaging.
    Keep the response under 100 words.

    Property Details:
    - Location: ${property.address}
    - Price: ${property.price}
    - Bedrooms: ${property.beds}
    - Bathrooms: ${property.baths}
    - Area: ${property.area} sq. ft.

    Generate the description now.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating property insights:", error);
    return "Could not generate AI insights at this time. Please try again later.";
  }
};
