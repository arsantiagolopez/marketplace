import { Contract, ethers } from "ethers";
import { getAllItems } from ".";
import Marketplace from "../../../artifacts/contracts/Marketplace.sol/Marketplace.json";
import { MARKETPLACE_ADDRESS } from "../../../config";
import { ItemEntity, ListingEntity } from "../../types";
import { getAllListings } from "./getAllListings";

/**
 * Get all my owned tokens.
 * @returns an array of my tokens.
 */
const getMyOwnedTokens = async (
  ethRate: string
): Promise<(ListingEntity | ItemEntity)[]> => {
  let listings: ListingEntity[] = [];
  let items: ItemEntity[] = [];
  let tokens: any[] = [];

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const account = await window.ethereum.request({ method: "eth_accounts" });
  const signer = provider.getSigner(account[0]);

  const marketplaceContract: Contract = new ethers.Contract(
    MARKETPLACE_ADDRESS,
    Marketplace.abi,
    signer
  );

  const data = await marketplaceContract.getMyOwnedTokenIds();

  if (!data.length) {
    return listings;
  }

  let tokenIds: number[] = [];

  // Convert values to readable
  for (let tokenId of data) {
    tokenId = tokenId.toNumber();
    tokenIds.push(tokenId);
  }

  // Get all listings
  const allListings = await getAllListings(ethRate);
  const allItems = await getAllItems(ethRate);

  // Filter listings with token IDs in tokens
  listings = allListings.filter(({ token: { tokenId } }) =>
    tokenIds.includes(tokenId)
  );

  items = allItems.filter(({ token: { tokenId } }) =>
    tokenIds.includes(tokenId)
  );

  tokens = [...listings, ...items];

  return tokens;
};

export { getMyOwnedTokens };
