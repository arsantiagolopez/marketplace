import { ItemPriceEntity, ListingPriceEntity } from "../types";

interface Props {
  currency: string;
  inputPrice: number;
  ethRate: string;
}

const getPriceData = ({
  currency,
  inputPrice,
  ethRate,
}: Props): Partial<ListingPriceEntity | ItemPriceEntity> | void => {
  let usd: number = 0;
  let eth: string = "";

  if (currency === "USD") {
    usd = Number(inputPrice);
    eth = (inputPrice / parseFloat(ethRate)).toString();
  } else if (currency === "ETH") {
    eth = inputPrice.toString();
    usd = inputPrice * parseFloat(ethRate);
  }

  // Format for db
  const prices: Partial<ListingPriceEntity | ItemPriceEntity> = {
    selectCurrency: currency,
    lockedEthRate: ethRate,
    usd,
    eth,
  };

  return prices;
};

export { getPriceData };
