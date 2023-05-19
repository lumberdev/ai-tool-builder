import { ChangeEventHandler, FunctionComponent, useState } from "react";
import { EditorJsPluginProps, createEditorJsPlugin } from "./util";
import { nanoid } from "nanoid";

type Props = {
  value: "";
  options: Array<{ value: string; id: string }>;
};

type OptionItem = { value: string; id: string };

export function createOptionItem(value: string) {
  return { id: nanoid(), value };
}

const SimpleDropDown: FunctionComponent<Props & EditorJsPluginProps<Props>> = (
  props
) => {
  const { dispatchData, options = [], value } = props;

  const [data, setData] = useState("");
  const [list, setList] = useState<Array<OptionItem>>(options);

  function handleSubmit(event) {
    event?.preventDefault();
    const newListItem = createOptionItem(data);
    setList((state) => {
      const changed = [...state, newListItem];
      dispatchData({ options: changed });
      return changed;
    });
  }

  const [currentValue, setCurrentValue] = useState(value);

  const handleChangeDropdown = (event) => {
    setCurrentValue(event.target.value);
    dispatchData({ options, value: event.target.value });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="optionInput">Enter Options</label>
        <input
          onChange={(event) => {
            setData(event.target.value);
          }}
        />
        <button>+</button>
      </form>

      <select
        name="generic_dropdown"
        value={currentValue}
        onChange={handleChangeDropdown}
      >
        {list.map((item) => (
          <option key={item.id} value={item.value}>
            {item.value}
          </option>
        ))}
      </select>
    </>
  );
};

export default createEditorJsPlugin<Props>({
  toolbox: {
    title: "Drop down",
    icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>',
  },
  configuration: { readOnly: true },

  initialData: { options: [], value: "" },
  component: SimpleDropDown,
});
