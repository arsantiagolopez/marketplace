import { PricesEntity } from "../types";

interface Response {
  eth: string;
  usd: string;
  convertPrice: (price: string, to: string) => string;
}

interface Props {
  currency?: string;
  prices?: PricesEntity;
  ethRate?: string;
}

const usePrices = ({ currency, prices, ethRate }: Props = {}): Response => {
  // Convert price to given currency (Supported, "ETH" or "USD")
  const convertPrice = (price: string, to: string): string => {
    let result = "";

    if (ethRate) {
      // Format ETH
      if (to === "ETH") {
        result = String(parseFloat(price) / parseFloat(ethRate));

        // Remove trailing zeros if whole
        if (parseInt(result) === parseFloat(result)) {
          result = String(parseInt(result));
        }

        // Round up to 6 decimals
        if (String(result).includes(".")) {
          result = parseFloat(result).toFixed(6);
        }

        // Format USD
      } else if (to === "USD") {
        result = String(parseFloat(price) * parseFloat(ethRate));

        // Round up to 2 decimals
        if (String(result).includes(".")) {
          result = parseFloat(result).toLocaleString();
        }
      }
    }

    return result;
  };

  const eth =
    prices && currency === "ETH"
      ? prices.eth
      : prices
      ? convertPrice(prices?.usd, "ETH")
      : "";
  const usd =
    prices && currency === "USD"
      ? prices.usd
      : prices
      ? convertPrice(prices?.eth, "USD")
      : "";

  return { convertPrice, eth, usd };
};

export { usePrices };
