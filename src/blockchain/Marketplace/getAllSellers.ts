import { Contract, ethers } from "ethers";
import Marketplace from "../../../artifacts/contracts/Marketplace.sol/Marketplace.json";
import { MARKETPLACE_ADDRESS } from "../../../config";

/**
 * Get all addresses of sellers in the marketplace.
 * @returns a list of addresses.
 */
const getAllSellers = async (): Promise<string[] | undefined> => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const marketplaceContract: Contract = new ethers.Contract(
    MARKETPLACE_ADDRESS,
    Marketplace.abi,
    provider
  );

  const data = await marketplaceContract.getAllSellers();

  return data;
};

export { getAllSellers };
