import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function reviewCode(code: string): Promise<string> {
    const prompt = `
        You are an expert code reviewer. Please analyze the following code for errors, performance issues, security vulnerabilities, and suggest improvements.
        Focus on functional correctness and best practices.

        Code:
        \`\`\`
        ${code}
        \`\`\`

        Provide a concise, structured review.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
    });

    return response.text || "No review generated.";
}
