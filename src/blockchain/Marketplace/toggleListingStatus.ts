import {
  Contract,
  ContractReceipt,
  ContractTransaction,
  ethers,
  Event,
} from "ethers";
import Marketplace from "../../../artifacts/contracts/Marketplace.sol/Marketplace.json";
import { MARKETPLACE_ADDRESS } from "../../../config";

/**
 * Toggle listing sale availability in the marketplace.
 * @param id Listing ID.
 * @returns a boolean of the current active state of listing.
 */
const toggleListingStatus = async (id: number): Promise<boolean> => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const account = await window.ethereum.request({ method: "eth_accounts" });
  const signer = provider.getSigner(account[0]);

  const marketplaceContract: Contract = new ethers.Contract(
    MARKETPLACE_ADDRESS,
    Marketplace.abi,
    signer
  );

  // Deactivate the listing
  const transaction: ContractTransaction =
    await marketplaceContract.toggleListingStatus(id);
  const receipt: ContractReceipt = await transaction.wait();

  // Get emitted event from listing deactivation
  const event: Event | undefined = receipt.events?.find(
    ({ event }) => event === "ListingStatusUpdated"
  );
  let [, isActive] = event?.args as any[];

  return isActive;
};

export { toggleListingStatus };
