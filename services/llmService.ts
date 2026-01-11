
import { AIConfig } from "../types";

export const PROVIDER_PRESETS: Record<string, Partial<AIConfig>> = {
  deepseek: {
    provider: 'deepseek',
    baseUrl: 'https://api.deepseek.com', // Corrected: base url only
    modelName: 'deepseek-chat'
  },
  siliconflow: {
    provider: 'siliconflow',
    baseUrl: 'https://api.siliconflow.cn/v1',
    modelName: 'Qwen/Qwen2.5-7B-Instruct'
  },
  doubao: {
    provider: 'doubao',
    baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
    modelName: '' // User needs to input their specific Endpoint ID
  },
  custom: {
    provider: 'custom',
    baseUrl: '',
    modelName: ''
  }
};

export const generateAnalysisReport = async (
  config: AIConfig,
  prompt: string,
  systemInstruction?: string
): Promise<string> => {
  if (!config.apiKey) {
    throw new Error("Missing API Key");
  }

  const messages = [
    { role: "system", content: systemInstruction || "You are a helpful assistant." },
    { role: "user", content: prompt }
  ];

  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.modelName,
        messages: messages,
        temperature: 0.7,
        stream: false
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "No content returned.";
  } catch (error: any) {
    console.error("LLM Service Error:", error);
    throw new Error(error.message || "Failed to contact AI provider");
  }
};
