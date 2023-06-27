"use client";
import { useEffect } from "react";
import { useContextMenuStoreData } from "~/store/hooks";

export const ClientWindowStates = () => {
  const { handleChangeCurrentSelection, currentSelection } =
    useContextMenuStoreData();

  useEffect(() => {
    const checkHighlightEvents = [
      "mousedown",
      "mouseup",
      "touchstart",
      "touchend",
    ];
    function checkHighlight() {
      const selection = window.getSelection();
      if (selection) {
        handleChangeCurrentSelection(
          selection?.toString() ?? "",
          selection?.anchorOffset as number,
          selection?.focusOffset as number,
          0
        );
      }
    }

    checkHighlightEvents.map((listener) => {
      window.addEventListener(listener, checkHighlight);
    });

    return () => {
      checkHighlightEvents.map((listener) => {
        window.removeEventListener(listener, checkHighlight);
      });
    };
  }, [handleChangeCurrentSelection]);
  return (
    <div className="absolute left-0 top-0">
      {JSON.stringify(currentSelection)}
    </div>
  );
};
