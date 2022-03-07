import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import { getBalanceOfTokenById } from "../../blockchain";
import { getMyOwnedTokens } from "../../blockchain/Marketplace/getMyOwnedTokens";
import { ListingEntity } from "../../types";
import { PriceLabel } from "../SellerDashboard/PriceLabel";

interface Props {}

interface ListingCard {
  listing: ListingEntity;
  quantity: number;
}

const Tokens: FC<Props> = () => {
  const [cards, setCards] = useState<ListingCard[] | null>(null);
  const [listings, setListings] = useState<ListingEntity[] | null>(null);

  const fetchMyTokens = async () => {
    const tokens = await getMyOwnedTokens();
    setListings(tokens);
  };

  const updateCardsWithQuantities = async () => {
    if (listings) {
      // No listings
      if (listings.length === 0) {
        setCards(null);
      }

      // Bundle up listings with their quantities
      if (listings.length) {
        let listingCards: ListingCard[] = [];

        for await (const listing of listings) {
          const {
            token: { tokenId },
          } = listing;
          const quantity = await getBalanceOfTokenById({ id: tokenId });
          listingCards.push({ listing, quantity });
        }

        setCards(listingCards);
      }
    }
  };

  // Get token quantity
  useEffect(() => {
    fetchMyTokens();
  }, []);

  // Get quantity of listings
  useEffect(() => {
    updateCardsWithQuantities();
  }, [listings]);

  return (
    <div className="flex flex-col items-center w-full bg-white pb-20">
      <div className="h-24 md:h-40 w-full bg-gray-100 animate-[pulse_5s_ease-in-out_infinite]"></div>

      <div className="z-10 flex flex-row items-center px-4 md:px-20 h-16 mt-[-4.75em] md:mt-[-6rem] w-full">
        <h1 className="text-5xl md:text-5xl font-Basic text-primary tracking-tighter">
          My Tokens
        </h1>
      </div>

      <div className="pt-[4rem] md:mt-[4rem] w-full bg-white grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6 px-4 md:px-20">
        {cards?.map(
          ({
            listing: {
              listingId,
              name,
              image,
              description,
              token: { price },
            },
            quantity,
          }) => (
            <Link key={listingId} href={`/tokens/${listingId}`}>
              <div className="relative flex flex-col w-full text-primary hover:cursor-pointer group hover:animate-pulse">
                {/* Card quantity multiplier */}
                {quantity > 1 && (
                  <div className="z-30 absolute top-4 right-2 flex items-center justify-center h-8 w-8 md:h-10 md:w-10 font-Basic text-xl md:text-2xl text-white tracking-tight rounded-full bg-primary">
                    x{quantity}
                  </div>
                )}

                {/* Top card */}
                <div className="z-20 relative flex flex-row justify-center w-full h-52 md:h-80 aspect-square bg-white rounded-lg shadow-lg overflow-hidden">
                  <img
                    src={image}
                    alt={name}
                    className="object-center object-cover w-full h-full group-hover:opacity-90"
                  />
                  <PriceLabel price={price} />
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

                {/* Card overlap effect */}
                {quantity > 1 && (
                  <div className="z-10 absolute top-[0.35rem] right-[-0.35rem] w-full h-52 md:h-80 aspect-square rounded-lg shadow-lg overflow-hidden rotate-1">
                    <img
                      src={image}
                      alt={name}
                      className="object-center object-cover w-full h-full group-hover:opacity-90"
                    />
                  </div>
                )}
                {quantity > 2 && (
                  <div className="absolute top-[0.75rem] right-[-0.75rem] w-full h-52 md:h-80 aspect-square rounded-lg shadow-lg overflow-hidden rotate-2">
                    <img
                      src={image}
                      alt={name}
                      className="object-center object-cover w-full h-full group-hover:opacity-90"
                    />
                  </div>
                )}
              </div>
            </Link>
          )
        )}
      </div>
    </div>
  );
};

export { Tokens };
