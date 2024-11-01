import { Heading } from "../_components/heading";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="px-4 md:px-10">
      <div className="mb-5 border-b-[1px] border-black/30 md:col-span-2 md:mb-10">
        <Heading
          level={3}
          className="mb-0 text-center uppercase tracking-wide md:text-left"
        >
          Our story
        </Heading>
      </div>

      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-5 pb-12 text-justify font-serif leading-loose tracking-wider">
        <p className="mb-6 text-center text-6xl md:text-left">Hi!</p>

        <p>
          My name is <b>Samantha</b> and I am the owner of{" "}
          <b>Sappho and Her Beans</b>. My business was started in the summer of
          2023, just a few short days before my daughter was born. My wife and I
          were at a local farmers market when she saw someone selling fresh
          roasted coffee. My wife suggested that I look into roasting my own
          coffee, because if he could do it why couldn&apos;t I? She thought it
          would make a neat hobby and maybe save us some money because we drink
          a lot of coffee. Little did she know that she was setting me off on
          the path that has led me to where I am today!
        </p>

        <p>
          I soon began selling my coffee at a local farmers market and knew I
          was on to something when I sold out three weeks in a row,with my
          streak only ending because I kept taking more product. Since starting
          in my home kitchen a little over a year ago I have expanded into a
          commercial facility and am proud to offer both retail and wholesale,
          developing lifelong partnerships and friendships along the way. You
          can find my coffee throughout the Northeast Ohio region and I&apos;m
          always looking for new opportunities.
        </p>

        <p>
          Pictured below is me, my wife, our daughter and one of my producing
          partners, Marcelo at the 2024 SCA expo in Chicago.
        </p>

        <div className="relative mt-6 h-96 w-full overflow-hidden rounded-3xl">
          <Image
            src="/images/our story.jpg"
            alt="Me, my wife, my daughter and my producing partner"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
