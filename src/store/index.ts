import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  PromptBuilderStore,
  createPromptBuilderStore,
} from "./slices/currentPromptStore";
import {
  ContextMenuStore,
  createContextMenuStore,
} from "./slices/contextMenuStore";

export const usePromptBuilderStore = create<PromptBuilderStore>()(
  devtools(
    (...a) => ({
      ...createPromptBuilderStore(...a),
    }),
    {
      store: "promptBuilder",
    }
  )
);

export const useContextMenuStore = create<ContextMenuStore>()(
  devtools(
    (...a) => ({
      ...createContextMenuStore(...a),
    }),
    {
      store: "contextMenu",
    }
  )
);
