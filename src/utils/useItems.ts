import { useEffect, useState } from "react";
import { getMyItems } from "../blockchain";
import { ItemEntity } from "../types";

const useItems = () => {
  const [items, setItems] = useState<ItemEntity[]>([]);

  // Fetch items from contract
  const fetchItems = async () => {
    const itemsArray = await getMyItems();
    setItems(itemsArray);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return { items, setItems };
};

export { useItems };
