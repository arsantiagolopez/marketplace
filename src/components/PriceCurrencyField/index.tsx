import React, { ChangeEventHandler, FC, useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { CgArrowsExchangeAltV } from "react-icons/cg";
import { usePrices } from "../../utils/usePrices";

interface Props {
  priceRegister: UseFormRegisterReturn;
  validPriceField: boolean;
  currency: string;
  toggleCurrency: () => void;
  ethRate: string | null;
  setValue: any;
}

const PriceCurrencyField: FC<Props> = ({
  priceRegister,
  validPriceField,
  currency,
  toggleCurrency,
  ethRate,
  setValue,
}) => {
  const [price, setPrice] = useState<string>("");

  const { onChange, ...restRegister } = priceRegister;

  const { convertPrice } = usePrices({ ethRate: ethRate! });

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    let { value } = event.target;
    setPrice(value);
    onChange(event);
  };

  // Exchange between ETH and USD
  const handleExchange = () => {
    let updated = "";

    if (ethRate) {
      if (currency === "ETH") {
        updated = convertPrice(price, "USD");
      } else if (currency === "USD") {
        updated = convertPrice(price, "ETH");
      }

      // String to number conversion fix
      if (updated.includes(",")) {
        updated = updated.replace(",", "");
      }

      toggleCurrency();
      setPrice(updated);
      setValue("price", parseFloat(updated));
    } else {
      console.log("ETH Price could not be fetched.");
    }
  };

  return (
    <div className="w-full">
      <h1 className="title flex-row items-center">
        Price{" "}
        <span className="inline-block text-[16pt]">
          {currency === "ETH" ? (
            <span className="flex flex-row items-center">
              (<img src="/currency/eth.png" className="h-6" />)
            </span>
          ) : (
            "( 💵 )"
          )}
        </span>
      </h1>
      <div className="relative flex flex-row items-center w-full">
        <input
          type="number"
          step="0.000001"
          autoComplete="off"
          value={price}
          onChange={handleChange}
          className={`relative w-full py-2 md:py-2 pl-3 my-2 md:my-4 text-left bg-white rounded-lg shadow-md focus:outline-black ${
            !validPriceField && "animate-pulse"
          }`}
          placeholder={currency === "ETH" ? "0.00036 ETH" : "$25.00"}
          {...restRegister}
        />
        <button type="button" className="absolute right-1">
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
