import { AI_MODELS, DEFAULT_AI_MODEL, SAFETY_SETTINGS, getAIModelFromEnv } from './ai-config';
import { getContextualSystemPrompt } from './system-prompts';

interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
    };
  }[];
}

export class GeminiService {
  private apiKey: string;
  private modelConfig: typeof AI_MODELS[string];

  constructor(apiKey: string, modelName?: string) {
    this.apiKey = apiKey;
    const selectedModel = modelName || getAIModelFromEnv();
    this.modelConfig = AI_MODELS[selectedModel] || AI_MODELS[DEFAULT_AI_MODEL];
  }

  async generateResponse(
    userMessage: string, 
    conversationHistory: GeminiMessage[] = [],
    userTier: 'free' | 'gold' = 'gold'
  ): Promise<string> {
    try {
      // Prepare messages array
      const messages: GeminiMessage[] = [];
      
      // Get contextual system prompt
      const systemPrompt = getContextualSystemPrompt(userMessage, userTier);
      
      // Prepare request body
      const requestBody: any = {
        contents: messages,
        generationConfig: {
          temperature: this.modelConfig.temperature,
          topK: this.modelConfig.topK,
          topP: this.modelConfig.topP,
          maxOutputTokens: this.modelConfig.maxTokens,
        },
        safetySettings: SAFETY_SETTINGS,
      };

      // Add system instruction
      requestBody.systemInstruction = {
        parts: [{ text: systemPrompt }]
      };

      // Add conversation history (limited to last 10 messages to avoid token limit)
      const recentHistory = conversationHistory.slice(-10);
      messages.push(...recentHistory);

      // Add current user message
      messages.push({
        role: 'user',
        parts: [{ text: userMessage }]
      });

      const response = await fetch(`${this.modelConfig.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data: GeminiResponse = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response generated from Gemini');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('Không thể kết nối với AI. Vui lòng thử lại sau.');
    }
  }
}
