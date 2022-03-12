import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getMyListings } from "../blockchain";
import { getAllListings } from "../blockchain/Marketplace/getAllListings";
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
  const fetchMyListings = async () => {
    try {
      if (ethRate) {
        let listingsArray = await getMyListings(ethRate);

        // Push inactive listings to end
        listingsArray = pushInactiveToEnd(listingsArray);

        setListings(listingsArray);
      }
    } catch {
      console.log("Could not fetch your items.");
    }
  };

  // Fetch all existing listings in the Marketplace
  const fetchAllListings = async () => {
    try {
      if (ethRate) {
        let listingsArray = await getAllListings(ethRate);
        setListings(listingsArray);
      }
    } catch {
      console.log("Could not fetch your listings.");
    }
  };

  useEffect(() => {
    if (all) {
      fetchAllListings();
    } else {
      fetchMyListings();
    }
  }, [ethRate]);

  return { listings, setListings };
};

export { useListings };
