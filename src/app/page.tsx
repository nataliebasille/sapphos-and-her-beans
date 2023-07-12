import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="relative flex w-full bg-black/50 bg-[url('/images/coffee-3392168_1920.jpg')]">
        <div className="absolute left-0 top-0 -z-0 h-full w-full bg-black/30"></div>
        <Image
          className="relative z-10"
          src="/images/shappo-logo.png"
          alt="Sappho being awesome"
          height={480}
          width={480}
        />

        <div className="flex flex-1 flex-col items-center justify-center gap-10 text-white">
          <h1 className="text-center text-6xl font-bold drop-shadow-[0_0_2px_rgba(0,0,0,1)]">
            Lorem ipsum dolor sit amet
          </h1>
          <h2 className="text-center text-4xl font-bold drop-shadow-[0_0_2px_rgba(0,0,0,1)]">
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat.
          </h2>
        </div>
      </div>

      <div className="flex flex-col gap-5 bg-[#6f5741] p-10  text-2xl tracking-wide text-white">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        </p>

        <p>
          Diam sollicitudin tempor id eu nisl nunc mi ipsum. Sapien nec sagittis
          aliquam malesuada bibendum arcu vitae elementum curabitur. Id faucibus
          nisl tincidunt eget nullam non nisi est sit. Nunc id cursus metus
          aliquam eleifend mi. Viverra nibh cras pulvinar mattis nunc sed
          blandit libero. Malesuada fames ac turpis egestas. Accumsan tortor
          posuere ac ut consequat semper.
        </p>

        <p>
          Diam quis enim lobortis scelerisque fermentum dui faucibus. Volutpat
          ac tincidunt vitae semper quis. Nunc faucibus a pellentesque sit amet
          porttitor eget. Erat imperdiet sed euismod nisi porta lorem mollis
          aliquam ut.
        </p>
      </div>

      <div className="flex flex-col gap-5 bg-[#edded1] p-7">
        <div className="self-center tracking-wide">
          <h3 className="text-center text-4xl font-bold text-[#49292F]">
            Sappho&apos;s shop
          </h3>

          <h4 className="mt-1 text-center text-2xl uppercase text-gray-700">
            Popular
          </h4>
        </div>
        <div className="flex justify-evenly tracking-wider">
          <div className="flex flex-col">
            <div className="relative scale-75 cursor-pointer transition duration-150 ease-out hover:scale-110">
              <Image
                src="/images/bag-155354_1920.png"
                alt="fake bag please ignore lol"
                width={250}
                height={250}
              ></Image>

              <Image
                className="absolute left-[63%] top-[62%] translate-x-[-50%] translate-y-[-50%] transform"
                src="/images/shappo-logo.png"
                alt="logo for fake bag"
                width={175}
                height={175}
              />
            </div>

            <h5 className="mt-3 text-center font-semibold uppercase text-gray-700 ">
              Guatemala
            </h5>
            <h6 className="text-center text-sm font-semibold uppercase text-gray-500">
              Medium
            </h6>
          </div>

          <div className="flex flex-col">
            <div className="relative cursor-pointer transition duration-150 ease-out hover:scale-110">
              <Image
                src="/images/bag-155354_1920.png"
                alt="fake bag please ignore lol"
                width={250}
                height={250}
              ></Image>

              <Image
                className="absolute left-[63%] top-[62%] translate-x-[-50%] translate-y-[-50%] transform"
                src="/images/shappo-logo.png"
                alt="logo for fake bag"
                width={175}
                height={175}
              />
            </div>
            <h5 className="mt-3 text-center font-semibold uppercase text-gray-700 ">
              Ethiopia
            </h5>
            <h6 className="text-center text-sm font-semibold uppercase text-gray-500">
              Light
            </h6>
          </div>

          <div className="flex flex-col">
            <div className="relative scale-75 cursor-pointer transition duration-150 ease-out hover:scale-110">
              <Image
                src="/images/bag-155354_1920.png"
                alt="fake bag please ignore lol"
                width={250}
                height={250}
              ></Image>

              <Image
                className="absolute left-[63%] top-[62%] translate-x-[-50%] translate-y-[-50%] transform"
                src="/images/shappo-logo.png"
                alt="logo for fake bag"
                width={175}
                height={175}
              />
            </div>
            <h5 className="mt-3 text-center font-semibold uppercase text-gray-700 ">
              Sumatra
            </h5>
            <h6 className="text-center text-sm font-semibold uppercase text-gray-500">
              Dark
            </h6>
          </div>
        </div>

        <div className="self-center tracking-wide">
          <h4 className="mt-8 text-center text-2xl uppercase text-gray-700">
            Shop all
          </h4>
        </div>

        <div className="-mt-2 flex items-center justify-evenly">
          <Image
            className="cursor-pointer p-4 transition duration-150 ease-out hover:scale-110"
            src="/images/amazon-logo.png"
            alt="amazon"
            width={250}
            height={250}
          />

          <Image
            className="cursor-pointer p-4 transition duration-150 ease-out hover:scale-110"
            src="/images/Ebay_logo_PNG1.png"
            alt="ebay"
            width={250}
            height={250}
          />

          <Image
            className="cursor-pointer p-4 transition duration-150 ease-out hover:scale-110"
            src="/images/etsy-logo.png"
            alt="ebay"
            width={250}
            height={250}
          />
        </div>
      </div>
    </>
  );
}
