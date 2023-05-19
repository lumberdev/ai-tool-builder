import { useEffect, useState } from "react";
import { callOpenAiWithPromptData } from "../OpenAi";

export const useGetPromptCompletion = async (userPrompt: string) => {
  return await callOpenAiWithPromptData(userPrompt);
};
