import React, { FC, MouseEventHandler, useContext } from "react";
import { PreferencesContext } from "../../context/PreferencesContext";
import { ListingPriceEntity } from "../../types";

interface Props {
  price?: ListingPriceEntity;
}

const PriceLabel: FC<Props> = ({ price }) => {
  const { currency, toggleCurrency } = useContext(PreferencesContext);

  const { eth, usd } = (price as ListingPriceEntity) || {};

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    toggleCurrency();
  };

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
      ? getFormattedUsd(usd)
      : currency === "ETH"
      ? getFormattedEth(parseFloat(eth))
      : null;

  return (
    <button
      onClick={handleClick}
      className="absolute bottom-6 md:bottom-10 w-auto flex justify-center items-center rounded-full cursor-pointer"
    >
      <div className="flex flex-row items-center bg-white text-primary hover:bg-primary hover:text-white font-Basic tracking-tight text-xl rounded-full p-1 px-3 md:px-5 w-fit shadow-xl">
        {currency === "USD" ? (
          <span className="mx-1 mr-2 select-none">$</span>
        ) : (
          <img src="/currency/eth.png" className="h-5 mr-1" />
        )}

        {formattedPrice}
      </div>
    </button>
  );
};

export { PriceLabel };
