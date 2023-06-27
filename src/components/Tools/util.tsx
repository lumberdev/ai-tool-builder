import { FunctionComponent, createElement } from "react";
import ReactDOM from "react-dom";
import { Root, createRoot } from "react-dom/client";
import { createOptionItem } from "./SimpleDropdown";

/** Handle Tool Creation */
type CreateEditorJsPluginOptions<T> = {
  toolbox: {
    title: string;
    icon: string;
  };
  configuration: any;
  initialData: T;
  validator?: (data: T) => boolean;
  component: FunctionComponent<T & EditorJsPluginProps<T>>;
};

export type EditorJsPluginProps<T> = {
  dispatchData: DispatchDataFunc<T>;
};

type DispatchDataFunc<T> = (data: T) => void;

export function createEditorJsPlugin<T>(
  options: CreateEditorJsPluginOptions<T>
) {
  const {
    toolbox: { title, icon },
    configuration,
    initialData,
    validator,
    component,
  } = options;

  return class {
    static get toolbox() {
      return {
        title,
        icon,
      };
    }

    _container: HTMLDivElement;
    _data: T;
    _root: Root;

    constructor({ data }: { data: T }) {
      this._container = document.createElement("div");
      this._root = createRoot(this._container, { identifierPrefix: "adfsfds" });
      this._data = data ?? initialData;
    }

    static get isReadOnlySupported() {
      return configuration.readOnly;
    }

    render() {
      this._renderContainer();
      return this._container;
    }

    save() {
      return {
        ...this._data,
      };
    }

    // Validate incoming data with a callback
    validate(data: T) {
      if (validator) return validator(data);
      return true;
    }

    // helper functions
    _dispatchData: DispatchDataFunc<T> = (data) => {
      this._data = data;
      this._renderContainer();
    };

    _renderContainer() {
      this._root.render(
        createElement(component, {
          dispatchData: this._dispatchData,
          ...this._data,
        })
      );
    }
  };
}

/** Handle Tool serialization */
export function createBlockFromText(blockType: string, value: string) {
  let options = [];
  let returnValue: [string, Record<string, any>] | [] = [];
  switch (blockType) {
    case "simpleInput":
      returnValue = [blockType, { value: value, placeholder: "", label: "" }];
      break;
    case "paragraph":
      returnValue = [blockType, { text: value }];
      break;
    case "simpleDropdown":
      (options = value
        .replace(/,+/g, "")
        .split(" ")
        .map((option) => createOptionItem(option))),
        (returnValue = [
          blockType,
          {
            value: options?.[0]?.value,
            options,
          },
        ]);
      break;
    default:
      break;
  }
  return returnValue;
}
