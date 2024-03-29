"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";
const EditorComponent = dynamic(
  // Import dynamically because it doesn't support SSR
  () => import("~/components/editor/Editor").then((res) => res.EditorComponent),
  {
    ssr: false,
  }
);

export const EditorSection = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditorComponent />
    </Suspense>
  );
};
