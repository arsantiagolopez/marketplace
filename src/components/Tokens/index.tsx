import { useRouter } from "next/router";
import React, { FC } from "react";
import { ItemEntity } from "../../types";

interface Props {
  tokens?: ItemEntity[];
}

const Tokens: FC<Props> = ({ tokens }) => {
  const { query } = useRouter();

  console.log(query);

  console.log(tokens);

  const results: any[] = [
    {
      id: 1,
      type: "SELLER",
      store: "Test Store",
      image:
        "https://images.pexels.com/photos/2670273/pexels-photo-2670273.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    },
    {
      id: 2,
      type: "SELLER",
      store: "Margarita Store",
      image:
        "https://images.pexels.com/photos/3410816/pexels-photo-3410816.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    },
    {
      id: 3,
      type: "SELLER",
      store: "Goku Sentai",
      image:
        "https://images.pexels.com/photos/2607108/pexels-photo-2607108.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    },
    {
      id: 4,
      type: "SELLER",
      store: "Photographer",
      image:
        "https://images.pexels.com/photos/5022807/pexels-photo-5022807.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    },
    {
      id: 5,
      type: "SELLER",
      store: "Photographer",
      image:
        "https://images.pexels.com/photos/5022807/pexels-photo-5022807.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    },
  ];

  return (
    <div className="flex flex-col items-center w-full bg-white pb-20">
      <div className="h-24 md:h-40 w-full bg-gray-100 animate-[pulse_5s_ease-in-out_infinite]"></div>

      <div className="z-10 flex flex-row items-center px-4 md:px-20 h-16 mt-[-4.75em] md:mt-[-6rem] w-full">
        <h1 className="text-5xl md:text-5xl font-Basic text-primary tracking-tighter">
          My Tokens
        </h1>
      </div>

      <div className="pt-[4rem] md:mt-[4rem] w-full bg-white grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 px-4 md:px-20">
        {results.map(({ id, type, store, image }) => (
          <div
            key={id}
            className="flex flex-col w-full text-primary hover:cursor-pointer group hover:animate-pulse"
          >
            <div className="w-full h-52 md:h-80 aspect-square bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={image}
                alt="photo"
                className="object-center object-cover w-full h-full group-hover:opacity-90"
              />
            </div>
            <div className="flex flex-col py-2">
              <h1 className="font-Basic text-xl font-bold tracking-tight">
                {store}
              </h1>
              <p className="text-tertiary">5 items</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { Tokens };
