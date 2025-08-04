import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatPromptValue } from "@langchain/core/prompt_values";
import { ChatOpenAI } from "@langchain/openai";

if (!process.env.FEATHERLESS_API_KEY) {
  throw new Error("FEATHERLESS_API_KEY environment variable is not set. Please create a .env file based on .env.example");
}

export const chatModel = new ChatOpenAI({
  apiKey: process.env.FEATHERLESS_API_KEY,
  configuration: {
    baseURL: "https://api.featherless.ai/v1",
  },
  model: "meta-llama/Meta-Llama-3.1-8B-Instruct",
  timeout: 10_000,
});

export class LLMProvider {
  static invokeLLM = async (messages: (SystemMessage | HumanMessage | AIMessage)[]): Promise<string> => {
    const prompt = new ChatPromptValue(messages);

    console.log("Prompt: ", prompt.toString());
    const response = await chatModel.invoke(prompt);
    console.log("Response: ", response.content.toString());
    return response.content.toString();
  };
}
