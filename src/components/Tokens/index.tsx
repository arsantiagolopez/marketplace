import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import { getMyOwnedTokens } from "../../blockchain/Marketplace";
import { ItemEntity, ListingEntity } from "../../types";
import { useEthPrice } from "../../utils/useEthPrice";
import { PriceLabel } from "../SellerDashboard/PriceLabel";

interface Props {}

const Tokens: FC<Props> = () => {
  const [tokens, setTokens] = useState<(ListingEntity | ItemEntity)[] | null>(
    null
  );
  const [listings, setListings] = useState<ListingEntity[] | null>(null);
  const [items, setItems] = useState<ItemEntity[] | null>(null);

  const { ethRate } = useEthPrice();

  const fetchMyTokens = async (rate: string) => {
    try {
      const myTokens = await getMyOwnedTokens(rate);
      setTokens(myTokens);
    } catch {
      console.log("Could not fetch your owned tokens.");
    }
  };

  // Update listings and items state arrays
  const categorizeTokens = async () => {
    if (tokens) {
      let listingsArr: ListingEntity[] = [];
      let itemsArr: ItemEntity[] = [];

      tokens.map((token) => {
        // Token is listing
        if ("listingId" in token) {
          return listingsArr.push(token as ListingEntity);
        }

        // Token is item
        if ("itemId" in token) {
          return itemsArr.push(token as ItemEntity);
        }
      });

      setListings(listingsArr);
      setItems(itemsArr);
    }
  };

  // Get token quantity
  useEffect(() => {
    if (ethRate) {
      fetchMyTokens(ethRate);
    }
  }, [ethRate]);

  // Categorize tokens by listings or items
  useEffect(() => {
    if (tokens) {
      categorizeTokens();
    }
  }, [tokens]);

  return (
    <div className="flex flex-col items-center w-full bg-white pb-20">
      <div className="h-24 md:h-40 w-full bg-gray-100 animate-[pulse_5s_ease-in-out_infinite]"></div>

      <div className="z-10 flex flex-row items-center px-4 md:px-20 h-16 mt-[-4.75em] md:mt-[-6rem] w-full">
        <h1 className="text-5xl md:text-5xl font-Basic text-primary tracking-tighter">
          My Tokens
        </h1>
      </div>

      {/* Listings */}
      <div className="pt-[2rem] md:pt-[4rem] px-4 md:px-20 w-full">
        <h1 className="text-3xl md:text-4xl font-Basic text-primary tracking-tighter py-6 md:py-12">
          Listings
        </h1>

        {listings ? (
          <div className="w-full bg-white grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
            {listings.map(
              (
                { listingId, name, image, description, token: { prices } },
                index
              ) => (
                <Link key={index} href={`/tokens/${listingId}`}>
                  <div className="relative flex flex-col w-full text-primary hover:cursor-pointer group hover:animate-pulse">
                    <div className="z-20 relative flex flex-row justify-center w-full h-52 md:h-80 aspect-square bg-white rounded-lg shadow-lg overflow-hidden">
                      <img
                        src={image}
                        alt={name}
                        className="object-center object-cover w-full h-full group-hover:opacity-90"
                      />
                      <PriceLabel prices={prices} />
                    </div>
                    <div className="flex flex-col py-2">
                      <h1 className="font-Basic text-xl font-bold tracking-tight capitalize">
                        {name}
                      </h1>
                      {/* Tailwind multiline truncate fix */}
                      <p className="text-tertiary leading-6 max-h-[3rem] ellipsis overflow-hidden">
                        {description}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="w-full hover:cursor-pointer">
                  <div className="w-full h-52 md:h-80 aspect-square bg-gray-100 rounded-lg shadow-lg animate-pulse"></div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Extras */}
      <div className="py-[2rem] md:py-[3rem] px-4 md:px-20 w-full">
        <h1 className="text-3xl md:text-4xl font-Basic text-primary tracking-tighter py-6 md:py-12">
          Extras
        </h1>

        {items ? (
          <div className="w-full bg-white grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
            {items.map(({ name, image, token: { prices } }, index) => (
              <div
                key={index}
                className="relative flex flex-col w-full text-primary group"
              >
                <div className="z-20 relative flex flex-row justify-center w-full h-52 md:h-80 aspect-square bg-white rounded-lg shadow-lg overflow-hidden">
                  <img
                    src={image}
                    alt={name}
                    className="object-center object-cover w-full h-full group-hover:opacity-90"
                  />
                  <PriceLabel prices={prices} />
                </div>
                <div className="flex flex-col py-2">
                  <h1 className="font-Basic text-xl font-bold tracking-tight capitalize">
                    {name}
                  </h1>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="w-full">
                  <div className="w-full h-52 md:h-80 aspect-square bg-gray-100 rounded-lg shadow-lg animate-pulse"></div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export { Tokens };
