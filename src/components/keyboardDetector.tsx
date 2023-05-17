"use client";

import { PropsWithChildren, useEffect, useState } from "react";

export const KeyboardAdjustedComponent = ({ children }: PropsWithChildren) => {
  const [bottom, setBottom] = useState(0);

  function detectKeyboardChange() {
    const viewport = window.visualViewport;

    setBottom(viewport?.height ?? 0);
  }
  useEffect(() => {
    window.visualViewport?.addEventListener("resize", detectKeyboardChange);
    return () => {
      window.visualViewport?.removeEventListener(
        "resize",
        detectKeyboardChange
      );
    };
  }, []);

  return (
    <div className="fixed w-full" style={{ bottom: 0 }}>
      {children}
    </div>
  );
};
