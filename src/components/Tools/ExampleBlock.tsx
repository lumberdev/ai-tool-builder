import type { BlockTool, ToolboxConfig } from "@editorjs/editorjs";
import { nanoid } from "nanoid";
import ReactDOM from "react-dom";
import { ChangeEventHandler, FunctionComponent, useCallback } from "react";

interface ExampleReactBlockToolData {
  text: string;
}

interface ValidatedExampleReactBlockToolData
  extends ExampleReactBlockToolData {}

type ExampleReactBlockToolDispatchData = (action: { text?: string }) => void;

class CreateReactBlockTool implements BlockTool {
  _container: HTMLDivElement;
  _editorJSChangeEventID: string;
  _text: string;

  constructor() {
    this._container = document.createElement("div");
    this._editorJSChangeEventID = nanoid();
    this._text = "";
  }

  static get toolbox() {
    return {
      title: "Image",
      icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>',
    };
  }

  render() {
    this.renderContainer();

    return this._container;
  }

  save(): ValidatedExampleReactBlockToolData {
    return {
      text: this._text,
    };
  }

  _dispatchData: ExampleReactBlockToolDispatchData = (action) => {
    if (action.text !== undefined) {
      this._text = action.text;
    }

    // Dispatch Editor.js change event even without DOM changes.
    this._editorJSChangeEventID = nanoid();

    this.renderContainer();
  };

  renderContainer() {
    ReactDOM.render(
      <div data-editorjs-change-event-id={this._editorJSChangeEventID}>
        <Content dispatchData={this._dispatchData} text={this._text} />
      </div>,
      this._container
    );
  }
}

const Content: FunctionComponent<{
  dispatchData: ExampleReactBlockToolDispatchData;
  text: string;
}> = ({ dispatchData, text }) => {
  const handleTextChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => dispatchData({ text: event.target.value }),
    [dispatchData]
  );

  return <input value={text} onChange={handleTextChange} />;
};

export { CreateReactBlockTool };
export type {
  ExampleReactBlockToolDispatchData,
  ExampleReactBlockToolData,
  ValidatedExampleReactBlockToolData,
};
