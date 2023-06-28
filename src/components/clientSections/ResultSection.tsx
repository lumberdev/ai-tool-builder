"use client";
import { usePromptBuilderStoreData } from "~/store/hooks";
import MarkdownComponent from "../MarkdownComponent";

const ResultSection = () => {
  const { responseData } = usePromptBuilderStoreData();
  return (
    <div className="">
      <MarkdownComponent textContent={responseData} />
    </div>
  );
};

export default ResultSection;
