"use client";
import { useEffect } from "react";
import { useContextMenuStoreData } from "~/store/hooks";

export const ClientWindowStates = () => {
  const { handleChangeCurrentSelection, currentValue } =
    useContextMenuStoreData();

  useEffect(() => {
    const checkHighlightEvents = [
      "mousedown",
      "mouseup",
      "touchstart",
      "touchend",
    ];
    function checkHighlight() {
      if (window.getSelection) {
        handleChangeCurrentSelection(window.getSelection()?.toString() ?? "");
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
  return <div className="absolute left-0 top-0">{currentValue}</div>;
};
