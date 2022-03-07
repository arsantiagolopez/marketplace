import { useEffect, useState } from "react";
import { useEthPrice } from "./useEthPrice";

interface Response {
  /* ETH price */
  eth: string;
  /* USD price */
  usd?: string;
}

const useFormatPrice = (price: string): Response => {
  const [usdResult, setUsdResult] = useState<string | null>(null);

  const { result } = useEthPrice({ convertEthToUsd: parseFloat(price) });

  const formattedUsd = (value: string): string => {
    let usd = value;

    // Round up to 2 decimals
    if (String(usd).includes(".")) {
      usd = parseFloat(usd).toLocaleString();
    }

    // If rounded not exact, show estimate (~)
    if (parseFloat(usd) !== parseFloat(value)) {
      usd = `~${usd}`;
    }

    return String(usd);
  };

  const formattedEth = (value: string): string => {
    let eth = value;

    // Remove trailing zeros if whole
    if (parseInt(eth) === parseFloat(eth)) {
      eth = String(parseInt(eth));
    }

    // Round up to 6 decimals
    if (String(eth).includes(".")) {
      eth = parseFloat(eth).toFixed(6);
    }

    // If rounded not exact, show estimate (~)
    if (parseFloat(eth) !== parseFloat(value)) {
      eth = `~${eth}`;
    }

    return String(eth);
  };

  const usd = usdResult ? formattedUsd(usdResult) : undefined;
  const eth = formattedEth(price);

  useEffect(() => {
    if (result) {
      setUsdResult(result);
    }
  }, [result]);

  return { eth, usd };
};

export { useFormatPrice };
