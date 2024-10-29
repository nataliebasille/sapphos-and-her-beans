import Image from "next/image";

export default function HomePage() {
  return (
    <main className="flex flex-col text-white">
      <div className="relative h-[92dvh] w-full">
        <Image
          className="object-cover brightness-50"
          src="/images/beans.jpg"
          alt="Sappho and her beans"
          fill
          priority
        />
        <Image
          className="object-contain"
          src="/images/sappho no background.png"
          alt="Sappho"
          fill
          priority
        />
      </div>

      <div className="relative grid grid-cols-1 flex-row-reverse bg-primary-base tracking-widest text-primary-contrast-base sm:px-20 md:grid-cols-[3fr_2fr] md:gap-4 md:p-4 md:px-36">
        <div className="row-start-2 flex min-w-0 flex-col gap-10 p-0 pb-8 font-thin sm:px-8 md:row-start-1 md:mr-24 md:p-0 md:pt-14 xl:mr-40">
          <span className="flex flex-col items-center justify-center text-center text-4xl lg:text-5xl xl:text-6xl">
            <span className="text-nowrap">Unique coffee</span>
            <span className="divider divider-secondary w-1/3 !self-center text-sm !font-thin text-white xl:text-base">
              AND
            </span>
            <span>Uncompromised quality</span>
          </span>
          <span className="px-12 !leading-loose sm:p-0 md:text-base md:leading-loose lg:text-xl xl:text-2xl">
            We are a specialty roaster focused on relational coffee. We&apos;re
            constantly talking to new people and making friends, looking for
            that next special harvest. We currently have producing partners in
            Brazil, Ethiopia and Nicaragua where we source direct trade coffee.
          </span>
        </div>
        <div className="px-8 sm:p-0">
          <div className="relative top-[-50px] row-start-1 h-96 overflow-hidden rounded-3xl md:h-full md:w-auto">
            <Image
              src="/images/owner.png"
              alt="Owner"
              fill
              className="object-cover md:object-[25%_bottom]"
              priority
            />
          </div>
        </div>
      </div>
    </main>
  );
}
