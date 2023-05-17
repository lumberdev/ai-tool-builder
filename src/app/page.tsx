import { MenuSection } from "~/components/MenuSection";
import { ClientWindowStates } from "~/components/clientWindowStates";
import { usePromptBuilderStore } from "~/store";

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-between p-24">
      <ClientWindowStates />
      <input />
      <div className="fixed bottom-0 w-full">
        <MenuSection />

        {/* <div className="grid h-[300px] grid-cols-2 gap-4 bg-slate-300 p-4">
          <button className="h-[50px] bg-slate-50">Something</button>
          <button className="h-[50px] bg-slate-50">Something</button>
        </div> */}
      </div>
      {JSON.stringify(usePromptBuilderStore.getState())}
    </main>
  );
}
