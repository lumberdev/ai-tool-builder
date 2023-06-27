import { StateCreator } from "zustand";
import { usePromptBuilderStore } from "..";
import { menuActions, menuContext, selection } from "~/utils/types";
import { Add, Run, Swap } from "~/utils/MenuActions";

type State = {
  menuContext: menuContext;
  menuActions: menuActions;
  currentSelection: selection;
};

type Action = {
  changeCurrentSelection: (
    arg: string,
    startOffset: number,
    endOffset: number,
    nodeBlockIndex: number
  ) => void;
  changeContext: (arg: menuContext) => void;
  reset: () => void;
};

const initialState: State = {
  menuActions: getMenuActionForContext("promptBuilderAdd"),
  currentSelection: {
    selectedValue: "",
    startOffset: 0,
    endOffset: 0,
    nodeBlockIndex: 0,
  },

  menuContext: "promptBuilderAdd",
};

function getMenuActionForContext(arg: menuContext) {
  const sharedMenuItems = [Run];
  switch (arg) {
    case "formDesigner":
      return [...sharedMenuItems];
    case "promptBuilderSwap":
      return [Swap, ...sharedMenuItems];
    case "promptBuilderAdd":
    default:
      return [Add, ...sharedMenuItems];
  }
}

export type ContextMenuStore = State & Action;

export const createContextMenuStore: StateCreator<State & Action> = (set) => ({
  ...initialState,
  changeContext: (arg) =>
    set({
      menuContext: arg,
      menuActions: getMenuActionForContext(arg),
    }),
  changeCurrentSelection: (
    selectedValue,
    startOffset,
    endOffset,
    nodeBlockIndex
  ) =>
    set({
      currentSelection: {
        selectedValue,
        startOffset,
        endOffset,
        nodeBlockIndex,
      },
    }),
  reset: () => set(initialState),
});
