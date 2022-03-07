import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getMyListings } from "../blockchain";
import { getAllListings } from "../blockchain/Marketplace/getAllListings";
import { ListingEntity } from "../types";

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

  const pushInactiveToEnd = (arr: ListingEntity[]): ListingEntity[] => {
    const active = arr.filter(({ isActive }) => isActive);
    const inactive = arr.filter(({ isActive }) => !isActive);
    return [...active, ...inactive];
  };

  // Fetch my created listings from contract
  const fetchMyListings = async () => {
    let listingsArray = await getMyListings();

    // Push inactive listings to end
    listingsArray = pushInactiveToEnd(listingsArray);

    setListings(listingsArray);
  };

  const fetchAllListings = async () => {
    let listingsArray = await getAllListings();
    setListings(listingsArray);
  };

  useEffect(() => {
    if (all) {
      fetchAllListings();
    } else {
      fetchMyListings();
    }
  }, []);

  return { listings, setListings };
};

export { useListings };
