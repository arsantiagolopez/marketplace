import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { getBalanceOfTokenById } from "../../blockchain/ERC1155Token";
import { ListingEntity, SellerProfileEntity } from "../../types";
import { useListings } from "../../utils/useListings";
import { PriceLabel } from "../SellerDashboard/PriceLabel";

interface Props {
  sellerProfile?: SellerProfileEntity;
}

const SellerTemplate: FC<Props> = ({ sellerProfile }) => {
  const [sellerListings, setSellerListings] = useState<ListingEntity[] | null>(
    null
  );

  const { name, image, address } = sellerProfile || {};

  const { listings: allListings } = useListings({ all: true });

  // Only show available listings
  const fetchTokenBalances = async (listings: ListingEntity[]) => {
    let availableListings: ListingEntity[] = [];

    try {
      for await (const listing of listings) {
        const {
          token: { tokenId },
        } = listing;
        const isAvailable = await getBalanceOfTokenById({
          id: tokenId,
          address,
        });
        if (isAvailable) {
          availableListings.push(listing);
        }
      }
    } catch {
      console.log("Could not fetch the balance of tokens.");
    }

    setSellerListings(availableListings);
  };

  useEffect(() => {
    if (allListings) {
      const filteredListings = allListings.filter(
        ({ token: { seller } }) => seller === address
      );
      fetchTokenBalances(filteredListings);
    }
  }, [allListings, sellerProfile]);

  return (
    <div className="flex flex-col w-full h-full bg-white pb-20">
      <div className="h-40 md:h-40 w-full bg-gray-100 animate-[pulse_5s_ease-in-out_infinite]"></div>

      {/* Profile */}
      <div className="flex flex-col items-center px-4 md:px-20">
        <div
          className={`z-40 rounded-full bg-white w-40 h-40 mt-[-5rem] ${
            !image && "bg-gray-200 animate-pulse"
          }`}
        >
          {image && (
            <img
              src={image}
              className="h-full aspect-square rounded-full object-cover shadow-md cursor-pointer"
            />
          )}
        </div>

        {name ? (
          <h1 className="flex flex-row items-center text-4xl md:text-5xl font-Basic text-primary pt-4 md:pt-7 tracking-tight">
            {name}
            <IoIosCheckmarkCircle className="text-blue-500 ml-2 mr-[-1rem]" />
          </h1>
        ) : (
          <div className="h-11 mb-4 w-56 bg-gray-200 rounded-md animate-pulse shadow-xl mt-4 md:mt-7"></div>
        )}
        {address ? (
          <div className="py-2 md:py-4 text-tertiary truncate max-w-full">
            {address}
          </div>
        ) : (
          <div className="h-6 mb-4 w-96 bg-gray-200 rounded-md animate-pulse shadow-xl my-2 md:my-2"></div>
        )}
      </div>

      {/* Listings */}
      <div className="w-full bg-white px-4 md:px-20 py-6 md:py-0">
        {
          // Skeleton cards
          !sellerListings ? (
            <div className="py-4 md:py-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="w-full hover:cursor-pointer">
                    <div className="w-full h-52 md:h-80 aspect-square bg-gray-100 rounded-lg shadow-lg animate-pulse"></div>
                  </div>
                ))}
            </div>
          ) : (
            // Listing cards
            <div className="py-4 md:py-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
              {sellerListings?.map(
                ({
                  listingId,
                  name,
                  image,
                  description,
                  token: { prices },
                }) => (
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
          )
        }
      </div>
    </div>
  );
};

export { SellerTemplate };
