// @todo: Check if session ? Allow to buy : show login button (take to login screen on click)

import Link from "next/link";
import React, { FC, useContext, useEffect, useState } from "react";
import { HiExternalLink } from "react-icons/hi";
import { KeyedMutator } from "swr";
import { PreferencesContext } from "../../../context/PreferencesContext";
import { ListingEntity, SellerProfileEntity } from "../../../types";
import { Dropdown } from "../../Dropdown";
import { Tooltip } from "../../Tooltip";
import { DescriptionEditable } from "./DescriptionEditable";
import { ImageEditable } from "./ImageEditable";
import { NameEditable } from "./NameEditable";
import { PriceEditable } from "./PriceEditable";

interface Props {
  sellerProfile?: SellerProfileEntity;
  listing?: ListingEntity;
  mutate: KeyedMutator<ListingEntity>;
}

const SellerListingView: FC<Props> = ({ sellerProfile, listing, mutate }) => {
  const [activePrice, setActivePrice] = useState<number | string>("");

  const { currency, toggleCurrency } = useContext(PreferencesContext);

  const { image, name, description, price, tokenId, tokenContract, items } =
    listing || {};
  const { name: sellerName, address: sellerAddress } = sellerProfile || {};

  // Switch price on currency change
  const handleChangeCurrency = () => {
    if (currency === "USD") {
      setActivePrice(price?.eth!);
    } else {
      setActivePrice(price?.usd!);
    }
    toggleCurrency();
  };

  useEffect(() => {
    if (name) {
      setActivePrice(currency === "USD" ? price?.usd! : price?.eth!);
    }
  }, [name]);

  const nameEditableProps = { name, listing, mutate };
  const descriptionEditableProps = { description, listing, mutate };

  const priceEditableProps = {
    currency,
    activePrice,
    setActivePrice,
    handleChangeCurrency,
    listing,
    mutate,
  };
  const imageEditableProps = { image, listing, mutate };

  console.log(listing);

  return (
    <div className="relative flex flex-col md:justify-center min-h-screen bg-white mt-[-4rem] md:mt-[-5rem] pt-16 md:pt-20">
      <div className="absolute top-0 left-0 animate-[pulse_10s_ease-in-out_infinite] bg-gray-50 h-full w-full"></div>

      <div className="z-10 grid grid-cols-1 md:grid-cols-2 gap-8 mx-4 md:mx-[8%] pt-6 md:pt-8 min-h-[90vh]">
        <div className="relative md:sticky md:top-28 rounded-xl w-full h-full md:max-h-[80vh] shadow-2xl">
          <div className="w-full h-full aspect-square p-3 md:p-6">
            <img
              src={image}
              className="object-cover h-full w-full rounded-xl overflow-hidden"
            />
            <ImageEditable {...imageEditableProps} />
          </div>
        </div>

        <div className="z-10 flex flex-col w-full text-primary md:p-5">
          {sellerName ? (
            <Link href={`/sellers/${sellerAddress}`}>
              <h1 className="font-Basic text-2xl tracking-tighter truncate w-fit cursor-pointer">
                {sellerName}'s
              </h1>
            </Link>
          ) : (
            <div className="flex flex-col w-36 h-8 animate-pulse bg-gray-100 rounded-md ml-1 shadow-md"></div>
          )}

          <NameEditable {...nameEditableProps} />

          <DescriptionEditable {...descriptionEditableProps} />

          <PriceEditable {...priceEditableProps} />

          <div className="py-10 md:py-6 w-full md:mx-[-1.25rem] md:px-5">
            <Dropdown
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
                </div>
              }
            />
            <Dropdown
              Button={
                <p className="font-Basic text-2xl tracking-tighter pb-4">
                  Available extras
                </p>
              }
              Panel={
                <div className="flex flex-nowrap items-centerspace-x-2 overflow-x-scroll px-0 md:mx-[-1.25rem] md:px-5 pb-6">
                  {items?.length ? (
                    items?.map(({ id, name, image, price }) => (
                      <Tooltip
                        key={id}
                        label={`${name} (+ ${
                          currency === "USD"
                            ? `$${price?.usd}`
                            : `~${parseFloat(price?.eth || "").toFixed(6)} ETH`
                        })`}
                        position="center"
                        fitWidth
                      >
                        <div className="tooltip tooltip-bottom text-tertiary cursor-pointer hover:opacity-80">
                          <img
                            src={image}
                            className="object-cover rounded-lg w-14 h-14 min-w-[3.5rem]"
                          />
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
          </div>
        </div>
      </div>
    </div>
  );
};

export { SellerListingView };
