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
      },
      {
        name: "Little Blue Pastries & Cafe",
        address: "1827 Merriman Road, Akron, OH 44313",
        imageSrc: "/images/little blue.jpg",
        website:
          "https://www.facebook.com/p/little-blue-pastries-cafe-100082812447513/",
      },
    ],
  },
  {
    city: "Cleveland, OH",
    locations: [
      {
        name: "The Shops - Hanger 3 - City Goods",
        address: "1442 West. 28th St., Hanger 3, Cleveland, OH 44113",
        imageSrc: "/images/funkiniland.jpeg",
        mapsQuery: "City Goods Hanger 3 1442 West. 28th St.",
        website: "https://red-burgundy-m29y.squarespace.com/the-shops",
      },
      {
        name: "The Grocery - City Goods",
        address: "1442 West. 28th St., Hanger 2, Cleveland, OH 44113",
        imageSrc: "/images/the grocery.png",
        mapsQuery: "The Grocery 1442 West. 28th St.",
        website: "https://red-burgundy-m29y.squarespace.com/the-grocery",
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

            {locations.map((location, locationIndex) => (
              <Location
                key={locationIndex}
                {...location}
                orientation={locationIndex % 2 === 0 ? "left" : "right"}
              />
            ))}
          </Fragment>
        ))}
    </>
  );
}

type LocationProps = (typeof cities)[number]["locations"][number] & {
  orientation?: "left" | "right";
};

function Location({
  imageSrc,
  name,
  address,
  website,
  mapsQuery,
  orientation = "left",
}: LocationProps) {
  return (
    <div className="w-full md:flex">
      <div
        className={twMerge(
          "relative aspect-square h-64 w-full md:h-[450px] md:w-1/2",
          orientation === "right" && "md:order-last",
        )}
      >
        <a href={website} target="_blank">
          <Image src={imageSrc} alt={name} className="object-cover" fill />
        </a>
      </div>
      <div
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
      </div>
    </div>
  );
}
