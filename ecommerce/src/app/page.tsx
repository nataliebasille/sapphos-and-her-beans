import Image from "next/image";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center text-white">
      <div className="relative h-dvh w-full">
        <Image
          className="object-cover brightness-50"
          src="/images/beans.jpg"
          alt="Sappho and her beans"
          fill
        />
        <Image
          className="object-contain"
          src="/images/sappho no background.png"
          alt="Sappho"
          fill
        />
      </div>
    </main>
  );
}
