import { GoogleGenAI } from "@google/genai";
import { AppData, Transaction } from "../types";

// This service assumes the API Key is provided by the user in the "AIChat" component
// as we shouldn't hardcode it or rely on process.env in a purely client-side dynamic setup if not built.
// However, adhering to the prompt "The API key must be obtained exclusively from the environment variable",
// we will assume the build environment has it, OR allow the user to input it for this demo.
// For the purpose of this strict instruction "The API key must be obtained exclusively from the environment variable process.env.API_KEY",
// I will use process.env.API_KEY.

const SYSTEM_INSTRUCTION = `你是一个专业的 ZenLedger 记账助手。
你的角色是分析用户的财务数据（交易、账户）并提供有帮助、简明且可操作的建议。
你可以访问用户的账本上下文。
请保持礼貌、专业，并鼓励健康的财务习惯。
请使用 Markdown 格式回复。
`;

export const analyzeFinancials = async (query: string, data: AppData): Promise<string> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return "错误: 环境变量中缺少 Google Gemini API Key。";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Prepare context
    const contextSummary = {
      accountBalance: data.accounts.map(a => `${a.name}: ${a.currency} ${a.balance}`).join(', '),
      recentTransactions: data.transactions.slice(0, 50).map(t =>
        `${t.date}: ${t.type} of ${t.amount} ${t.currency} for ${t.categoryId} (${t.note || 'No note'})`
      ).join('\n'),
      totalTransactions: data.transactions.length
    };

    const prompt = `
    Context Data:
    ${JSON.stringify(contextSummary, null, 2)}

    User Query: ${query}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text || "我无法生成回复。";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "抱歉，在分析您的数据时遇到错误。";
  }
};
