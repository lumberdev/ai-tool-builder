// import { useMDXComponents } from "~/mdx-components";
import ReactMarkdown from "react-markdown";

const MarkdownComponent = ({ textContent = "" }: { textContent: string }) => {
  //   const output = useMDXComponents({ textContent }); // render custom outputs

  return <ReactMarkdown>{textContent}</ReactMarkdown>;
};

export default MarkdownComponent;
