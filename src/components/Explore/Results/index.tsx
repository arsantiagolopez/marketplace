import React, { FC } from "react";
import { ListingEntity, SellerProfileEntity } from "../../../types";
import { Listings } from "./Listings";
import { Sellers } from "./Sellers";

interface Props {
  type: string;
  results: SellerProfileEntity[] | ListingEntity[] | null;
  query: string | null;
}

const Results: FC<Props> = ({ type, results, query }) => {
  const noSellersMessage = !query
    ? "No sellers registered in the Marketplace. Register to be the first one!"
    : `No sellers with the name "${query}"`;
  const noListingsMessage =
    "No items have been listed yet. Want to be the first? List your own!";

  const sellersProps = { sellers: results as SellerProfileEntity[] };
  const listingsProps = { listings: results as ListingEntity[] };

  if (!results) {
    // Loading: Show skeleton cards
    return (
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
  } else if (results && !results.length) {
    // No results: Show custom message
    return (
      <div className="flex flex-row items-center justify-center h-60 w-full text-tertiary text-center">
        {type === "SELLERS" ? (
          <p>{noSellersMessage}</p>
        ) : type === "LISTINGS" ? (
          <p>{noListingsMessage}</p>
        ) : null}
      </div>
    );
  } else {
    // Some results: Show Sellers or Listings
    if (
      type === "SELLERS" &&
      typeof (results[0] as SellerProfileEntity).id === "string"
    ) {
      return <Sellers {...sellersProps} />;
    }
    if (
      type === "LISTINGS" &&
      typeof (results[0] as ListingEntity).listingId === "number"
    ) {
      return <Listings {...listingsProps} />;
    }

    return <></>;
  }
};

export { Results };
