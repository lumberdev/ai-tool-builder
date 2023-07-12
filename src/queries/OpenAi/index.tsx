import { ChatCompletionRequestMessage, OpenAIApi } from "openai";
import {
  BASE_SYSTEM_PROMPT_MESSAGE,
  modelConfiguration,
  openAiConfig,
} from "./openAIConfig";

const openai = new OpenAIApi(openAiConfig);

function combineWithSystemAIMessage(userPrompt: string) {
  const message = { role: "user", content: userPrompt };
  return {
    ...modelConfiguration,
    messages: [
      BASE_SYSTEM_PROMPT_MESSAGE,
      message,
    ] as ChatCompletionRequestMessage[],
  };
}

export const callOpenAiWithPromptData = async (userPrompt: string) => {
  if (process.env.NEXT_PUBLIC_MOCK === "true")
    return {
      role: "assistant",
      content: "\n\nHello there, how may I assist you today?",
    };
  const completion = await openai.createChatCompletion(
    combineWithSystemAIMessage(userPrompt)
  );

  return completion.data.choices[0].message;
};
