import React, { FC, useEffect, useState } from "react";
import { IoPricetags } from "react-icons/io5";
import { ItemEntity } from "../../types";
import { getSecretEmoji } from "../../utils/getSecretEmoji";

interface Props {
  price?: number | string;
  currency: string;
  isListing?: boolean;
  items?: ItemEntity[];
  selectItemIds?: string[] | null;
}

const PriceTag: FC<Props> = ({
  price,
  currency,
  isListing,
  items,
  selectItemIds,
}) => {
  const [isDetailed, setIsDetailed] = useState<boolean>(true);
  const [itemsSelected, setItemsSelected] = useState<ItemEntity[] | null>(null);

  const isExpanded: boolean =
    !!price && !!itemsSelected && !!itemsSelected.length && isDetailed;

  const getFormattedUsd = (price: number) =>
    price &&
    (price.toString().includes(".") ? Number(price).toFixed(2) : price);

  const getFormattedEth = (price: number) =>
    price &&
    (price.toString().length > 7
      ? `~${parseFloat(price.toString()).toFixed(5)}`
      : price.toString());

  const formattedPrice =
    price && currency === "USD"
      ? getFormattedUsd(Number(price))
      : currency === "ETH"
      ? getFormattedEth(Number(price))
      : null;

  // Only allow toggle for listings
  const toggleIsDetailed = () => isListing && setIsDetailed(!isDetailed);

  // Check item name, return emoji instead of name if name contains emoji keyword
  const getNameOrEmoji = (name: string): string => getSecretEmoji(name) || name;

  useEffect(() => {
    if (items && selectItemIds && selectItemIds.length) {
      const itemsWithId = items?.filter(({ id }) => selectItemIds.includes(id));
      setIsDetailed(true);
      setItemsSelected(itemsWithId);
    } else {
      setIsDetailed(false);
      setItemsSelected(null);
    }
  }, [selectItemIds]);

  return (
    <div
      onClick={toggleIsDetailed}
      className={`relative flex flex-row items-center rounded-full shadow-lg h-12 px-6 w-fit hover:bg-primary hover:text-white transition-all ease-in-out duration-500 cursor-pointer max-w-full overflow-hidden ${
        isExpanded ? "bg-primary text-white" : "bg-white text-primary"
      }`}
    >
      <div
        className={`flex flex-row items-center min-w-fit h-full rounded-r-full ${
          isExpanded &&
          "my-3 pr-6 shadow-[50px_0px_50px_10px_rgba(255,255,255,0.2)]"
        }`}
      >
        <IoPricetags className="text-gray-300 text-xl mr-3" />
        <h1 className="font-Basic tracking-tight text-2xl flex flex-row items-center">
          {currency === "USD" ? (
            <span className="mx-1 mr-2 select-none">$</span>
          ) : (
            <img src="/currency/eth.png" className="h-5 mr-1" />
          )}

          {price ? (
            <span className="ml-1">{formattedPrice}</span>
          ) : (
            <div className="flex flex-col w-10 h-6 animate-pulse bg-gray-100 rounded-md ml-1"></div>
          )}
        </h1>
      </div>

      {/* Show detailed price */}
      <div className="items-center h-full w-full truncate">
        {isExpanded && (
          <div className="flex items-center w-full h-full pl-3 pr-1 overflow-x-scroll">
            {itemsSelected?.map(({ id, name, price }, index) => {
              const { usd, eth } = price || {};

              const roundedEth = eth ? parseFloat(eth).toFixed(5) : "";

              let finalPrice =
                currency === "USD"
                  ? `$${getFormattedUsd(usd!)}`
                  : `${getFormattedEth(parseFloat(roundedEth))} ETH`;

              return (
                <p key={id} className="font-Basic text-lg capitalize ml-1">
                  {getNameOrEmoji(name)} ({finalPrice}){" "}
                  {itemsSelected.length - 1 !== index && "+"}
                </p>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export { PriceTag };
