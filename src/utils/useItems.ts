import { useEffect, useState } from "react";
import { getMyItems } from "../blockchain";
import { ItemEntity } from "../types";

const useItems = () => {
  const [items, setItems] = useState<ItemEntity[]>([]);

  // Fetch items from contract
  const fetchItems = async () => {
    try {
      const itemsArray = await getMyItems();
      setItems(itemsArray);
    } catch {
      console.log("Could not fetch your items.");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return { items, setItems };
};

export { useItems };
