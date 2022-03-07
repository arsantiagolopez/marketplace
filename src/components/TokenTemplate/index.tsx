import React, { FC, useContext, useEffect, useState } from "react";
import { getBalanceOfTokenById } from "../../blockchain";
import { PreferencesContext } from "../../context/PreferencesContext";
import { ListingEntity, UserSession } from "../../types";
import { useFormatPrice } from "../../utils/useFormatPrice";
import { Dropdown } from "../Dropdown";
import { Tooltip } from "../Tooltip";

interface Props {
  session?: UserSession;
  listing?: ListingEntity;
}

const TokenTemplate: FC<Props> = ({ session, listing }) => {
  const [quantity, setQuantity] = useState<number | null>(null);

  const { currency, toggleCurrency } = useContext(PreferencesContext);

  const { user } = session || {};
  const { image, name, description, token } = listing || {};
  const { tokenId, tokenContract, price, seller } = token || {};

  const { usd, eth } = useFormatPrice(price!) || {};
  const formattedPrice =
    price && price !== "0" ? (currency === "ETH" ? eth : usd) : null;

  const getTokenBalance = async (id: number) => {
    const balance = await getBalanceOfTokenById({
      id,
      address: user?.walletAddress,
    });
    setQuantity(balance);
  };

  let items = [];

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
        <div className="md:sticky md:top-28 bg-gray-100 rounded-xl w-full h-full md:max-h-[80vh] shadow-2xl">
          <div className="w-full h-full aspect-square p-3 md:p-6">
            <img
              src={image}
              className="object-cover h-full w-full rounded-xl overflow-hidden"
            />
          </div>
        </div>

        <div className="z-10 flex flex-col w-full text-primary md:p-5">
          {/* Name */}
          <div className="flex flex-row w-fit font-Basic text-4xl md:text-6xl tracking-tighter py-2 my-3 md:my-4 pr-2 max-w-full truncate">
            {!name ? (
              <div className="h-12 w-56 bg-slate-100 rounded animate-pulse shadow-md"></div>
            ) : (
              <h1 className="text-primary">{name}</h1>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-row flex-wrap w-full py-3 md:py-4 md:pb-10 text-tertiary">
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

          {/* Quantity in stock */}
          <div className="my-2 md:pb-3">
            {quantity ? (
              <h1 className="font-Basic text-xl tracking-tighter w-fit">
                Quantity owned:
                <span className="font-light px-2 text-tertiary">
                  {quantity}
                </span>
              </h1>
            ) : (
              <div className="flex flex-col w-36 h-8 animate-pulse bg-gray-100 rounded-md ml-1 shadow-md"></div>
            )}
          </div>

          {/* Price bought for */}
          <div onClick={toggleCurrency} className="w-fit pb-4">
            {price ? (
              <h1 className="flex flex-row items-center font-Basic text-xl tracking-tighter w-fit cursor-pointer">
                Paid:
                <span className="flex flex-row items-center text-tertiary ml-2">
                  {currency === "USD" ? (
                    <span className="mx-1 select-none">$</span>
                  ) : (
                    <img src="/currency/eth.png" className="h-5" />
                  )}
                  <span className="font-light px-2">{formattedPrice}</span>
                  {quantity && quantity > 1 ? "per token" : null}
                </span>
              </h1>
            ) : (
              <div className="flex flex-col w-36 h-8 animate-pulse bg-gray-100 rounded-md ml-1 shadow-md"></div>
            )}
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
                      Bought from:{" "}
                    </span>
                    {seller}
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

            {/* Extras */}
            <Dropdown
              Button={
                <p className="font-Basic text-2xl tracking-tighter pb-4">
                  Extras
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
                      Seller hasn't listed any extras.
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

export { TokenTemplate };
