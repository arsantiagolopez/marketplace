import React, { FC, useEffect, useState } from "react";
import { CgCheck } from "react-icons/cg";
import { RiLoader4Line } from "react-icons/ri";
import { CompletedCheck } from "../CompletedCheck";
import { SearchBar } from "../SearchBar";

interface Props {}

interface Result {
  id: number;
  type: string;
  store: string;
  image: string;
}

const Marketplace: FC<Props> = () => {
  const [query, setQuery] = useState<string | null>(null);
  const [triggerSearch, setTriggerSearch] = useState<boolean>(false);

  const results: Result[] = [
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

  // Trigger fetch when user stops typing
  useEffect(() => {
    if (query) {
      // Wait 2 seconds
      setTimeout(() => setTriggerSearch(true), 2000);
      setTriggerSearch(false);
    }
  }, [query]);

  const searchBarProps = { query, setQuery };

  return (
    <div className="flex flex-col items-center w-full bg-white pb-20">
      <div className="h-24 md:h-40 w-full bg-gray-100 animate-[pulse_5s_ease-in-out_infinite]"></div>
      <div className="flex flex-col items-center w-full mt-[-2rem] md:mt-[-2.5rem] px-4">
        <SearchBar {...searchBarProps} />
      </div>
      {/* Marketplace */}
      <div className="md:mt-[-2.5rem] w-full bg-white px-4 md:px-[10%]">
        <div className="pt-[2.5rem]">
          {/* Query title and results info */}
          <div className="flex flex-col items-center min-h-[8rem]">
            <div className="flex flex-row justify-center items-end w-full">
              <h1 className="text-5xl font-Basic text-primary pt-8 tracking-tight">
                {query === "" ? "What you looking for?" : query ?? "Featured"}
              </h1>
              {query && (
                <CompletedCheck
                  isCompleted={triggerSearch}
                  CustomCheck={
                    <CgCheck className="text-5xl ml-1 pointer-events-none text-gray-200" />
                  }
                  CustomSpinner={
                    <RiLoader4Line className="text-4xl ml-3 mr-1 pointer-events-none text-gray-200 animate-spin-slow" />
                  }
                />
              )}
            </div>
            <div className="py-3 text-tertiary">
              {query === ""
                ? "Come on, don't be shy."
                : query
                ? "There are {5} sellers. Click on any of them to browse their calendar."
                : "Try any of these. We dare you."}
            </div>
          </div>

          {/* Results */}
          <div className="py-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
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
      </div>
    </div>
  );
};

export { Marketplace };
