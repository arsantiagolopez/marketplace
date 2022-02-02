import React, { FC } from "react";
import { CompletedCheck } from "../CompletedCheck";

interface Listing {
  id: number;
  image: string;
  price: number;
}

interface Props {
  listings: Listing[];
}

const Orders: FC<Props> = ({ listings }) => {
  return (
    <div className="flex-auto min-w-full md:min-w-0 md:w-[60%] transition-all ease-in-out">
      <div className="flex flex-row items-baseline">
        <h1 className="font-Basic text-primary tracking-tight text-3xl pl-4 md:pl-20 pr-2">
          Orders
        </h1>
        <p className="text-gray-300">(25)</p>
      </div>

      <div className="flex flex-col space-y-3 min-h-[32rem] max-h-[32rem] overflow-scroll mx-4 md:mx-20 my-8 text-secondary">
        {listings.map(({ id, image }) => (
          <div
            key={id}
            className="flex flex-row items-center w-full hover:bg-gray-50 rounded-xl"
          >
            <div
              key={id}
              className="rounded-lg aspect-square w-24 h-24 min-h-[6rem] min-w-[6rem] overflow-hidden shadow-lg"
            >
              <img src={image} className="h-full w-full object-cover" />
            </div>
            <div className="hidden md:flex flex-row justify-between w-full space-x-3 md:space-x-6 ml-10 mr-6">
              <p>Blue sticky claws</p>
              <p>Sold for $25</p>
              <p>Sold to Richard (0x74A...fc076)</p>
              <div className="flex flex-row">
                <p>Completed</p>
                <CompletedCheck isCompleted={true} />
              </div>
            </div>
            <div className="inline-block md:hidden ml-4 mr-2">
              <p>
                {"Blue sticky claws"} {"sold to"} {"Richard (0x74A...fc076)"}{" "}
                {"for $25"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { Orders };
