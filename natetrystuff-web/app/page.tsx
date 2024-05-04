import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <button className="mx-2">Meals</button>
        <button className="mx-2">Schedule</button>
      </div>
    </main>
  );
}
