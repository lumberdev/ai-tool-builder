export type EventListenerArray = Array<[string, (args?: any) => any]>;

/** Menu action types */
export class MenuEventAction {
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

export type MenuContext =
  | "formDesigner"
  | "promptBuilderSwap"
  | "promptBuilderAdd";

export type MenuActions = Array<MenuEventAction>;

/** Highlight selection type */
export type Selection = {
  selectedValue: string;
  startOffset: number;
  endOffset: number;
  nodeBlockIndex: number;
};

/** Form Data types */
export type RecordType = "PROMPT_TEXT_TYPE" | "FORM_TEXT_TYPE" | "INPUT_TYPE";

export type FormRecord = {
  data: any;
  id?: string;
  content?: string;
  type?: RecordType;
};
