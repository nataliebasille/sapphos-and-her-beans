import { twMerge } from "tailwind-merge";
import { Heading } from "../_components/heading";
import { PageContainer } from "../_components/page-container";
import Image from "next/image";
import { Fragment } from "react";

const cites = [
  {
    city: "Akron, OH",
    locations: [
      {
        name: "Northside Market Place",
        address: "21 Furnace St. Akron, OH 44308",
        imageSrc: "/images/northside market place.jpg",
      },
      {
        name: "Little Blue Crepe & Pastry Wagon",
        address: "1827 Merriman Rd. Akron, OH 44313",
        imageSrc: "/images/little blue.jpg",
      },
    ],
  },
  {
    city: "Cleveland, OH",
    locations: [
      {
        name: "FunkiniLand - City Goods",
        address: "1442 West. 28th St., Hanger 3, Cleveland, OH 44113",
        imageSrc: "/images/funkiniland.jpeg",
      },
      {
        name: "The Corner - Van Aken",
        address: "3441 Tuttle Rd, Shaker Heights, OH 44122",
        imageSrc: "/images/the corner.jpg",
      },
      {
        name: "Made Cleveland",
        address: "1807 Coventry Rd, Cleveland Heights, OH 44118",
        imageSrc: "/images/made cleveland.png",
      },
    ],
  },
  {
    city: "North Canton, OH",
    locations: [
      {
        name: "Fresh Thyme Market",
        address: "5509 Dressler Rd NW, North Canton, OH 44720",
        imageSrc: "/images/fresh thyme market.jpg",
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
      },
    ],
  },

  {
    city: "New Castle, PA",
    locations: [
      {
        name: "The Epic Find",
        address: "2656 Ellwood Rd, Suite 102, New Castle, PA",
        imageSrc: "/images/the epic find.jpg",
      },
    ],
  },
];

export default function LocationsPage() {
  return (
    <PageContainer>
      {cites
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
                key={index}
                imageSrc={location.imageSrc}
                name={location.name}
                address={location.address}
                orientation={locationIndex % 2 === 0 ? "left" : "right"}
              />
            ))}
          </Fragment>
        ))}
    </PageContainer>
  );
}

type LocationProps = {
  imageSrc: string;
  name: string;
  address: string;
  orientation?: "left" | "right";
};

function Location({
  imageSrc,
  name,
  address,
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
        <Image src={imageSrc} alt={name} className="object-cover" fill />
      </div>
      <div
        className={twMerge(
          "w-full self-center px-14 pb-10 pt-6 md:w-1/2 md:pb-0 md:pt-0",
          orientation === "right" && "md:order-first",
        )}
      >
        <Heading level={2} className="mb-0 md:mb-4">
          {name}
        </Heading>
        <span className="whitespace-pre-line">{address}</span>
      </div>
    </div>
  );
}
