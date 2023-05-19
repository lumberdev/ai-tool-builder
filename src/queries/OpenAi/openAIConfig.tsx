import { Configuration } from "openai";

const OPEN_AI_TEMP = 1;
const OPEN_AI_STREAM = false;
const OPEN_AI_MAX_TOKENS = 500;

export const modelConfiguration = {
  model: "gpt-3.5-turbo",
  messages: [],
  temperature: OPEN_AI_TEMP,
  stream: OPEN_AI_STREAM,
  max_tokens: OPEN_AI_MAX_TOKENS,
};

export const openAiConfig = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPEN_AI_KEY,
});

export const BASE_SYSTEM_PROMPT_MESSAGE = {
  role: "system",
  content: "you make tools",
};
