import Link from "next/link";
import React, { FC } from "react";
import { IoMdAdd } from "react-icons/io";
import { ItemEntity } from "../../types";

interface Props {
  items?: ItemEntity[];
}

const Items: FC<Props> = ({ items }) => {
  const itemsCount = items?.length || 0;
  return (
    <div className="flex-auto min-w-full md:min-w-0 md:w-[40%]">
      <div className="flex flex-row items-baseline">
        <h1 className="font-Basic tracking-tight text-3xl pl-4 md:pl-20 pr-2">
          Items
        </h1>
        <p className="text-gray-300">({itemsCount})</p>
      </div>

      <div className="grid grid-cols-3 gap-3 md:gap-6 min-h-[32rem] max-h-[32rem] overflow-scroll p-4 md:p-6 md:ml-20 my-8 mx-4 md:mx-0 bg-primary rounded-xl">
        <Link href="/items/create">
          <div className="flex items-center justify-center rounded-lg aspect-square w-full cursor-pointer shadow-lg hover:animate-pulse opacity-90 overflow-hidden bg-white group">
            <IoMdAdd className="text-gray-300 text-3xl group-hover:text-primary" />
          </div>
        </Link>

        {items?.map(({ id, image }) => (
          <div
            key={id}
            className="rounded-lg aspect-square w-full cursor-pointer shadow-lg hover:animate-pulse opacity-90 overflow-hidden"
          >
            <img src={image} className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export { Items };
