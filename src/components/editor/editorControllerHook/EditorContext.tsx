import {
  MutableRefObject,
  Ref,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import EditorJS, { BlockAPI } from "@editorjs/editorjs";
import { useContextMenuStoreData } from "~/store/hooks";
import { usePromptBuilderStore } from "~/store";
import { createBlockFromText } from "~/utils/toolUtils";
import { EventListenerArray, FormRecord } from "~/utils/types";
import { SimpleDropdownTool, SimpleInputTool } from "~/components/Tools";

const EDITOR_ID = "editor";
const FOCUS = true;

export const useEditorController = () => {
  const editorRef = useRef<EditorJS>();
  const editorElementRef = useRef<HTMLInputElement>(null);
  const setFormData = usePromptBuilderStore((state) => state.setFormData);
  const { handleChangeCurrentSelection, currentSelection } =
    useContextMenuStoreData();

  const [ready, setReady] = useState<boolean>(false);

  const [_ref, setElementRef] = useState<Ref<HTMLInputElement>>(editorElementRef);

  useEffect(() => {
    if (!editorElementRef.current) return;
    setElementRef(editorElementRef);
  }, []);

  useEffect(() => {
    editorRef.current = new EditorJS({
      holder: EDITOR_ID,
      autofocus: FOCUS,
      hideToolbar: true, // bug not working
      inlineToolbar: false,
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
        simpleDropdown: SimpleDropdownTool,
        simpleInput: SimpleInputTool,
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
        if (content?.blocks) setFormData(content.blocks as FormRecord[]);
      },
    });
    const editor = editorRef.current;

    return () => {
      if (editor && editor.destroy) editor.destroy();
    };
  }, [setFormData]);

  const { elFocus } = useFocusEditor({ ref: editorElementRef, isReady: ready });
  useHighlightEditor({
    ref: editorRef,
    isReady: ready,
    elFocus,
    handleChangeCurrentSelection,
  });

  async function handleInsertDataBasedOnSelection(blockType: string) {
    await editorRef?.current?.save();
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
        const arg = createBlockFromText(blockType, value ?? "");
        if (index === 0 && block?.id)
          editor?.blocks.update(block.id, { text: value });
        else if (index === 1) editor?.blocks.insert(arg[0], arg[1]);
        else editor?.blocks.insert("paragraph", { text: value }, index);
      });
    } catch (error) {
      console.log(error);
    }
  }

  return { handleInsertDataBasedOnSelection, ref: _ref, id: EDITOR_ID };
};

const useFocusEditor = ({
  ref,
  isReady,
}: {
  ref: RefObject<HTMLInputElement>;
  isReady: boolean;
}) => {
  const [elFocus, setElFocus] = useState<boolean>(FOCUS);
  useEffect(() => {
    const elEditor = ref.current;
    if (!elEditor || !isReady) return;

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
  }, [ref, isReady]);

  return { elFocus };
};

type handleChangeCurrentSelection = (
  arg: string,
  ind0: number,
  ind1: number,
  nodeBlockIndex: number
) => void;

const useHighlightEditor = ({
  ref,
  isReady,
  elFocus,
  handleChangeCurrentSelection,
}: {
  ref: MutableRefObject<EditorJS | undefined>;
  isReady: boolean;
  elFocus: boolean;
  handleChangeCurrentSelection: handleChangeCurrentSelection
}) => {
  // Handle highlighting if editor is focused
  useEffect(() => {
    if (!ref || !ref.current) return;
    function checkHighlight() {
      if (window.getSelection) {
        const selection = window.getSelection();

        const nodeBlockIndex = ref?.current?.blocks?.getCurrentBlockIndex();
        handleChangeCurrentSelection(
          selection?.toString() ?? "",
          selection?.anchorOffset ?? 0,
          selection?.focusOffset ?? 0,
          nodeBlockIndex ?? 0
        );
      }
    }
    const checkHighlightEvents: EventListenerArray = [
      ["selectionchange", checkHighlight],
    ];

    if (isReady && elFocus)
      checkHighlightEvents.forEach(([listener, action]) => {
        document.addEventListener(listener, action);
      });

    return () => {
      checkHighlightEvents.forEach(([listener, action]) => {
        document.removeEventListener(listener, action);
      });
    };
  }, [elFocus, handleChangeCurrentSelection, isReady, ref]);
};
