import { StateCreator, create } from "zustand";
import { callOpenAiWithPromptData } from "~/queries/OpenAi";
import { usePromptBuilderStore } from "..";

enum RecordType {
  PROMPT_TEXT_TYPE, // Only shows in prompt editor
  FORM_TEXT_TYPE, // Shows to end user
  INPUT_TYPE,
}

type FormRecord = {
  id: string;
  content: string;
  type: RecordType;
};

type State = {
  formData: Array<FormRecord>;
  responseData: string;
};

type Action = {
  addFormData: (arg: FormRecord) => void;
  modifyFormData: (arg: FormRecord) => void;
  setFormData: (arg: Array<FormRecord>) => void;
  getResponse: () => Promise<void>;
  deleteFormData: (id: string) => void;
  reset: () => void;
};

const initialState: State = {
  formData: [],
  responseData: "",
};

const modifyArrayItemById = (
  id: string,
  arg: Record<any, any>,
  array: Array<any>
) => {
  const index = array.findIndex((item) => item.id === id);
  if (index === -1) {
    console.error("No item with matching ID exists");
    return array;
  }

  return [...array.slice(0, index), arg, array.slice(index + 1, array.length)];
};

const deleteArrayItemById = (id: string, array: Array<any>) => {
  const index = array.findIndex((item) => item.id === id);
  if (index === -1) {
    console.error("No item with matching ID exists");
    return array;
  }

  return [...array.slice(0, index), array.slice(index + 1, array.length)];
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
  addFormData: (arg) =>
    set((state) => ({
      // set merges state at one level, nested objects need explicit merge
      formData: [...state.formData, arg],
    })),
  modifyFormData: (arg) =>
    set((state) => ({
      formData: modifyArrayItemById(arg.id, arg, state.formData),
    })),
  deleteFormData: (id) =>
    set((state) => ({
      formData: deleteArrayItemById(id, state.formData),
    })),
  reset: () => set(initialState),
});
