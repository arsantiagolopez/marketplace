import { useEffect, useState } from "react";
import { getMyItems } from "../blockchain/Marketplace";
import { ItemEntity } from "../types";
import { useEthPrice } from "./useEthPrice";

const useItems = () => {
  const [items, setItems] = useState<ItemEntity[]>([]);

  const { ethRate } = useEthPrice();

  // Fetch items from contract
  const fetchItems = async (rate: string) => {
    try {
      const itemsArray = await getMyItems(rate);
      setItems(itemsArray);
    } catch {
      console.log("Could not fetch your items.");
    }
  };

  useEffect(() => {
    if (ethRate) {
      fetchItems(ethRate);
    }
  }, [ethRate]);

  return { items, setItems };
};

export { useItems };
