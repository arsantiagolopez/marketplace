import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getAllListings, getMyListings } from "../blockchain/Marketplace";
import { ListingEntity } from "../types";
import { useEthPrice } from "./useEthPrice";

interface Props {
  /* Get all Marketplace listings (defaults to own listings) */
  all?: boolean;
}

interface Response {
  listings: ListingEntity[] | null;
  setListings: Dispatch<SetStateAction<ListingEntity[] | null>>;
}

const useListings = ({ all }: Props = {}): Response => {
  const [listings, setListings] = useState<ListingEntity[] | null>(null);

  const { ethRate } = useEthPrice();

  const pushInactiveToEnd = (arr: ListingEntity[]): ListingEntity[] => {
    const active = arr.filter(({ isActive }) => isActive);
    const inactive = arr.filter(({ isActive }) => !isActive);
    return [...active, ...inactive];
  };

  // Fetch my created listings from contract
  const fetchMyListings = async (rate: string) => {
    try {
      let listingsArray = await getMyListings(rate);

      // Push inactive listings to end
      listingsArray = pushInactiveToEnd(listingsArray);

      setListings(listingsArray);
    } catch {
      console.log("Could not fetch your listings.");
    }
  };

  // Fetch all existing listings in the Marketplace
  const fetchAllListings = async (rate: string) => {
    try {
      let listingsArray = await getAllListings(rate);
      setListings(listingsArray);
    } catch {
      console.log("Could not fetch all listings.");
    }
  };

  useEffect(() => {
    if (ethRate) {
      if (all) {
        fetchAllListings(ethRate);
      } else {
        fetchMyListings(ethRate);
      }
    }
  }, [ethRate]);

  return { listings, setListings };
};

export { useListings };
