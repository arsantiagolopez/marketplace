import React, { FC } from "react";
import { IoPricetags } from "react-icons/io5";

interface Props {
  price: number;
  currency: string;
}

const PriceTag: FC<Props> = ({ price, currency }) => {
  return (
    <div className="flex flex-row items-center rounded-full shadow-lg h-12 py-2 px-6 w-fit bg-white text-primary hover:bg-primary hover:text-white transition-all ease-in-out duration-500 cursor-pointer">
      <IoPricetags className="text-gray-300 mr-3 text-xl" />
      <h1 className="font-Basic text-2xl flex items-center">
        {currency === "USD" ? (
          <span className="mx-1">$</span>
        ) : (
          <img src="/currency/eth.png" className="h-5 mr-1" />
        )}

        {price ? (
          <span className="ml-1 mr-2">{price}</span>
        ) : (
          <div className="flex flex-col w-10 h-6 animate-pulse bg-gray-100 rounded-md ml-1"></div>
        )}
      </h1>
    </div>
  );
};

export { PriceTag };
