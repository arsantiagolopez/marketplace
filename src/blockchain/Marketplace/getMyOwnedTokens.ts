import { Contract, ethers } from "ethers";
import Marketplace from "../../../artifacts/contracts/Marketplace.sol/Marketplace.json";
import { MARKETPLACE_ADDRESS } from "../../../config";
import { ListingEntity } from "../../types";
import { getAllListings } from "./getAllListings";

/**
 * Get all my owned tokens.
 * @returns an array of my tokens.
 */
const getMyOwnedTokens = async (): Promise<ListingEntity[]> => {
  let listings: ListingEntity[] = [];

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

  let tokens: number[] = [];

  // Convert values to readable
  for (let tokenId of data) {
    tokenId = tokenId.toNumber();
    tokens.push(tokenId);
  }

  // Get all listings
  const allListings = await getAllListings();

  // Filter listings with token IDs in tokens
  listings = allListings.filter(({ token: { tokenId } }) =>
    tokens.includes(tokenId)
  );

  return listings;
};

export { getMyOwnedTokens };
