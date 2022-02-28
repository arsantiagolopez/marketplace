import { useEffect, useState } from "react";
import { getMyListings } from "../blockchain";
import { ListingEntity } from "../types";

const useListings = () => {
  const [listings, setListings] = useState<ListingEntity[]>([]);

  // Fetch listings from contract
  const fetchListings = async () => {
    const listingsArray = await getMyListings();
    setListings(listingsArray);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return { listings, setListings };
};

export { useListings };
