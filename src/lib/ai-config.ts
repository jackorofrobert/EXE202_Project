// AI Model Configuration
export interface AIModelConfig {
  name: string;
  baseUrl: string;
  maxTokens: number;
  temperature: number;
  topK: number;
  topP: number;
}

export const AI_MODELS: Record<string, AIModelConfig> = {
  'gemini-flash-latest': {
    name: 'gemini-flash-latest',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent',
    maxTokens: 1024,
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
  },
  'gemini-1.5-flash': {
    name: 'gemini-1.5-flash',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
    maxTokens: 1024,
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
  },
  'gemini-pro': {
    name: 'gemini-pro',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    maxTokens: 2048,
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
  },
};

// Default model to use
export const DEFAULT_AI_MODEL = 'gemini-flash-latest';

// Safety settings configuration
export const SAFETY_SETTINGS = [
  {
    category: 'HARM_CATEGORY_HARASSMENT',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  },
  {
    category: 'HARM_CATEGORY_HATE_SPEECH',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  },
  {
    category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  },
  {
    category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  },
];

// Environment variable for AI model selection
export const getAIModelFromEnv = (): string => {
  return process.env.REACT_APP_AI_MODEL || DEFAULT_AI_MODEL;
};
