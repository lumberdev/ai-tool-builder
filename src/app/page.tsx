import Image from "next/image";
import { Button } from "~/stories/Button";

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-between p-24">
      <Button label="abc" />
    </main>
  );
}
