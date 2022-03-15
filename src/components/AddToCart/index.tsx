import React, { FC, useContext, useState } from "react";
import { GoCheck } from "react-icons/go";
import { IoCartSharp } from "react-icons/io5";
import { getItemById } from "../../blockchain/Marketplace";
import { CartContext } from "../../context/CartContext";
import { CartItem, ItemEntity, ListingEntity } from "../../types";
import { useEthPrice } from "../../utils/useEthPrice";

interface Props {
  listing?: ListingEntity;
  quantity?: number;
  selectItemIds?: number[];
}

const AddToCart: FC<Props> = ({ listing, quantity, selectItemIds }) => {
  const [showUpdate, setShowUpdate] = useState<boolean>(false);
  const [helperMessage, setHelperMessage] = useState<string | null>(null);

  const { addToCart, cartItems } = useContext(CartContext);

  const { ethRate } = useEthPrice();

  const toggleMessage = (message?: string) => {
    setShowUpdate(true);
    if (message) setHelperMessage(message);
    setTimeout(() => {
      setShowUpdate(false);
      if (message) setHelperMessage(null);
    }, 2000);
  };

  // Add item to cart
  const handleAddToCart = async () => {
    if (listing && quantity && cartItems) {
      const isAlreadyInCart = cartItems.some(
        ({ listing: { listingId } }) => listingId === listing.listingId
      );

      // Get item entities
      let items: ItemEntity[] = [];

      if (selectItemIds?.length && ethRate) {
        for await (const id of selectItemIds) {
          try {
            const item = await getItemById(id, ethRate);
            items.push(item!);
          } catch {
            console.log("Items could not be fetched.");
          }
        }
      }

      const newCartItem: Partial<CartItem> = { listing, items };

      // Make sure enough stock available
      if (isAlreadyInCart) {
        const listingsWithSameListingId = cartItems.filter(
          ({ listing: { listingId } }) => listingId === listing.listingId
        );

        const listingInCartCount = listingsWithSameListingId.reduce(
          (acc, { quantity }) => acc + quantity!,
          0
        );

        // Only add listing to cart if enough quantity remaining
        if (listingInCartCount < quantity) {
          toggleMessage();
          addToCart(newCartItem);
        } else {
          toggleMessage("No more items in stock");
        }
      } else {
        toggleMessage();
        addToCart(newCartItem);
      }
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
