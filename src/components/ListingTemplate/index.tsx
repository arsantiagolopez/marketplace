import Link from "next/link";
import React, { FC } from "react";
import { ListingEntity } from "../../types";
import { PriceTag } from "../PriceTag";
import { Tooltip } from "../Tooltip";
import { Dropdown } from "./Dropdown";
// import useSWR from "swr"

interface Props {
  seller: string;
  listing: ListingEntity;
}

const ListingTemplate: FC<Props> = ({ seller, listing }) => {
  const { image, name, description, price, tokenId, tokenContract } = listing;

  // const { data: sellerProfile } = useSWR(`/api/sellers/${seller}`)
  // const {name: sellerName, address: sellerAddress} = sellerProfile || {}

  const { name: sellerName, address: sellerAddress } = {
    name: "McDonalds",
    address: "0x74A602830542b3e52ffCB5eb4bC902372a4fc076",
  };

  const items = [
    {
      id: 1,
      name: "Bacon",
      image:
        "https://images.pexels.com/photos/4110366/pexels-photo-4110366.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      price: 7,
    },
    {
      id: 2,
      name: "French fries",
      image:
        "https://images.pexels.com/photos/4109234/pexels-photo-4109234.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      price: 25,
    },
    {
      id: 3,
      name: "Bacon",
      image:
        "https://images.pexels.com/photos/4110366/pexels-photo-4110366.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      price: 7,
    },
    {
      id: 4,
      name: "French fries",
      image:
        "https://images.pexels.com/photos/4109234/pexels-photo-4109234.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      price: 25,
    },
    {
      id: 5,
      name: "Bacon",
      image:
        "https://images.pexels.com/photos/4110366/pexels-photo-4110366.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      price: 7,
    },
    {
      id: 6,
      name: "French fries",
      image:
        "https://images.pexels.com/photos/4109234/pexels-photo-4109234.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      price: 25,
    },
    {
      id: 7,
      name: "Bacon",
      image:
        "https://images.pexels.com/photos/4110366/pexels-photo-4110366.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      price: 7,
    },
    {
      id: 8,
      name: "French fries",
      image:
        "https://images.pexels.com/photos/4109234/pexels-photo-4109234.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      price: 25,
    },
    {
      id: 9,
      name: "Bacon",
      image:
        "https://images.pexels.com/photos/4110366/pexels-photo-4110366.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      price: 7,
    },
    {
      id: 10,
      name: "French fries",
      image:
        "https://images.pexels.com/photos/4109234/pexels-photo-4109234.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      price: 25,
    },
    {
      id: 11,
      name: "Bacon",
      image:
        "https://images.pexels.com/photos/4110366/pexels-photo-4110366.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      price: 7,
    },
    {
      id: 12,
      name: "French fries",
      image:
        "https://images.pexels.com/photos/4109234/pexels-photo-4109234.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      price: 25,
    },
  ];

  const priceTagProps = { price, isListing: true };

  return (
    <div className="relative flex flex-col md:justify-center min-h-screen bg-white mt-[-4rem] md:mt-[-5rem] pt-16 md:pt-20">
      <div className="absolute top-0 left-0 animate-[pulse_10s_ease-in-out_infinite] bg-gray-50 h-full w-full"></div>

      <div className="z-10 grid grid-cols-1 md:grid-cols-2 gap-8 mx-4 md:mx-[8%] pt-6 md:pt-8 min-h-[90vh]">
        <div className="md:sticky md:top-28 bg-gray-100 rounded-xl w-full h-full md:max-h-[80vh] shadow-2xl">
          <div className="w-full h-full aspect-square p-3 md:p-6">
            <img
              src={image}
              className="object-cover h-full w-full rounded-xl overflow-hidden"
            />
          </div>
        </div>

        <div className="z-10 flex flex-col w-full text-primary md:p-5">
          <Link href={`/sellers/${sellerAddress}`}>
            <h1 className="font-Basic text-2xl tracking-tighter truncate">
              {sellerName}'s
            </h1>
          </Link>

          <h1 className="font-Basic text-4xl md:text-6xl tracking-tighter my-3 md:my-4">
            {name}
          </h1>

          <p className="text-tertiary py-3 md:py-4">{description}</p>

          {
            // @todo: Add currency and fix
          }
          <div className="my-4">
            <PriceTag {...priceTagProps} />
          </div>

          <div className="py-2 md:pt-6 w-full md:mx-[-1.25rem] md:px-5">
            <Dropdown
              Button={
                <p className="font-Basic text-2xl tracking-tighter pb-6">
                  Token info
                </p>
              }
              Panel={
                <div className="text-tertiary text-sm px-0 md:pb-6">
                  <p className="py-1">
                    <span className="text-primary font-semibold">
                      Seller address:{" "}
                    </span>
                    {sellerAddress}
                  </p>
                  <p className="py-1">
                    <span className="text-primary font-semibold">
                      Token Contract:{" "}
                    </span>
                    {tokenContract}
                  </p>
                  <p className="py-1">
                    <span className="text-primary font-semibold">
                      Token ID:{" "}
                    </span>
                    {tokenId}
                  </p>
                </div>
              }
            />
            <Dropdown
              Button={
                <p className="font-Basic text-2xl tracking-tighter pb-8">
                  Available extras
                </p>
              }
              Panel={
                <div className="flex flex-nowrap items-center space-x-2 overflow-x-scroll px-0 md:pb-10 md:mx-[-1.25rem] md:px-5">
                  {items.map(({ id, name, image, price }) => (
                    <Tooltip
                      label={`${name} (+$${price})`}
                      position="center"
                      fitWidth
                    >
                      <div className="tooltip tooltip-bottom text-tertiary cursor-pointer hover:opacity-80">
                        <img
                          key={id}
                          src={image}
                          className="object-cover rounded-lg w-14 h-14 min-w-[3.5rem]"
                        />
                      </div>
                    </Tooltip>
                  ))}
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { ListingTemplate };
