import React from "react";
import { ListingEntity } from "../types";

interface ContextState {
  cartCount: number;
  cartListings: ListingEntity[];
  addToCart: (listing: ListingEntity) => void;
  cleanCart: () => void;
}

const CartContext = React.createContext<ContextState>({
  cartCount: 0,
  cartListings: [],
  addToCart: () => {},
  cleanCart: () => {},
});

export { CartContext };
