import React, { FC, useEffect, useState } from "react";
import { IoPricetags } from "react-icons/io5";
import { ItemEntity } from "../../types";
import { getSecretEmoji } from "../../utils/getSecretEmoji";
import { useFormatPrice } from "../../utils/useFormatPrice";

interface Props {
  price?: string;
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

  const { usd, eth } = useFormatPrice(price!) || {};
  const formattedPrice =
    price && price !== "0" ? (currency === "ETH" ? eth : usd) : null;

  const isExpanded: boolean =
    !!price && !!itemsSelected && !!itemsSelected.length && isDetailed;

  // Only allow toggle for listings
  const toggleIsDetailed = () => isListing && setIsDetailed(!isDetailed);

  // Check item name, return emoji instead of name if name contains emoji keyword
  const getNameOrEmoji = (name: string): string => getSecretEmoji(name) || name;

  useEffect(() => {
    if (items && selectItemIds && selectItemIds.length) {
      const itemsWithId = items?.filter(({ itemId }) =>
        selectItemIds.includes(String(itemId))
      );
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
            {itemsSelected?.map(({ itemId, name, token: { price } }, index) => {
              let finalPrice =
                currency === "ETH"
                  ? `~${parseFloat(String(price)).toFixed(6)} ETH`
                  : `$${Number(price).toLocaleString()}`;

              return (
                <p key={itemId} className="font-Basic text-lg capitalize ml-1">
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
