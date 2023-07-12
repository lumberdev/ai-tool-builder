import { usePromptBuilderStore } from "~/store";
import { MenuEventAction } from "./types";

export const Add = new MenuEventAction("Add", true, () =>
  dispatchEvent(
    new CustomEvent<AdditionalMenuContext>("_onopenmenu", {
      detail: { type: "" },
    })
  )
);
export const Swap = new MenuEventAction("Swap", true, () =>
  dispatchEvent(
    new CustomEvent<AdditionalMenuContext>("_onopenmenu", {
      detail: { type: "" },
    })
  )
);
export const Run = new MenuEventAction(
  "Run",
  true,
  () => usePromptBuilderStore.getState().getResponse() // callback to avoid initialization error
);
