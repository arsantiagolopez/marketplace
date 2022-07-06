import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import { getBalanceOfTokenById } from "../../../blockchain/ERC1155Token";
import { ListingEntity } from "../../../types";
import { PriceLabel } from "../../SellerDashboard/PriceLabel";

interface Props {
  listings: ListingEntity[];
}

const Listings: FC<Props> = ({ listings }) => {
  const [availableListings, setAvailableListings] = useState<
    ListingEntity[] | null
  >(null);

  // Make sure listings have at least one quantity
  const getAvailableListings = async () => {
    let updatedListings: ListingEntity[] = [];

    try {
      for await (const listing of listings) {
        const {
          token: { tokenId, seller },
        } = listing;
        const quantity = await getBalanceOfTokenById({
          id: tokenId,
          address: seller,
        });

        // Only include listings with more than 0 stock
        if (quantity) {
          updatedListings.push(listing);
        }
      }
    } catch {
      console.log("Could not fetch the balance of tokens.");
    }

    setAvailableListings(updatedListings);
  };

  useEffect(() => {
    getAvailableListings();
  }, [listings]);

  return availableListings ? (
    <div className="py-4 md:py-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
      {availableListings.map(
        ({ listingId, name, image, description, token: { prices } }) => (
          <Link key={listingId} href={`/listings/${listingId}`}>
            <div className="flex flex-col w-full text-primary hover:cursor-pointer group hover:animate-pulse">
              <div className="relative flex flex-row justify-center w-full h-52 md:h-80 aspect-square bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={image}
                  alt={name}
                  className="object-center object-cover w-full h-full group-hover:opacity-90"
                />
                <PriceLabel prices={prices} />
              </div>
              <div className="flex flex-col py-2">
                <h1 className="font-Basic text-xl font-bold tracking-tight capitalize line-clamp-2 leading-6 py-1">
                  {name}
                </h1>
                <p className="text-tertiary leading-6 line-clamp-2">
                  {description}
                </p>
              </div>
            </div>
          </Link>
        )
      )}
    </div>
  ) : (
    <div className="py-4 md:py-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="w-full hover:cursor-pointer">
            <div className="w-full h-52 md:h-80 aspect-square bg-gray-100 rounded-lg shadow-lg animate-pulse"></div>
          </div>
        ))}
    </div>
  );
};

export { Listings };
