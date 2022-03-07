import React, { FC, ReactNode, useEffect, useState } from "react";
import { ListingEntity } from "../types";
import { CartContext } from "./CartContext";

interface Props {
  children: ReactNode;
}

const CartProvider: FC<Props> = ({ children }) => {
  const [cartCount, setCartCount] = useState<number>(0);
  const [cartListings, setCartListings] = useState<ListingEntity[]>([]);

  const addToCart = (listing: ListingEntity) => {
    setCartListings([...cartListings, listing]);
    setCartCount(cartListings.length + 1);
  };

  const cleanCart = () => {
    setCartListings([]);
    setCartCount(0);
  };

  useEffect(() => {
    setCartCount(0);
    setCartListings([]);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartCount,
        addToCart,
        cartListings,
        cleanCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export { CartProvider };
