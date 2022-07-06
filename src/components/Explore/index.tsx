import React, { FC, useEffect, useState } from "react";
import { CgCheck } from "react-icons/cg";
import { RiLoader4Line } from "react-icons/ri";
import { ListingEntity, SellerProfileEntity } from "../../types";
import { useListings } from "../../utils/useListings";
import { useSellers } from "../../utils/useSellers";
import { CompletedCheck } from "../CompletedCheck";
import { SearchBar } from "../SearchBar";
import { Results } from "./Results";

interface Props {}

const Explore: FC<Props> = () => {
  const [query, setQuery] = useState<string | null>(null);
  const [triggerSearch, setTriggerSearch] = useState<boolean>(false);
  const [type, setType] = useState<string>("SELLERS");
  const [results, setResults] = useState<
    SellerProfileEntity[] | ListingEntity[] | null
  >(null);

  const { sellers } = useSellers();
  const { listings } = useListings({ all: true });

  const queryHelperMessage =
    query === ""
      ? `Find ${type === "SELLERS" ? "sellers" : "listings"} by name.`
      : query
      ? !results?.length
        ? "No results found with that query."
        : `There ${results.length === 1 ? "is 1" : `are ${results.length}`} ${
            type === "SELLERS"
              ? `seller${results?.length !== 1 ? "s" : ""}`
              : `listing${results?.length !== 1 ? "s" : ""}`
          } in the marketplace. ${
            type === "SELLERS"
              ? `Click on ${
                  results?.length === 1 ? "their profile" : "any of them"
                } to browse their listings.`
              : `Check ${results?.length === 1 ? "it" : "them"} out!`
          }`
      : "Check these sellers out. We dare you.";

  // Trigger fetch when user stops typing
  useEffect(() => {
    if (!query || query === "") {
      setTriggerSearch(true);
    }
    if (query) {
      // Wait 2 seconds
      setTimeout(() => setTriggerSearch(true), 2000);
      setTriggerSearch(false);
    }
  }, [query]);

  // Update results on type selection & query change
  useEffect(() => {
    let filteredResults: SellerProfileEntity[] | ListingEntity[] | null = null;

    // Show all results of selected type
    if (!query || query === "") {
      filteredResults =
        type === "SELLERS" ? sellers : type === "LISTINGS" ? listings : null;
    } else {
      // Filter results by query

      // Sellers
      if (type === "SELLERS") {
        const filteredArr =
          sellers?.filter(({ name }) =>
            name.toLowerCase().includes(query.toLowerCase())
          ) || null;
        filteredResults = filteredArr;
      }

      // Listings
      if (type === "LISTINGS") {
        const filteredArr =
          listings?.filter(({ name }) =>
            name.toLowerCase().includes(query.toLowerCase())
          ) || null;

        filteredResults = filteredArr;
      }
    }

    setResults(filteredResults);
  }, [sellers, listings, type, triggerSearch, query]);

  const searchBarProps = { query, setQuery, setType };
  const resultsProps = { type, results, query };

  return (
    <div className="flex flex-col items-center w-full bg-white pb-10 md:pb-20">
      <div className="h-24 md:h-40 w-full bg-gray-100 animate-[pulse_5s_ease-in-out_infinite]"></div>
      <div className="flex flex-col items-center w-full mt-[-2rem] md:mt-[-2.5rem] px-4">
        <SearchBar {...searchBarProps} />
      </div>

      {/* Explore */}
      <div className="md:mt-[-2.5rem] w-full bg-white px-4 md:px-20">
        <div className="pt-[2.5rem]">
          {/* Query title and results info */}
          <div className="flex flex-col items-center min-h-[8rem]">
            <div className="flex flex-row justify-center items-center w-full">
              <h1 className="leading-[2.75rem] line-clamp-2 text-5xl font-Basic text-primary pt-0 md:pt-8 py-3 tracking-tight w-[90%] md:w-auto text-center">
                {query === ""
                  ? "What are you looking for?"
                  : query ?? "Featured"}
              </h1>
              {query && (
                <CompletedCheck
                  isCompleted={triggerSearch}
                  CustomCheck={
                    <CgCheck className="text-5xl ml-1 pointer-events-none text-gray-200 md:mt-8" />
                  }
                  CustomSpinner={
                    <RiLoader4Line className="text-4xl ml-3 mr-1 pointer-events-none text-gray-200 animate-spin-slow md:mt-8" />
                  }
                />
              )}
            </div>
            <div className="py-3 text-tertiary">{queryHelperMessage}</div>
          </div>

          {/* Results */}
          <Results {...resultsProps} />
        </div>
      </div>
    </div>
  );
};

export { Explore };
