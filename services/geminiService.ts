import { GoogleGenAI, Type } from "@google/genai";
import { Language, GrammarExplanationResponse } from '../types';

// FIX: Initialize the GoogleGenAI client. The API key must be read from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// FIX: Define the JSON schema for the model's response.
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    translation: {
      type: Type.STRING,
      description: 'The translated text.'
    },
    explanation: {
      type: Type.OBJECT,
      description: 'A detailed analysis of the translation.',
      properties: {
         breakdown: {
            type: Type.STRING,
            description: 'A detailed, beginner-friendly grammatical explanation of the translation, comparing it to the source text. Explain key differences in sentence structure, verb conjugations, and vocabulary choices.'
         },
         dependencyParse: {
            type: Type.STRING,
            description: 'A simplified dependency parse of the original source text, showing relationships like word -> head [relation].'
         },
         errorAnalysis: {
            type: Type.STRING,
            description: 'A critical linguistic error analysis of the generated translation. Identify potential grammatical errors, awkward phrasing, or meaning shifts, and suggest corrections.'
         }
      },
      required: ['breakdown']
    },
    evaluation: {
      type: Type.OBJECT,
      properties: {
        fluency: {
          type: Type.NUMBER,
          description: 'A score from 1-10 representing how natural and fluent the translation sounds.'
        },
        accuracy: {
          type: Type.NUMBER,
          description: 'A score from 1-10 representing how accurately the translation conveys the meaning of the source text.'
        },
        grammar_correctness: {
          type: Type.NUMBER,
          description: 'A score from 1-10 representing the grammatical correctness of the translation.'
        },
        tone_appropriateness: {
          type: Type.NUMBER,
          description: 'A score from 1-10 representing how well the tone of the translation matches the source text (e.g., formal, informal, etc.).'
        }
      },
      required: ['fluency', 'accuracy', 'grammar_correctness', 'tone_appropriateness']
    }
  },
  required: ['translation', 'explanation', 'evaluation']
};

export const translateAndExplain = async (
  text: string,
  sourceLang: Language,
  targetLang: Language
): Promise<GrammarExplanationResponse> => {

  const prompt = `
    You are an expert linguist and a grammar-aware NMT system specializing in Indian languages. Your task is to provide a high-quality translation and a multi-faceted grammatical analysis.

    Source Language: ${sourceLang}
    Target Language: ${targetLang}
    Text to Translate: "${text}"

    Please provide a response in JSON format. The 'explanation' field must be an object with three parts:
    1.  "breakdown": A detailed grammatical comparison between the source and target sentences. Explain differences in structure (e.g., SOV vs. SVO), verb conjugations, noun cases, and vocabulary.
    2.  "dependencyParse": A simplified dependency parse of the *source* text. Use a format like "word -> head [relation]" for each token.
    3.  "errorAnalysis": A critical linguistic error analysis of *your own translation*. Identify any potential grammatical errors, awkward phrasing, or meaning shifts. If there are errors, suggest corrections. If the translation is perfect, state that.
  `;

  try {
    // FIX: Use the correct method to generate content with a JSON response.
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    // FIX: Correctly extract and parse the JSON response from the model.
    const jsonText = response.text.trim();
    if (!jsonText) {
        throw new Error("Received an empty response from the API.");
    }
    const result = JSON.parse(jsonText);

    if (
      !result.translation ||
      !result.explanation ||
      !result.explanation.breakdown ||
      !result.evaluation
    ) {
      throw new Error("Invalid response format from API.");
    }
    
    return result as GrammarExplanationResponse;

  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof SyntaxError) {
        throw new Error("Failed to parse the response from the API. It was not valid JSON.");
    }
    if (error.message.includes('429') || error.message.includes('rate limit')) {
      throw new Error("API rate limit exceeded. Please try again later.");
    }
    throw new Error(`Failed to get translation from Gemini API: ${error.message}`);
  }
};