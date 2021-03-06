// Check if session ? Allow to buy : show login button (take to login screen on click)

import Link from "next/link";
import React, { FC, useContext, useEffect, useState } from "react";
import { CgCheck } from "react-icons/cg";
import { getBalanceOfTokenById } from "../../blockchain/ERC1155Token";
import { PreferencesContext } from "../../context/PreferencesContext";
import {
  ItemEntity,
  ListingEntity,
  SellerProfileEntity,
  UserSession,
} from "../../types";
import { useEthPrice } from "../../utils/useEthPrice";
import { usePrices } from "../../utils/usePrices";
import { AddToCart } from "../AddToCart";
import { Dropdown } from "../Dropdown";
import { PriceTag } from "../PriceTag";
import { Tooltip } from "../Tooltip";

interface Props {
  session?: UserSession;
  sellerProfile?: SellerProfileEntity;
  listing?: ListingEntity;
  items?: ItemEntity[];
  allItems?: ItemEntity[];
}

const PublicListingView: FC<Props> = ({
  session,
  sellerProfile,
  listing,
  items,
  allItems,
}) => {
  const [quantity, setQuantity] = useState<number | undefined>(undefined);
  const [selectItemIds, setSelectItemIds] = useState<number[]>([]);

  const { currency, toggleCurrency } = useContext(PreferencesContext);

  const { image, name, description, token } = listing || {};
  const { tokenId, tokenContract, prices } = token || {};
  const { name: sellerName, address: sellerAddress } = sellerProfile || {};

  const isProfileCompleted = session && !!session.user?.name;

  const getSellersTokenBalance = async (id: number) => {
    try {
      const balance = await getBalanceOfTokenById({
        id,
        address: sellerAddress,
      });
      setQuantity(balance);
    } catch {
      console.log("Could not fetch the balance of tokens.");
    }
  };

  // Add extras to listing
  const handleAddToListing = (id: number) => {
    if (selectItemIds && !selectItemIds.includes(id)) {
      setSelectItemIds([...selectItemIds, id]);
    } else if (selectItemIds && selectItemIds.includes(id)) {
      const withoutSelected = selectItemIds.filter((item) => item !== id);
      setSelectItemIds(withoutSelected);
    }
  };
  const { ethRate } = useEthPrice();

  const priceTagProps = {
    currency,
    prices,
    isListing: true,
    items,
    selectItemIds,
    ethRate: ethRate!,
  };
  const addToCartProps = { listing, quantity, selectItemIds };

  // Get token quantity
  useEffect(() => {
    if (token) {
      getSellersTokenBalance(token.tokenId);
    }
  }, [token, sellerAddress]);

  return (
    <div className="relative flex flex-col md:justify-center min-h-screen bg-white mt-[-4rem] md:mt-[-5rem] pt-16 md:pt-20">
      <div className="absolute top-0 left-0 animate-[pulse_10s_ease-in-out_infinite] bg-gray-50 h-full w-full"></div>

      <div className="z-10 grid grid-cols-1 md:grid-cols-2 gap-8 mx-4 md:mx-[8%] pt-6 md:pt-8 min-h-[90vh]">
        <div className="md:sticky md:top-28 bg-gray-100 rounded-xl w-full h-full md:max-h-[80vh] shadow-2xl">
          <div className="w-full h-full aspect-square p-3 md:p-6">
            <img
              src={image}
              className="object-cover h-full w-full rounded-xl overflow-hidden"
            />
          </div>
        </div>

        <div className="z-10 flex flex-col w-full text-primary md:p-5">
          {/* Seller name */}
          {sellerName ? (
            <Link href={`/sellers/${sellerAddress}`}>
              <h1 className="font-Basic text-2xl tracking-tighter truncate w-fit cursor-pointer">
                {sellerName}'s
              </h1>
            </Link>
          ) : (
            <div className="flex flex-col w-36 h-8 animate-pulse bg-gray-100 rounded-md ml-1 shadow-md"></div>
          )}

          {/* Name */}
          <div className="flex flex-row w-fit font-Basic text-4xl md:text-6xl tracking-tighter py-2 my-3 md:my-4 pr-2 max-w-full truncate">
            {!name ? (
              <div className="h-12 w-56 bg-slate-100 rounded animate-pulse shadow-md"></div>
            ) : (
              <h1 className="text-primary truncate">{name}</h1>
            )}
          </div>

          {/* Quantity in stock */}
          <div className="pb-3 md:pb-3">
            {quantity ? (
              <h1 className="font-Basic text-xl tracking-tighter w-fit">
                Stock:
                <span className="font-light px-2">{quantity}</span>
              </h1>
            ) : (
              <div className="flex flex-col w-36 h-8 animate-pulse bg-gray-100 rounded-md ml-1 shadow-md"></div>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-row flex-wrap w-full py-3 md:py-4 text-tertiary">
            {!description ? (
              <div className="flex flex-col w-11/12 h-full animate-pulse">
                <div className="h-8 w-full bg-gray-100 mb-3 rounded-sm shadow-md"></div>
                <div className="h-8 w-full bg-gray-100 mb-3 rounded-sm shadow-md"></div>
                <div className="h-8 w-8/12 bg-gray-100 mb-3 rounded-sm shadow-md"></div>
              </div>
            ) : (
              <p className="text-tertiary">{description}</p>
            )}
          </div>

          {/* Price */}
          <div onClick={toggleCurrency} className="my-4 w-fit">
            <PriceTag {...priceTagProps} />
          </div>

          {/* Token Info */}
          <div className="py-4 md:py-6 md:px-5 w-full md:mx-[-1.25rem]">
            <Dropdown
              isDefaultOpen
              Button={
                <p className="font-Basic text-2xl tracking-tighter py-4">
                  Token info
                </p>
              }
              Panel={
                <div className="text-tertiary text-sm px-0 pb-4">
                  <p className="py-1">
                    <span className="text-primary font-semibold">
                      Seller address:{" "}
                    </span>
                    {sellerAddress}
                  </p>
                  <p className="py-1">
                    <span className="text-primary font-semibold">
                      Token Contract:{" "}
                    </span>
                    {tokenContract}
                  </p>
                  <p className="py-1">
                    <span className="text-primary font-semibold">
                      Token ID:{" "}
                    </span>
                    {tokenId}
                  </p>
                  {quantity ? (
                    <p className="py-1">
                      <span className="text-primary font-semibold">
                        Quantity:{" "}
                      </span>
                      1 of {quantity}
                    </p>
                  ) : null}
                </div>
              }
            />

            {/* Available Extras */}
            <Dropdown
              Button={
                <p className="font-Basic text-2xl tracking-tighter pb-4">
                  Add extras
                </p>
              }
              Panel={
                <div className="flex flex-nowrap items-centerspace-x-2 overflow-x-scroll px-0 md:mx-[-1.25rem] md:px-5 pb-6">
                  {items?.length || allItems?.length ? (
                    (items?.length ? items : allItems)?.map(
                      ({ itemId, name, image, token }) => {
                        const { eth: itemEth, usd: itemUsd } = usePrices({
                          currency,
                          prices: token?.prices,
                          ethRate: ethRate!,
                        });

                        const eth = itemEth;
                        const usd = itemUsd;

                        return (
                          <Tooltip
                            key={itemId}
                            label={`Add ${name} (+ ${
                              currency === "ETH" ? `${eth} ETH` : `$${usd}`
                            })`}
                            position="center"
                            fitWidth
                          >
                            <div
                              onClick={() => handleAddToListing(itemId)}
                              className={`relative flex justify-center items-center tooltip tooltip-bottom text-tertiary cursor-pointer hover:opacity-80 ml-2 ${
                                !image && "bg-gray-100 animate-pulse"
                              }`}
                            >
                              {image && (
                                <img
                                  src={image}
                                  className={`object-cover rounded-lg w-14 h-14 min-w-[3.5rem] ${
                                    selectItemIds?.includes(itemId) &&
                                    "brightness-[30%] bg-gray-50"
                                  }`}
                                />
                              )}
                              {selectItemIds?.includes(itemId) && (
                                <CgCheck className="z-10 absolute text-white text-3xl pointer-events-none animate-pulse" />
                              )}
                            </div>
                          </Tooltip>
                        );
                      }
                    )
                  ) : (
                    <p className="flex flex-row items-baseline text-tertiary">
                      Seller did not add any items to this listing.
                    </p>
                  )}
                </div>
              }
            />

            {/* Log in call to action */}
            {!session && (
              <Link href="/signin">
                <button className="flex flex-row items-center justify-center font-Basic text-sm rounded-full bg-primary px-6 py-2 my-4 mr-4 text-white w-auto hover:animate-pulse hover:bg-black">
                  Want it? Sign in.
                </button>
              </Link>
            )}

            {session && !isProfileCompleted && (
              <Link href="/register">
                <button className="flex flex-row items-center justify-center font-Basic text-sm rounded-full bg-primary px-6 py-2 my-4 mr-4 text-white w-auto hover:animate-pulse hover:bg-black">
                  Want it? Complete your profile.
                </button>
              </Link>
            )}

            {/* Add to cart button */}
            <AddToCart {...addToCartProps} />
          </div>
        </div>
      </div>
    </div>
  );
};

export { PublicListingView };
