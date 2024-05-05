import Image from "next/image";
import Hub from "./hub";

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Hub />
    </main>
  );
}
