import Link from "next/link";
import React, { FC } from "react";
import { MdPlaylistAdd } from "react-icons/md";
import { ListingEntity } from "../../types";
import { PriceLabel } from "./PriceLabel";

interface Props {
  listings?: ListingEntity[];
}

const Listings: FC<Props> = ({ listings }) => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row items-baseline">
        <h1 className="font-Basic tracking-tight text-3xl text-primary pl-4 md:pl-20 pr-2">
          My Listings
        </h1>
        <p className="text-gray-300">({listings?.length || 0})</p>
      </div>

      <div className="flex w-auto space-x-4 md:space-x-6 flex-nowrap overflow-scroll px-4 md:px-20 pt-8 pb-10">
        <Link href="/listings/create">
          <div className="rounded-xl flex flex-col items-center h-56 md:h-80 min-w-[10rem] md:min-w-[15rem] justify-center cursor-pointer shadow-lg hover:animate-pulse hover:opacity-90 overflow-hidden group">
            <MdPlaylistAdd className="self-center text-gray-300 text-4xl group-hover:text-primary" />
          </div>
        </Link>

        {listings?.map(({ id, image, price }) => (
          <Link key={id} href={`/listings/${id}`}>
            <div className="relative flex flex-row justify-center h-56 md:h-80 w-full max-w-[10rem] md:max-w-[15rem] min-w-[10rem] md:min-w-[15rem] rounded-xl cursor-pointer shadow-xl hover:animate-pulse hover:opacity-90 overflow-hidden">
              <img src={image} className="h-full w-full object-cover" />
              <PriceLabel price={price} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export { Listings };
