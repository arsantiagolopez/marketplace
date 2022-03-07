// @todo: Check if session ? Allow to buy : show login button (take to login screen on click)

import Link from "next/link";
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { HiExternalLink } from "react-icons/hi";
import { IoPauseSharp, IoPlaySharp } from "react-icons/io5";
import { getBalanceOfTokenById } from "../../blockchain";
import { toggleListingStatus } from "../../blockchain/Marketplace";
import { PreferencesContext } from "../../context/PreferencesContext";
import { ListingEntity, SellerProfileEntity } from "../../types";
import { useItems } from "../../utils/useItems";
import { Dropdown } from "../Dropdown";
import { PriceTag } from "../PriceTag";
import { Tooltip } from "../Tooltip";

interface Props {
  sellerProfile?: SellerProfileEntity;
  listing?: ListingEntity;
  setListing: Dispatch<SetStateAction<ListingEntity | undefined>>;
}

const SellerListingView: FC<Props> = ({
  sellerProfile,
  listing,
  setListing,
}) => {
  const [quantity, setQuantity] = useState<number | null>(null);

  const { currency, toggleCurrency } = useContext(PreferencesContext);

  const { items } = useItems();

  const {
    token,
    isActive,
    name,
    description,
    image,
    // items,
  } = listing || {};
  const { tokenId, tokenContract, price } = token || {};
  const { name: sellerName, address: sellerAddress } = sellerProfile || {};

  const getTokenBalance = async (id: number) => {
    const balance = await getBalanceOfTokenById({ id });
    setQuantity(balance);
  };

  // Pause item from being sold on the marketplace
  const toggleIsActive = async () => {
    if (listing) {
      if (typeof tokenId === "number") {
        const isActive = await toggleListingStatus(tokenId);
        setListing({ ...listing, isActive });
      }
    }
  };

  const priceTagProps = { currency, price, isListing: true };

  // Get token quantity
  useEffect(() => {
    if (token) {
      getTokenBalance(token.tokenId);
    }
  }, [token]);

  return (
    <div className="relative flex flex-col md:justify-center min-h-screen bg-white mt-[-4rem] md:mt-[-5rem] pt-16 md:pt-20">
      <div className="absolute top-0 left-0 animate-[pulse_10s_ease-in-out_infinite] bg-gray-50 h-full w-full"></div>

      <div className="z-10 grid grid-cols-1 md:grid-cols-2 gap-8 mx-4 md:mx-[8%] pt-6 md:pt-8 min-h-[90vh]">
        <div className="relative md:sticky md:top-28 rounded-xl w-full h-full md:max-h-[80vh] shadow-2xl">
          <div className="w-full h-full aspect-square p-3 md:p-6">
            <img
              src={image}
              className={`object-cover h-full w-full rounded-xl overflow-hidden ${
                !image && "bg-gray-200 animate-pulse"
              }`}
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
              <h1 className={`text-primary ${!isActive && "pr-4"}`}>
                {name}
                {!isActive && (
                  <span className="text-2xl tracking-tighter text-tertiary italic ml-2">
                    (paused)
                  </span>
                )}
              </h1>
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
          <button onClick={toggleCurrency} className="my-4 w-fit">
            <PriceTag {...priceTagProps} />
          </button>

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
                  Available extras
                </p>
              }
              Panel={
                <div className="flex flex-nowrap items-centerspace-x-2 overflow-x-scroll px-0 md:mx-[-1.25rem] md:px-5 pb-6">
                  {items?.length ? (
                    items?.map(({ itemId, name, image, token: { price } }) => (
                      <Tooltip
                        key={itemId}
                        label={`${name} (+ ${
                          currency === "ETH"
                            ? `~${parseFloat(String(price)).toFixed(6)} ETH`
                            : `$${Number(price).toLocaleString()}`
                        })`}
                        position="center"
                        fitWidth
                      >
                        <div
                          className={`tooltip tooltip-bottom text-tertiary cursor-pointer hover:opacity-80 ${
                            !image && "bg-gray-100 animate-pulse"
                          }`}
                        >
                          {image && (
                            <img
                              src={image}
                              className="object-cover rounded-lg w-14 h-14 min-w-[3.5rem]"
                            />
                          )}
                        </div>
                      </Tooltip>
                    ))
                  ) : (
                    <p className="flex flex-row items-baseline text-tertiary text-sm">
                      No items listed.{" "}
                      <Link href="/items/create">
                        <span className="flex flex-row items-baseline ml-1 hover:underline hover:cursor-pointer">
                          Create some{" "}
                          <HiExternalLink className="text-xs text-gray-300 ml-1 mt-auto" />
                        </span>
                      </Link>
                    </p>
                  )}
                </div>
              }
            />

            {/* Admin Actions */}
            <div className="flex flex-col w-full md:w-fit py-6">
              <button
                onClick={toggleIsActive}
                className="button flex flex-row items-center justify-center px-8 pr-7 py-2 my-2 w-auto md:w-fit hover:animate-pulse hover:bg-black"
              >
                Make {isActive ? "inactive" : "active"}
                {isActive ? (
                  <IoPauseSharp className="ml-2" />
                ) : (
                  <IoPlaySharp className="ml-2" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SellerListingView };
