import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getAllSellers } from "../blockchain";
import { SellerProfileEntity } from "../types";

interface Response {
  sellers: SellerProfileEntity[] | null;
  setSellers: Dispatch<SetStateAction<SellerProfileEntity[] | null>>;
}

const useSellers = (): Response => {
  const [sellers, setSellers] = useState<SellerProfileEntity[] | null>(null);

  // Get seller profile from DB
  const getSellerProfiles = async (
    addresses: string[]
  ): Promise<SellerProfileEntity[] | null> => {
    let sellerProfiles: SellerProfileEntity[] | null = null;

    try {
      for (const address of addresses) {
        const { data } = await axios.get(`/api/sellers/${address}`);

        if (data && !sellerProfiles) {
          sellerProfiles = [];
        }

        sellerProfiles?.push(data);
      }
    } catch {
      console.log("Could not fetch seller profiles.");
    }

    return sellerProfiles;
  };

  // Fetch sellers from contract
  const fetchSellers = async () => {
    try {
      let addresses = await getAllSellers();

      if (addresses) {
        const sellerProfiles = await getSellerProfiles(addresses);
        setSellers(sellerProfiles);
      }
    } catch {
      console.log("Could not fetch sellers.");
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  return { sellers, setSellers };
};

export { useSellers };
