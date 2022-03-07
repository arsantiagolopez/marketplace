import moment from "moment";
import Link from "next/link";
import React, { FC } from "react";
import { SellerProfileEntity } from "../../../types";

interface Props {
  sellers: SellerProfileEntity[];
}

const Sellers: FC<Props> = ({ sellers }) => (
  <div className="py-4 md:py-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
    {sellers.map(({ id, name, image, createdAt, address }) => (
      <Link key={id} href={`/sellers/${address}`}>
        <div className="flex flex-col w-full text-primary hover:cursor-pointer group hover:animate-pulse">
          <div className="w-full h-52 md:h-80 aspect-square bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={image}
              alt={name}
              className="object-center object-cover w-full h-full group-hover:opacity-90"
            />
          </div>
          <div className="flex flex-col py-2">
            <h1 className="font-Basic text-xl font-bold tracking-tight capitalize">
              {name}
            </h1>
            <p className="text-tertiary">
              Joined {moment(createdAt).fromNow()}
            </p>
          </div>
        </div>
      </Link>
    ))}
  </div>
);

export { Sellers };
