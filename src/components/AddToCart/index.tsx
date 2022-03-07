import React, { FC, useContext, useState } from "react";
import { GoCheck } from "react-icons/go";
import { IoCartSharp } from "react-icons/io5";
import { CartContext } from "../../context/CartContext";
import { ListingEntity } from "../../types";

interface Props {
  listing: ListingEntity;
  quantity: number;
}

const AddToCart: FC<Props> = ({ listing, quantity }) => {
  const [showUpdate, setShowUpdate] = useState<boolean>(false);
  const [helperMessage, setHelperMessage] = useState<string | null>(null);

  const { addToCart, cartListings } = useContext(CartContext);

  const toggleMessage = (message?: string) => {
    setShowUpdate(true);
    if (message) setHelperMessage(message);
    setTimeout(() => {
      setShowUpdate(false);
      if (message) setHelperMessage(null);
    }, 2000);
  };

  // Add item to cart
  const handleAddToCart = () => {
    const isAlreadyInCart = cartListings.some(
      ({ listingId }) => listing.listingId === listingId
    );

    if (isAlreadyInCart) {
      const listingInCartCount = cartListings.filter(
        ({ listingId }) => listingId === listing.listingId
      ).length;

      // Only add listing to cart if enough quantity remaining
      if (listingInCartCount < quantity) {
        toggleMessage();
        addToCart(listing);
      } else {
        toggleMessage("Max quantity reached");
      }
    } else {
      toggleMessage();
      addToCart(listing);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`button flex flex-row justify-center w-full md:w-fit my-6 hover:animate-pulse hover:bg-black ${
        showUpdate && "animate-pulse"
      }`}
    >
      {showUpdate ? (
        <span className="animate-pulse">
          {helperMessage ? (
            <span>{helperMessage}</span>
          ) : (
            <span className="flex flex-row items-center">
              Added to cart <GoCheck className="ml-2" />
            </span>
          )}
        </span>
      ) : (
        <span className="flex flex-row items-center">
          Add to cart <IoCartSharp className="ml-2" />
        </span>
      )}
    </button>
  );
};

export { AddToCart };
