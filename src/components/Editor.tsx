"use client";

import EditorJS, { BlockAPI } from "@editorjs/editorjs";
import { useEffect, useRef, useState } from "react";
import {
  useContextMenuStoreData,
  usePromptBuilderStoreData,
} from "~/store/hooks";
import SimpleImage from "./Tools/SimpleImage";
import SimpleDropdown, { createOptionItem } from "./Tools/SimpleDropdown";
import SimpleInput from "./Tools/SimpleInput";

const example_data = [
  {
    id: "1hpAs8A8nm",
    type: "paragraph",
    data: {
      text: "You are a wise sage, your job is to take this value: ",
    },
  },
  {
    id: "IDJYEjbZpc",
    type: "simpleDropdown",
    data: {
      value: "pineapple",
      options: [
        {
          id: "mdpDzSoxCjtddedGaOebz",
          value: "pineapple",
        },
        {
          id: "iwmHmzqnQP65hxTbC1ijd",
          value: "tomato",
        },
        {
          id: "VNIhS0Q2erUM1OfrjGO9i",
          value: "apple",
        },
      ],
    },
  },
  {
    id: "Y548CBbaGD",
    type: "paragraph",
    data: {
      text: "and describe how it ",
    },
  },
  {
    id: "YMWbzhraLg",
    type: "simpleDropdown",
    data: {
      value: "is_destroyed",
      options: [
        {
          id: "dbNK9vkuZDZmi0eS-ur6J",
          value: "is_destroyed",
        },
        {
          id: "zW5J-ZmV2GGjw7AJV0njI",
          value: "is_created",
        },
        {
          id: "Rx0K4qkRbYS5JKL2N5epX",
          value: "grows",
        },
      ],
    },
  },
  {
    id: "1NgHtGYyU3",
    type: "paragraph",
    data: {
      text: "in a<br>",
    },
  },
  {
    id: "ZIQZbxC3R1",
    type: "simpleInput",
    data: {
      label: "Tone",
      value: "Magical",
      placeholder: "Magical",
    },
  },
  {
    id: "ciiav6kNlA",
    type: "paragraph",
    data: {
      text: "way",
    },
  },
];

type EventListenerArray = Array<[string, (args?: any) => any]>;

const EDITOR_ID = "editor";
const FOCUS = true;

