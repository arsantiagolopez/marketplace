import React, { FC, ReactNode, useEffect, useState } from "react";
import { CartItem } from "../types";
import { CartContext } from "./CartContext";

interface Props {
  children: ReactNode;
}

const CartProvider: FC<Props> = ({ children }) => {
  const [cartCount, setCartCount] = useState<number>(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [uniqueCartItems, setUniqueCartItems] = useState<CartItem[]>([]);

  const addToCart = (cartItem: Partial<CartItem>) => {
    const isItemInCart = uniqueCartItems.find(({ listing, items }) => {
      // Check if same listing
      if (listing.listingId === cartItem.listing?.listingId) {
        // Check if has same items
        items = items?.sort();
        if (String(cartItem.items?.sort()) === String(items)) {
          // Same listing & same items
          return true;
        }
      }
    });

    if (isItemInCart) {
      // Update unique items state
      const updatedItem = {
        ...isItemInCart,
        quantity: isItemInCart.quantity! + 1,
      } as CartItem;
      const otherUniqueItems = uniqueCartItems.filter(
        ({ id }) => id !== isItemInCart.id
      );
      setUniqueCartItems([...otherUniqueItems, updatedItem as CartItem]);

      // Update cart items state
      const otherCartItems = cartItems.filter(
        ({ id }) => id !== isItemInCart.id
      );
      setCartItems([...otherCartItems, updatedItem as CartItem]);
    } else {
      cartItem = {
        ...cartItem,
        id: cartItems.length,
        quantity: 1,
      } as CartItem;

      // Keep track of unique items
      setUniqueCartItems([...uniqueCartItems, cartItem as CartItem]);
      // Add to cart
      setCartItems([...cartItems, cartItem as CartItem]);
    }

    const updatedCartCount = cartItems.reduce((acc, item) => {
      const { quantity } = item;
      return acc + quantity!;
    }, 0);

    setCartCount(updatedCartCount + 1);
  };

  const cleanCart = () => {
    setCartCount(0);
    setCartItems([]);
    setUniqueCartItems([]);
  };

  useEffect(() => {
    setCartCount(0);
    setCartItems([]);
    setUniqueCartItems([]);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartCount,
        addToCart,
        cartItems,
        cleanCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export { CartProvider };
