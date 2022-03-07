import { Contract, ethers } from "ethers";
import Marketplace from "../../../artifacts/contracts/Marketplace.sol/Marketplace.json";
import { MARKETPLACE_ADDRESS } from "../../../config";
import { ItemEntity } from "../../types";
import { readIPFSField } from "../../utils/readIPFSField";

/**
 * Get all my items.
 * @returns an array of items.
 */
const getMyItems = async (): Promise<ItemEntity[]> => {
  let items: ItemEntity[] = [];

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const marketplaceContract: Contract = new ethers.Contract(
    MARKETPLACE_ADDRESS,
    Marketplace.abi,
    provider
  );

  const data = await marketplaceContract.getMyItems();

  if (!data.length) {
    return items;
  }

  for (const item of data) {
    let [itemId, token] = item;
    let [tokenId, tokenContract, tokenHash, price, seller] = token;

    // Convert values to readable
    itemId = itemId.toNumber();
    tokenId = tokenId.toNumber();
    price = ethers.utils.formatUnits(String(price), "ether");

    // Read values from IPFS metadata
    const name = await readIPFSField({ cid: tokenHash, property: "name" });
    const image = await readIPFSField({ cid: tokenHash, property: "image" });

    const newItem: ItemEntity = {
      itemId,
      name,
      image,
      token: {
        tokenId,
        tokenContract,
        tokenHash,
        price,
        seller,
      },
    };

    items.push(newItem);
  }

  return items;
};

export { getMyItems };
