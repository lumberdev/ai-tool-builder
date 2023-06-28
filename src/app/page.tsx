import { EditorSection } from "~/components/clientSections/EditorSection";

import { MenuSection } from "~/components/clientSections/MenuSection";
import ResultSection from "~/components/clientSections/ResultSection";
export default function Home() {
  return (
    <main className="relative flex h-screen flex-col items-center justify-between p-24">
      <ResultSection />
      <EditorSection />
      <div className="fixed bottom-0 w-full">
        <MenuSection />
      </div>
    </main>
  );
}
