import { StateCreator } from "zustand";
import { callOpenAiWithPromptData } from "~/queries/OpenAi";
import { usePromptBuilderStore } from "..";
import { FormRecord } from "~/utils/types";

type State = {
  formData: Array<FormRecord>;
  responseData: string;
};

type Action = {
  setFormData: (arg: Array<FormRecord>) => void;
  getResponse: () => Promise<void>;
  reset: () => void;
};

const initialState: State = {
  formData: [],
  responseData: "",
};

const extractValuesFromFormData = (formData: Array<FormRecord>) => {
  const extractedData = formData
    .map((block) => block.data?.text ?? block.data?.value)
    .join(" ");

  return extractedData;
};

const getResponseData = async (formData: Array<FormRecord>) => {
  const userData = extractValuesFromFormData(formData);
  return (await callOpenAiWithPromptData(userData))?.content;
};

export type PromptBuilderStore = State & Action;

export const createPromptBuilderStore: StateCreator<PromptBuilderStore> = (
  set
) => ({
  ...initialState,
  setFormData: (arg) => set({ formData: arg }),
  getResponse: async () => {
    const formData = usePromptBuilderStore.getState().formData;
    const data = await getResponseData(formData);
    set({
      responseData: data,
    });
  },
  reset: () => set(initialState),
});
