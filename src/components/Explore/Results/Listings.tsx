import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import { getBalanceOfTokenById } from "../../../blockchain";
import { ListingEntity } from "../../../types";
import { PriceLabel } from "../../SellerDashboard/PriceLabel";

interface Props {
  listings: ListingEntity[];
}

const Listings: FC<Props> = ({ listings }) => {
  const [availableListing, setAvailableListings] = useState<
    ListingEntity[] | null
  >(null);

  // Make sure listings have at least one quantity
  const getAvailableListings = async () => {
    let updatedListings: ListingEntity[] = [];

    for await (const listing of listings) {
      const {
        token: { tokenId, seller },
      } = listing;
      const quantity = await getBalanceOfTokenById({
        id: tokenId,
        address: seller,
      });

      // Only include listings with more than 0
      if (quantity) {
        updatedListings.push(listing);
      }
    }

    setAvailableListings(updatedListings);
  };

  useEffect(() => {
    getAvailableListings();
  }, []);

  return (
    <div className="py-4 md:py-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
      {availableListing?.map(
        ({ listingId, name, image, description, token: { price } }) => (
          <Link key={listingId} href={`/listings/${listingId}`}>
            <div className="flex flex-col w-full text-primary hover:cursor-pointer group hover:animate-pulse">
              <div className="relative flex flex-row justify-center w-full h-52 md:h-80 aspect-square bg-white rounded-lg shadow-lg overflow-hidden">
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
            </div>
          </Link>
        )
      )}
    </div>
  );
};

export { Listings };
