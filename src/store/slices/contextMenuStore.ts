import { StateCreator, create } from "zustand";

class SubMenuEventAction {
  title: string;
  action: (arg: any) => any;
  icon: string;

  constructor(title: string, icon: string, action: (arg: any) => any) {
    this.title = title;
    this.icon = icon;
    this.action = action;
  }
}

class MenuEventAction {
  title: string;
  show: boolean;
  action: (arg: any) => any;

  constructor(title: string, show: boolean, action: (arg: any) => any) {
    this.title = title;
    this.show = show;
    this.action = action;
  }
  /** Provide a state boolean to hide or show the menu item or provide empty to toggle */
  toggleShow(state?: boolean) {
    if (typeof state === "boolean") {
      return (this.show = state);
    }
    this.show = !this.show;
  }
}

const Add = new MenuEventAction("Add", true, () => {});
const Swap = new MenuEventAction("Swap", true, () => {});
const Run = new MenuEventAction("Run", true, () => {});

type menuContext = "formDesigner" | "promptBuilderSwap" | "promptBuilderAdd";

type menuActions = Array<MenuEventAction>;
type subMenuActions = Array<SubMenuEventAction>;

type State = {
  menuContext: menuContext;
  menuActions: menuActions;
  subMenuActions: subMenuActions;
  subMenuOpen: boolean;
  currentValue: string;
};

type Action = {
  changeCurrentSelection: (arg?: string) => void;
  changeContext: (arg: menuContext) => void;
  toggleSubMenu: (arg: boolean) => void;
  reset: () => void;
};

const initialState: State = {
  menuActions: getMenuActionForContext("promptBuilderAdd"),
  subMenuActions: [],
  subMenuOpen: false,
  currentValue: "",
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
  changeCurrentSelection: (arg) => set({ currentValue: arg }),
  toggleSubMenu: (arg) => set({ subMenuOpen: arg }),
  reset: () => set(initialState),
});
