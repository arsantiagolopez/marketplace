import React, { Dispatch, FC, SetStateAction } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { CgArrowsExchangeAltV } from "react-icons/cg";

interface Props {
  priceRegister: UseFormRegisterReturn;
  validPriceField: boolean;
  currency: string;
  setCurrency: Dispatch<SetStateAction<string>>;
}

const PriceCurrencyField: FC<Props> = ({
  priceRegister,
  validPriceField,
  currency,
  setCurrency,
}) => {
  const handleExchange = () => {
    if (currency === "USD") {
      setCurrency("ETH");
    } else {
      setCurrency("USD");
    }
  };

  return (
    <div className="w-full">
      <h1 className="title flex-row items-center">
        Price{" "}
        <span className="inline-block text-[16pt]">
          {currency === "USD" ? (
            "( 💵 )"
          ) : (
            <span className="flex flex-row items-center">
              (<img src="/currency/eth.png" className="h-6" />)
            </span>
          )}
        </span>
      </h1>
      <div className="relative flex flex-row items-center w-full">
        <input
          type="number"
          autoComplete="off"
          className={`relative w-full py-2 md:py-2 pl-3 my-2 md:my-4 text-left bg-white rounded-lg shadow-md focus:outline-black ${
            !validPriceField && "animate-pulse"
          }`}
          placeholder={currency === "USD" ? "$25.00" : "0.00036 ETH"}
          {...priceRegister}
        />
        <button className="absolute right-1">
          <CgArrowsExchangeAltV
            onClick={handleExchange}
            className={`text-3xl hover:text-primary ${
              validPriceField ? "text-green-500" : "text-gray-300"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export { PriceCurrencyField };
