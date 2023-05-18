import { StateCreator, create } from "zustand";

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
};

type Action = {
  addFormData: (arg: FormRecord) => void;
  modifyFormData: (arg: FormRecord) => void;
  setFormData: (arg: Array<FormRecord>) => void;
  deleteFormData: (id: string) => void;
  reset: () => void;
};

const initialState: State = {
  formData: [],
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

export type PromptBuilderStore = State & Action;

export const createPromptBuilderStore: StateCreator<PromptBuilderStore> = (
  set
) => ({
  ...initialState,
  setFormData: (arg) => set({ formData: arg }),
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