export const EditorComponent = () => {
  const { handleChangeCurrentSelection, currentSelection } =
    useContextMenuStoreData();
  const { setFormData, formData, responseData } = usePromptBuilderStoreData();
  const editorRef = useRef<EditorJS>();

  const [ready, setReady] = useState(false);

  useEffect(() => {
    editorRef.current = new EditorJS({
      holder: EDITOR_ID,
      autofocus: FOCUS,
      tools: {
        /* Add a bunch of tools here,
         Replace paragraph tool with one that conforms to what we need:
         A tool that has a hidden value called mode: PROMPT or mode: FORM
         Add input tools
         Add dropdown tools
         Each tool should exist in the stories-components.
         Each tool should conform to specific guidelines: 
          {
            mode: PROMPT|FORM
            type: paragraph|input|checkbox|radio
            data: {
              text: string |
              inputValue: string, label: string  |
              options: Array<string>, label: string |
            }
          }
        */
        simpleDropdown: SimpleDropdown,
        simpleImage: SimpleImage,
        simpleInput: SimpleInput,
        paragraph: {
          inlineToolbar: false,
          toolbox: {
            title: "Text",
          },
        },
      },

      placeholder:
        "This is a tool that takes the following ingredients: apples, bananas, cherries, and creates a recipe...",
      onReady: () => {
        setReady(true);
      },

      onChange: async () => {
        let content = await editorRef.current?.save();
        // Put your logic here to save this data to your DB
        setFormData(content.blocks);
      },
      data: {
        blocks: example_data,
      },
    });
    const editor = editorRef.current;

    return () => {
      if (editor && editor.destroy) editor.destroy();
    };
  }, []);

  const editorElementRef = useRef<HTMLInputElement>(null);

  const [elFocus, setElFocus] = useState(FOCUS);

  // Add event listeners to detect focus changes, change focus state
  useEffect(() => {
    const elEditor = editorElementRef.current;
    if (!elEditor || !ready) return;

    const handleCheckFocus = (focused: boolean) => {
      setElFocus(focused);
    };

    const checkFocusListeners: EventListenerArray = [
      ["focusin", () => handleCheckFocus(true)],
      ["focusout", () => handleCheckFocus(false)],
    ];

    checkFocusListeners.forEach(([listener, action]) => {
      elEditor.addEventListener(listener, action);
    });
    return () => {
      checkFocusListeners.forEach(([listener, action]) => {
        elEditor.removeEventListener(listener, action);
      });
    };
  }, [editorElementRef, ready]);

  // Handle highlighting if editor is focused
  useEffect(() => {
    function checkHighlight() {
      if (window.getSelection) {
        const selection = window.getSelection();
        console.log(selection?.anchorOffset, selection?.extentOffset);

        const nodeBlockIndex = editorRef.current?.blocks.getCurrentBlockIndex();
        handleChangeCurrentSelection(
          selection?.toString() ?? "",
          selection?.anchorOffset as number,
          selection?.extentOffset as number,
          nodeBlockIndex as number
        );
      }
    }
    const checkHighlightEvents: EventListenerArray = [
      ["selectionchange", checkHighlight],
    ];

    if (ready && elFocus)
      checkHighlightEvents.forEach(([listener, action]) => {
        document.addEventListener(listener, action);
      });

    return () => {
      checkHighlightEvents.forEach(([listener, action]) => {
        document.removeEventListener(listener, action);
      });
    };
  }, [elFocus, handleChangeCurrentSelection, ready]);

  function createBlockFromText(blockType: string, value: string) {
    let options = [];
    let returnValue = [];

    switch (blockType) {
      case "simpleInput":
        returnValue = [blockType, { value, placeholder: "", label: "" }];
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
      default:
        break;
    }
    return returnValue;
  }

  async function handleInsertDataBasedOnSelection(blockType: string) {
    const res = await editorRef?.current?.save();
    const { nodeBlockIndex, startOffset, endOffset } = currentSelection;
    const block = editorRef.current?.blocks.getBlockByIndex(nodeBlockIndex);

    const modifiedBlockData = async (block?: BlockAPI) => {
      if (!block) {
        throw new Error("No blocks provided");
      }
      const content = await block?.save();
      return [
        content?.data.text.slice(0, startOffset),
        content?.data.text.slice(startOffset, endOffset),
        content?.data.text.slice(endOffset, content?.data.text.length),
      ] as Array<string>;
    };
    try {
      const array = await modifiedBlockData(block);

      const editor = editorRef.current;

      array.map((value, index) => {
        if (index === 0) editor?.blocks.update(block?.id, { text: value });
        else if (index === 1)
          editor?.blocks.insert(...createBlockFromText(blockType, value));
        else editor?.blocks.insert("paragraph", { text: value }, index);
      });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <button
        onClick={async () => handleInsertDataBasedOnSelection("paragraph")}
      >
        Split Text
      </button>
      <button
        onClick={async () => handleInsertDataBasedOnSelection("simpleDropdown")}
      >
        Change to dropdown
      </button>
      <div className="relative w-[500px] p-4 sm:w-screen">
        <div
          ref={editorElementRef}
          id={EDITOR_ID}
          className="w-full rounded-md bg-white p-2"
        />
      </div>
      {/* <div>{JSON.stringify(currentSelection, null, 2)}</div>
      ----
      <div>{JSON.stringify(formData, null, 2)}</div>
      ___
      <div>{JSON.stringify(responseData, null, 2)}</div> */}
    </>
  );
};
