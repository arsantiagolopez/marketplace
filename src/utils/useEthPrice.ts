import axios from "axios";
import { useEffect, useState } from "react";

interface Props {
  /* Convert amount passed from USD to ETH */
  convertUsdToEth?: number;
  /* Convert amount passed from ETH to USD */
  convertEthToUsd?: number;
}

interface Response {
  /* Current ETH price rate */
  ethRate: string | null;
  /* Result of either convertUsdToEth or convertEthToUsd if ether passed */
  result: string | null;
}

const useEthPrice = ({
  convertUsdToEth,
  convertEthToUsd,
}: Props = {}): Response => {
  const [ethRate, setEthRate] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  // Get current USD price rate for ETH
  const getPrice = async (): Promise<void> => {
    const COINBASE_API_ENDPOINT = "https://api.coinbase.com/v2/exchange-rates";

    try {
      const { data, status } = await axios.get(`${COINBASE_API_ENDPOINT}`, {
        params: { currency: "ETH" },
      });

      if (status !== 200) {
        return setEthRate(null);
      }

      const { rates } = data?.data;

      setEthRate(rates["USD"]);
    } catch (err) {
      console.log("Could not fetch ETH price from Coinbase's API.");
      return;
    }
  };

  // Convert USD to ETH
  const usdToEth = (amount: number) => {
    const ETH = parseFloat(ethRate!) / amount;
    setResult(ETH.toString());
  };

  // Convert ETH to USD
  const ethToUsd = (amount: number) => {
    const USD = amount * parseFloat(ethRate!);
    setResult(USD.toString());
  };

  useEffect(() => {
    getPrice();
  }, []);

  // Get exchange rate if requested
  useEffect(() => {
    if (ethRate) {
      if (convertUsdToEth) usdToEth(convertUsdToEth);
      if (convertEthToUsd) ethToUsd(convertEthToUsd);
    }
  }, [ethRate, convertUsdToEth, convertEthToUsd]);

  return { ethRate, result };
};

export { useEthPrice };
