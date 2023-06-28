"use client";

import { PropsWithChildren, useEffect, useRef, useState } from "react";
/**
 * On mobile ios, if the virtual keyboard is activated and visualViewport
 * is supported, the children in this will moved up above the keyboard
 */
export const KeyboardAdjustedComponent = ({ children }: PropsWithChildren) => {
  const [offset, setOffset] = useState(0);

  function detectKeyboardChange() {
    const viewport = window.visualViewport;
    if (!viewport) return;
    setOffset(window.innerHeight - viewport?.height ?? 0);
  }
  useEffect(() => {
    detectKeyboardChange();
    window.visualViewport?.addEventListener("resize", detectKeyboardChange);
    return () => {
      window.visualViewport?.removeEventListener(
        "resize",
        detectKeyboardChange
      );
    };
  }, []);

  return (
    <div className="fixed w-full" style={{ bottom: offset }}>
      {children}
    </div>
  );
};
