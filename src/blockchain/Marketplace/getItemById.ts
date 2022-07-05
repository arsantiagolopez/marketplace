import { Contract, ethers } from "ethers";
import Marketplace from "../../../artifacts/contracts/Marketplace.sol/Marketplace.json";
import { MARKETPLACE_ADDRESS } from "../../../config";
import { ItemEntity } from "../../types";
import { readIPFSField } from "../../utils/readIPFSField";
import { usePrices } from "../../utils/usePrices";

/**
 * Get item by ID.
 * @returns an item entity.
 */
const getItemById = async (
  id: number,
  ethRate: string
): Promise<ItemEntity | undefined> => {
  let item: ItemEntity | undefined;

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const marketplaceContract: Contract = new ethers.Contract(
    MARKETPLACE_ADDRESS,
    Marketplace.abi,
    provider
  );

  const data = await marketplaceContract.items(id);

  let [itemId, token] = data;
  let [tokenId, tokenContract, tokenHash, price, seller] = token;

  // Return undefined if item doesn't exist
  if (seller === "0x0000000000000000000000000000000000000000") {
    return undefined;
  }

  // Convert values to readable
  itemId = itemId.toNumber();
  tokenId = tokenId.toNumber();
  price = ethers.utils.formatUnits(String(price), "ether");

  // Read values from IPFS metadata
  const name = await readIPFSField({ cid: tokenHash, property: "name" });
  const image = await readIPFSField({ cid: tokenHash, property: "image" });

  // Convert price to PricesEntity
  const { convertPrice } = usePrices({ ethRate: ethRate! });

  const prices = {
    eth: price,
    usd: convertPrice(price, "USD"),
  };

  item = {
    itemId,
    name,
    image,
    token: {
      tokenId,
      tokenContract,
      tokenHash,
      prices,
      seller,
    },
  } as ItemEntity;

  return item;
};

export { getItemById };
