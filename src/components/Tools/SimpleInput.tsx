import { ChangeEventHandler, FunctionComponent, useState } from "react";
import { EditorJsPluginProps, createEditorJsPlugin } from "./util";

type Props = {
  type: string;
  value: any;
  label: string;
  placeholder: string;
};

const SimpleInput: FunctionComponent<Props & EditorJsPluginProps<Props>> = (
  props
) => {
  const { dispatchData, value, placeholder, label, type } = props;
  const showEditModeByDefault = !label && !placeholder;
  const [editMode, setEditMode] = useState(showEditModeByDefault);
  const [labelValue, setLabel] = useState(label);
  const [placeholderValue, setPlaceholder] = useState(label);
  const [currentValue, setCurrentValue] = useState(value);

  const body = {
    type,
    label: labelValue ?? label,
    value,
    placeholder: placeholderValue ?? placeholder,
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatchData(body);
    setEditMode(!editMode);
  };

  const handleChangeInput = (event) => {
    setCurrentValue(event.target.value);
    dispatchData({ ...body, value: event.target.value });
    event.target.focus();
  };

  return (
    <div>
      {editMode && (
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <input
              placeholder="Enter Label for input"
              value={labelValue}
              onChange={(e) => setLabel(e.target.value)}
            ></input>
            <input
              onChange={(e) => setPlaceholder(e.target.value)}
              placeholder="Enter Placeholder for input"
            ></input>
          </div>
          <button>Finish</button>
        </form>
      )}
      {!editMode && (
        <button onClick={() => setEditMode(!editMode)}>Edit?</button>
      )}
      <div className="flex flex-col" key="unique">
        {!editMode && <label htmlFor="generic_input">{label}</label>}
        <input
          className="border border-2 border-solid"
          name={"generic_input"}
          value={currentValue}
          placeholder={placeholder}
          onChange={handleChangeInput}
        />
      </div>
    </div>
  );
};

export default createEditorJsPlugin<Props>({
  toolbox: {
    title: "Simple Input",
    icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>',
  },
  configuration: { readOnly: true },

  initialData: { url: "" },
  component: SimpleInput,
});
