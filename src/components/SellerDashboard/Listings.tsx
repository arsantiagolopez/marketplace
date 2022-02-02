import Link from "next/link";
import React, { FC } from "react";
import { MdPlaylistAdd } from "react-icons/md";

interface Listing {
  id: number;
  image: string;
  price: number;
}

// @todo - Switch to ListingEntity after testing

interface Props {
  listings: Listing[];
}

const Listings: FC<Props> = ({ listings }) => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row items-baseline">
        <h1 className="font-Basic tracking-tight text-3xl text-primary pl-4 md:pl-20 pr-2">
          My Listings
        </h1>
        <p className="text-gray-300">(25)</p>
      </div>

      <div className="flex w-auto space-x-4 md:space-x-6 flex-nowrap overflow-scroll px-4 md:px-20 pt-8 pb-10">
        <Link href="/listings/create">
          <div className="rounded-xl flex flex-col items-center h-56 md:h-80 min-w-[10rem] md:min-w-[15rem] justify-center cursor-pointer shadow-xl hover:animate-pulse hover:opacity-90 overflow-hidden group">
            <MdPlaylistAdd className="self-center text-gray-300 text-4xl group-hover:text-primary" />
          </div>
        </Link>

        {listings.map(({ id, image, price }) => (
          <Link key={id} href={`/listings/${id}`}>
            <div className="relative rounded-xl flex flex-row h-56 md:h-80 min-w-[10rem] md:min-w-[15rem] justify-center cursor-pointer shadow-xl hover:animate-pulse hover:opacity-90 overflow-hidden">
              <img src={image} className="h-full w-full object-cover" />
              <div className="absolute self-end w-full flex justify-center items-center p-3 md:p-8">
                <div className=" bg-white rounded-full p-1 px-6 w-fit shadow-3xl">
                  <p className="text-primary font-Basic">${price}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export { Listings };
