import Image from "next/image";
import { Fragment } from "react";
import { twMerge } from "tailwind-merge";
import { Heading } from "../_components/heading";

const cities = [
  {
    city: "Akron, OH",
    locations: [
      {
        name: "Northside Market Place",
        address: "21 Furnace St., Akron, OH 44308",
        imageSrc: "/images/northside market place.jpg",
        website: "https://www.northsidemarketplace.com/",
        mapsQuery: "northside market place akron oh",
        description: `The location that started it all - our home base! 
          Here you'll find our entire seasonally rotating catalog. We are proud to be the featured coffee partner of NOMZ.`,
      },
      {
        name: "Little Blue Pastries & Cafe",
        address: "1827 Merriman Road, Akron, OH 44313",
        imageSrc: "/images/little blue.jpg",
        website:
          "https://www.facebook.com/p/little-blue-pastries-cafe-100082812447513/",
        description: `Here you'll find our seasonally rotating catalog. Little Blue proudly serves our coffee on drip along side their wonderful breakfast and lunch options.`,
      },
    ],
  },
  {
    city: "Cleveland, OH",
    locations: [
      {
        name: "The Westside Cleveland Outpost",
        address: "1442 West. 28th St., Hanger 3, Cleveland, OH 44113",
        imageSrc: "/images/funkiniland.jpeg",
        mapsQuery: "City Goods Hanger 3 1442 West. 28th St.",
        website: "https://red-burgundy-m29y.squarespace.com/the-shops",
        description:
          "Here you'll find our seasonally rotating catalog. Grinder on site if needed.",
      },
      {
        name: "The Grocery - City Goods",
        address: "1442 West. 28th St., Hanger 2, Cleveland, OH 44113",
        imageSrc: "/images/the grocery.png",
        mapsQuery: "The Grocery 1442 West. 28th St.",
        website: "https://red-burgundy-m29y.squarespace.com/the-grocery",
        description: `Here you'll find our seasonally rotating catalog. Along side other phenomenal local grocery brands`,
      },
      {
        name: "The Lounge - City Goods",
        address: "1442 West. 28th St., Cleveland, OH 44113",
        imageSrc: "/images/the lounge.jpg",
        website: "https://red-burgundy-m29y.squarespace.com/the-lounge",
        mapsQuery: "The Lounge 1442 West. 28th St.",
      },
      {
        name: "The Corner - Van Aken",
        address: "3441 Tuttle Rd, Shaker Heights, OH 44122",
        imageSrc: "/images/the corner.jpg",
        mapsQuery: "the corner van aken",
        website: "https://thecorneratvanaken.com/",
      },
      {
        name: "Made Cleveland",
        address: "1807 Coventry Rd, Cleveland Heights, OH 44118",
        imageSrc: "/images/made cleveland.png",
        mapsQuery: "Made Cleveland 1807 Coventry Rd",
        website: "http://madecleveland.com/",
      },
    ],
  },
  {
    city: "Toledo, OH",
    locations: [
      {
        name: "Blended",
        address: "5001 Monroe St Suite 1150, Toledo, OH 43623",
        imageSrc: "/images/blended.jpg",
        mapsQuery: "blended toledo ohio",
        website: "https://www.blendedlocal.com/",
      },
    ],
  },

  {
    city: "New Castle, PA",
    locations: [
      {
        name: "The Epic Find",
        address: "2656 Ellwood Rd, Suite 102, New Castle, PA",
        mapsQuery: "The Epic Find 2656 Ellwood Rd",
        imageSrc: "/images/the epic find.jpg",
        website: "https://www.theepicfind.com/",
      },
    ],
  },
];

export default function LocationsPage() {
  return (
    <>
      {cities
        .filter((x) => x.locations.length > 0)
        .map(({ city, locations }, index) => (
          <Fragment key={index}>
            <div
              className={twMerge(
                "mx-10 mb-4 border-b-[1px] border-black/30 md:col-span-2",
                index !== 0 && "mt-10",
              )}
            >
              <Heading
                level={3}
                className="mb-0 text-center uppercase tracking-wide md:text-left"
              >
                {city}
              </Heading>
            </div>

            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-0">
              {locations.map((location, locationIndex) => (
                <Location
                  key={locationIndex}
                  {...location}
                  index={locationIndex}
                />
              ))}
            </div>
          </Fragment>
        ))}
    </>
  );
}

type LocationProps = (typeof cities)[number]["locations"][number] & {
  index: number;
};

function Location({
  imageSrc,
  name,
  address,
  website,
  mapsQuery,
  description,
  index,
}: LocationProps) {
  const orientation = index % 2 === 1 ? "right" : "left";
  return (
    <div className="grid grid-cols-subgrid md:col-span-2">
      <a className="px-2 text-center md:hidden" href={website} target="_blank">
        <Heading level={4} className="mb-1 font-bold md:mb-4 md:font-normal">
          {name}
        </Heading>
      </a>

      <div
        className={twMerge(
          "relative aspect-square h-64 w-full md:h-[450px]",
          orientation === "right" && "md:order-last",
        )}
      >
        <a href={website} target="_blank">
          <Image src={imageSrc} alt={name} className="object-cover" fill />
        </a>
      </div>

      <div className="grid grid-cols-subgrid grid-rows-[max-content_max-content_max-content] content-center px-7 md:px-10">
        <a className="hidden md:block" href={website} target="_blank">
          <Heading level={2} className="mb-0 md:mb-4">
            {name}
          </Heading>
        </a>

        <a
          href={`https://maps.google.com/?q=${mapsQuery ?? `${name} ${address}`}`}
          target="_blank"
        >
          <Heading level={5} className="mt-2 whitespace-pre-line">
            {address}
          </Heading>
        </a>

        {description && (
          <p className="mt-1 whitespace-pre-line text-justify leading-7 tracking-wider md:mt-4">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

{
  /* <div
        className={twMerge(
          "w-full self-center px-4 pb-10 pt-6 md:w-1/2 md:px-14 md:pb-0 md:pt-0",
          orientation === "right" && "md:order-first",
        )}
      >
        <a href={website} target="_blank">
          <Heading level={2} className="mb-0 md:mb-4">
            {name}
          </Heading>
        </a>

        <a
          href={`https://maps.google.com/?q=${mapsQuery ?? `${name} ${address}`}`}
          target="_blank"
        >
          <Heading level={5} className="mt-2 whitespace-pre-line">
            {address}
          </Heading>
        </a>

        {description && (
          <p className="mt-4 whitespace-pre-line text-justify leading-7 tracking-wider">
            {description}
          </p>
        )}
      </div> */
}
