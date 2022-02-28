import React, { FC, MouseEventHandler, useContext } from "react";
import { PreferencesContext } from "../../context/PreferencesContext";
import { useFormatPrice } from "../../utils/useFormatPrice";

interface Props {
  price?: string;
}

const PriceLabel: FC<Props> = ({ price }) => {
  const { currency, toggleCurrency } = useContext(PreferencesContext);

  const { usd, eth } = useFormatPrice(price!) || {};
  const formattedPrice = price && currency === "ETH" ? eth : usd;

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    toggleCurrency();
  };

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
