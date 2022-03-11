import React from "react";
import { CartItem } from "../types";

interface ContextState {
  cartCount: number;
  cartItems: CartItem[];
  addToCart: (cartItem: Partial<CartItem>) => void;
  cleanCart: () => void;
}

const CartContext = React.createContext<ContextState>({
  cartCount: 0,
  cartItems: [],
  addToCart: () => {},
  cleanCart: () => {},
});

export { CartContext };
